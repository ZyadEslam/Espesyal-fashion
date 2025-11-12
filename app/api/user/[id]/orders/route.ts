import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Order from "@/app/models/order";
import Address from "@/app/models/address";
import Product from "@/app/models/product";
import dbConnect from "@/lib/mongoose";


export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id: userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    // Models are registered by dbConnect() - proceed with query
    const orders = await Order.find({ userId })
      .populate("products")
      .populate("addressId")
      .sort({ date: -1 }) // Newest first
      .lean();

    return NextResponse.json(
      {
        success: true,
        orders: orders.map((order) => ({
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
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

