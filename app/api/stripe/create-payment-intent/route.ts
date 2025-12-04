import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { requireAuth } from "@/lib/security/authMiddleware";
import { checkPaymentRateLimit } from "@/lib/security/rateLimiter";
import { paymentIntentSchema, safeParseInput } from "@/lib/security/validator";
import { createErrorResponse } from "@/lib/security/errorHandler";
import { logPaymentEvent, AuditEventType } from "@/lib/security/auditLogger";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-10-29.clover",
});

export async function POST(req: NextRequest) {
  try {
    // 1. Require authentication
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Authentication required" },
        { status: 401 }
      );
    }

    // 2. Rate limiting
    const rateLimitResult = await checkPaymentRateLimit(req, session.user.id);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: "Too Many Requests",
          message: "Payment rate limit exceeded. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              Math.ceil((rateLimitResult.reset - Date.now()) / 1000)
            ),
          },
        }
      );
    }

    // 3. Validate input
    const body = await req.json();
    const validation = safeParseInput(paymentIntentSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation Error",
          message: "Invalid payment request",
          details: validation.errors.errors.map((e) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    const { amount, orderId, currency = "usd" } = validation.data;

    // 4. Additional security checks
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Service Error", message: "Payment service unavailable" },
        { status: 500 }
      );
    }

    // 5. Verify order ownership if orderId is provided
    if (orderId) {
      // Import here to avoid circular dependencies
      const { default: Order } = await import("@/app/models/order");
      const { default: dbConnect } = await import("@/lib/mongoose");

      await dbConnect();
      const order = await Order.findOne({
        _id: orderId,
        userId: session.user.id,
      });

      if (!order) {
        await logPaymentEvent(
          AuditEventType.PAYMENT_FAILED,
          session.user.id,
          session.user.email,
          req,
          { reason: "Order ownership verification failed", orderId }
        );

        return NextResponse.json(
          {
            error: "Not Found",
            message: "Order not found or access denied",
          },
          { status: 404 }
        );
      }

      // Verify amount matches order total
      const orderTotal = Math.round(order.totalPrice * 100); // Convert to cents
      if (amount !== orderTotal) {
        return NextResponse.json(
          {
            error: "Validation Error",
            message: "Payment amount does not match order total",
          },
          { status: 400 }
        );
      }
    }

    // 6. Create payment intent with metadata
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: session.user.id,
        userEmail: session.user.email,
        ...(orderId && { orderId: orderId.toString() }),
      },
    });

    // 7. Log successful payment intent creation
    await logPaymentEvent(
      AuditEventType.PAYMENT_CREATED,
      session.user.id,
      session.user.email,
      req,
      {
        paymentIntentId: paymentIntent.id,
        amount,
        currency,
        orderId: orderId?.toString(),
      }
    );

    return NextResponse.json(
      {
        clientSecret: paymentIntent.client_secret,
      },
      {
        headers: {
          "X-RateLimit-Remaining": String(rateLimitResult.remaining),
        },
      }
    );
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return createErrorResponse(error, "Failed to create payment intent");
  }
}
