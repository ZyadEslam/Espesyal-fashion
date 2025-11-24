import { NextResponse } from "next/server";
import Order from "../../models/order";
import dbConnect from "@/lib/mongoose";
import { sseManager } from "@/lib/sse";
import User from "@/app/models/user";

export async function POST(req: Request) {
  try {
    await dbConnect();
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
    } = await req.json();
    if (
      !userId ||
      !addressId ||
      !products ||
      products.length === 0 ||
      !totalPrice
    ) {
      console.log(userId, addressId, products, totalPrice);

      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newOrder = new Order({
      userId,
      addressId,
      products,
      totalPrice: +totalPrice,
      date: new Date().toISOString(),
      orderState: "Pending",
      paymentMethod: paymentMethod || "cash_on_delivery",
      paymentStatus:
        paymentMethod === "stripe" && stripePaymentIntentId
          ? "paid"
          : "pending",
      ...(promoCode && { promoCode }),
      ...(discountAmount !== undefined && { discountAmount: +discountAmount }),
      ...(discountPercentage !== undefined && { discountPercentage: +discountPercentage }),
      ...(stripePaymentIntentId && { stripePaymentIntentId }),
    });
    await newOrder.save();

    // Get user info for broadcast
    const user = await User.findById(userId).select("name email").lean();

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

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully",
        orderId: newOrder._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error placing order:", error);
    return NextResponse.json(
      { success: false, message: "Failed to place order" },
      { status: 500 }
    );
  }
}
