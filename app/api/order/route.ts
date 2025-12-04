import { NextRequest, NextResponse } from "next/server";
import Order from "../../models/order";
import dbConnect from "@/lib/mongoose";
import { sseManager } from "@/lib/sse";
import User from "@/app/models/user";
import mongoose from "mongoose";
import Product from "@/app/models/product";
import { requireAuth, verifyOwnership } from "@/lib/security/authMiddleware";
import { checkOrderRateLimit } from "@/lib/security/rateLimiter";
import { orderCreateSchema, safeParseInput } from "@/lib/security/validator";
import { createErrorResponse } from "@/lib/security/errorHandler";
import {
  logSecurityEvent,
  AuditEventType,
  extractRequestInfo,
} from "@/lib/security/auditLogger";

interface IncomingOrderProduct {
  _id?: string;
  productId?: string;
  variantId?: string;
  selectedVariantId?: string;
  size?: string;
  selectedSize?: string;
  color?: string;
  selectedColor?: string;
  quantityInCart?: number;
  quantity?: number;
  price?: number;
  variantSku?: string;
  sku?: string;
}

const normalizeOrderItems = (
  items: unknown[]
): {
  product: mongoose.Types.ObjectId;
  variantId?: mongoose.Types.ObjectId;
  size?: string;
  color?: string;
  sku?: string;
  quantity: number;
  price: number;
}[] => {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => {
      if (!item) return null;

      if (typeof item === "string" && mongoose.Types.ObjectId.isValid(item)) {
        return {
          product: new mongoose.Types.ObjectId(item),
          quantity: 1,
          price: 0,
        };
      }

      if (typeof item !== "object") {
        return null;
      }

      const {
        _id,
        productId,
        variantId,
        selectedVariantId,
        size,
        selectedSize,
        color,
        selectedColor,
        quantityInCart,
        quantity,
        price,
        variantSku,
        sku,
      } = item as IncomingOrderProduct;

      const resolvedProductId = productId || _id;

      if (
        !resolvedProductId ||
        !mongoose.Types.ObjectId.isValid(resolvedProductId)
      ) {
        return null;
      }

      const variantIdValue = variantId || selectedVariantId;
      const resolvedVariantId =
        variantIdValue && mongoose.Types.ObjectId.isValid(variantIdValue)
          ? new mongoose.Types.ObjectId(variantIdValue)
          : undefined;

      const resolvedQuantity = Number(quantityInCart ?? quantity ?? 1);

      return {
        product: new mongoose.Types.ObjectId(resolvedProductId),
        ...(resolvedVariantId && { variantId: resolvedVariantId }),
        ...((size || selectedSize) && { size: size || selectedSize }),
        ...((color || selectedColor) && { color: color || selectedColor }),
        ...(variantSku && { sku: variantSku }),
        ...(!variantSku && sku && { sku }),
        quantity: resolvedQuantity > 0 ? resolvedQuantity : 1,
        price: Number(price) || 0,
      };
    })
    .filter(Boolean) as {
    product: mongoose.Types.ObjectId;
    variantId?: mongoose.Types.ObjectId;
    size?: string;
    color?: string;
    sku?: string;
    quantity: number;
    price: number;
  }[];
};

export async function POST(req: NextRequest) {
  try {
    // 1. Require authentication
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
          message: "Authentication required",
        },
        { status: 401 }
      );
    }

    // 2. Rate limiting
    const rateLimitResult = await checkOrderRateLimit(req, session.user.id);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Too Many Requests",
          message: "Order rate limit exceeded. Please try again later.",
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

    // 3. Parse and validate input
    const body = await req.json();
    const validation = safeParseInput(orderCreateSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation Error",
          message: "Invalid order data",
          details: validation.errors.errors.map((e) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    const {
      userId,
      addressId,
      products,
      totalPrice,
      promoCode,
      discountAmount,
      discountPercentage,
      paymentMethod,
      stripePaymentIntentId,
      shippingFee,
    } = validation.data;

    // 4. Verify user owns the order (userId must match session user)
    if (!verifyOwnership(session.user.id, userId, session.user.isAdmin)) {
      const { ipAddress, userAgent } = extractRequestInfo(req);
      await logSecurityEvent(AuditEventType.UNAUTHORIZED_ACCESS, {
        userId: session.user.id,
        userEmail: session.user.email,
        ipAddress,
        userAgent,
        resource: "/api/order",
        action: "POST",
        result: "blocked",
        details: { attemptedUserId: userId },
      });

      return NextResponse.json(
        {
          success: false,
          error: "Forbidden",
          message: "Access denied",
        },
        { status: 403 }
      );
    }

    await dbConnect();

    const normalizedProducts = normalizeOrderItems(products);

    if (!normalizedProducts.length) {
      return NextResponse.json(
        { success: false, message: "Order must include valid products" },
        { status: 400 }
      );
    }

    const dbSession = await mongoose.startSession();
    let newOrder;
    try {
      dbSession.startTransaction();

      for (const item of normalizedProducts) {
        const productDoc = await Product.findById(item.product).session(
          dbSession
        );

        if (!productDoc) {
          throw new Error("One of the products in the order no longer exists.");
        }

        if (productDoc.variants?.length) {
          let variantSubdoc = null;

          // First, try to find variant by variantId if provided
          if (item.variantId) {
            variantSubdoc = productDoc.variants.id(item.variantId);
          }

          // If variantId not found or not provided, try to find by size and color
          if (!variantSubdoc && (item.size || item.color)) {
            variantSubdoc = productDoc.variants.find(
              (v: { size: string; color: string }) => {
                const sizeMatch = item.size ? v.size === item.size : true;
                const colorMatch = item.color ? v.color === item.color : true;
                return sizeMatch && colorMatch;
              }
            );
          }

          // If still not found, throw error
          if (!variantSubdoc) {
            throw new Error(
              `Missing or invalid variant selection for product "${productDoc.name}". Please ensure you've selected a valid size and color combination.`
            );
          }

          // Check stock availability
          if (variantSubdoc.quantity < item.quantity) {
            throw new Error(
              `Insufficient stock for ${productDoc.name} (${variantSubdoc.color} ${variantSubdoc.size}). Available: ${variantSubdoc.quantity}, Requested: ${item.quantity}`
            );
          }

          // Update the item with the found variantId for consistency
          item.variantId = variantSubdoc._id;

          // Deduct stock
          variantSubdoc.quantity -= item.quantity;
        } else {
          // If no variants exist, we currently allow the order without stock checks.
          // This can be extended to handle global stock if needed.
        }

        await productDoc.save({ session: dbSession });
      }

      newOrder = new Order({
        userId,
        addressId,
        products: normalizedProducts,
        totalPrice: +totalPrice,
        date: new Date().toISOString(),
        orderState: "Pending",
        paymentMethod: paymentMethod || "cash_on_delivery",
        paymentStatus:
          paymentMethod === "stripe" && stripePaymentIntentId
            ? "paid"
            : "pending",
        ...(promoCode && { promoCode }),
        ...(discountAmount !== undefined && {
          discountAmount: +discountAmount,
        }),
        ...(discountPercentage !== undefined && {
          discountPercentage: +discountPercentage,
        }),
        ...(stripePaymentIntentId && { stripePaymentIntentId }),
        ...(shippingFee !== undefined && { shippingFee: +shippingFee }),
      });
      await newOrder.save({ session: dbSession });

      await dbSession.commitTransaction();
    } catch (err) {
      await dbSession.abortTransaction();
      throw err;
    } finally {
      dbSession.endSession();
    }

    // Get user info for broadcast
    interface UserDoc {
      _id?: { toString: () => string };
      name?: string;
      email?: string;
      [key: string]: unknown;
    }

    const user = (await User.findById(userId)
      .select("name email")
      .lean()) as unknown as UserDoc | null;

    // Broadcast new order via SSE to all connected admin clients
    sseManager.broadcast("new-order", {
      orderId: newOrder._id.toString(),
      orderNumber: newOrder._id.toString().slice(-8).toUpperCase(),
      userId: user?._id?.toString(),
      userName: user?.name || "Unknown",
      userEmail: user?.email || "Unknown",
      totalPrice: newOrder.totalPrice,
      orderState: newOrder.orderState,
      paymentStatus: newOrder.paymentStatus,
      createdAt: newOrder.date,
    });

    // Log order creation
    const { ipAddress, userAgent } = extractRequestInfo(req);
    await logSecurityEvent(AuditEventType.ORDER_CREATED, {
      userId: session.user.id,
      userEmail: session.user.email,
      ipAddress,
      userAgent,
      resource: "/api/order",
      action: "POST",
      result: "success",
      details: {
        orderId: newOrder._id.toString(),
        totalPrice: newOrder.totalPrice,
        paymentMethod: newOrder.paymentMethod,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully",
        orderId: newOrder._id,
      },
      {
        status: 201,
        headers: {
          "X-RateLimit-Remaining": String(rateLimitResult.remaining),
        },
      }
    );
  } catch (error) {
    console.error("Error placing order:", error);
    return createErrorResponse(error, "Failed to place order");
  }
}
