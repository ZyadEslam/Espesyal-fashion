import { NextResponse } from "next/server";
import Order from "@/app/models/order";
import Address from "@/app/models/address";
import Product from "@/app/models/product";
import dbConnect from "@/lib/mongoose";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    await dbConnect();
    const { orderId } = await params;

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Order ID is required" },
        { status: 400 }
      );
    }

    const order = await Order.findById(orderId)
      .populate("products")
      .populate("addressId")
      .populate("userId")
      .lean();

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        order: {
          _id: order._id,
          orderNumber: order._id.toString().slice(-8).toUpperCase(),
          date: order.date,
          totalPrice: order.totalPrice,
          orderState: order.orderState,
          paymentStatus: order.paymentStatus,
          paymentMethod: order.paymentMethod,
          products: order.products,
          address: order.addressId,
          trackingNumber: order.trackingNumber,
          estimatedDeliveryDate: order.estimatedDeliveryDate,
          shippedDate: order.shippedDate,
          deliveredDate: order.deliveredDate,
          promoCode: order.promoCode,
          discountAmount: order.discountAmount,
          discountPercentage: order.discountPercentage,
          stripePaymentIntentId: order.stripePaymentIntentId,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

