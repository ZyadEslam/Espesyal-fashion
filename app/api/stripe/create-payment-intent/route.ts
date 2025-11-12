import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-10-29.clover",
});

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    if (!amount || amount < 50) {
      return NextResponse.json(
        { error: "Invalid amount. Minimum amount is $0.50" },
        { status: 400 }
      );
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe secret key is not configured" },
        { status: 500 }
      );
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create payment intent";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

