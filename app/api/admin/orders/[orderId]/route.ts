import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Order from "@/app/models/order";
import { requireAdmin } from "@/lib/adminAuth";
import { sseManager } from "@/lib/sse";

interface Params {
  params: Promise<{ orderId: string }>;
}

/**
 * GET: Fetch a single order by ID
 */
export async function GET(
  _req: NextRequest,
  { params }: Params
) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    await dbConnect();
    const { orderId } = await params;

    const order = await Order.findById(orderId)
      .populate({
        path: "userId",
        select: "name email",
      })
      .populate({
        path: "addressId",
        select: "name phone address city state",
      })
      .populate({
        path: "products",
        select: "name price images",
      })
      .lean();

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Format order response to match expected structure
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orderDoc = order as any;
    const formattedOrder = {
      _id: orderDoc._id.toString(),
      orderNumber: orderDoc._id.toString().slice(-8).toUpperCase(),
      date: orderDoc.date,
      totalPrice: orderDoc.totalPrice,
      orderState: orderDoc.orderState,
      paymentStatus: orderDoc.paymentStatus,
      paymentMethod: orderDoc.paymentMethod,
      userId: orderDoc.userId?._id?.toString(),
      userName: orderDoc.userId?.name || "Unknown",
      userEmail: orderDoc.userId?.email || "Unknown",
      address: orderDoc.addressId, // Map addressId to address
      products: orderDoc.products || [],
      trackingNumber: orderDoc.trackingNumber,
      estimatedDeliveryDate: orderDoc.estimatedDeliveryDate,
      shippedDate: orderDoc.shippedDate,
      deliveredDate: orderDoc.deliveredDate,
      promoCode: orderDoc.promoCode,
      discountAmount: orderDoc.discountAmount || 0,
      discountPercentage: orderDoc.discountPercentage,
    };

    return NextResponse.json(
      {
        order: formattedOrder,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

/**
 * PATCH: Update order status and details
 */
export async function PATCH(
  req: NextRequest,
  { params }: Params
) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    await dbConnect();
    const { orderId } = await params;
    const body = await req.json();

    const {
      orderState,
      trackingNumber,
      estimatedDeliveryDate,
      shippedDate,
      deliveredDate,
    } = body;

    // Validate orderState if provided
    const validStates = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (orderState && !validStates.includes(orderState)) {
      return NextResponse.json(
        { error: `Invalid order state. Must be one of: ${validStates.join(", ")}` },
        { status: 400 }
      );
    }

    // Build update object
    const updateData: Record<string, unknown> = {};
    
    if (orderState) updateData.orderState = orderState;
    if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;
    if (estimatedDeliveryDate) updateData.estimatedDeliveryDate = new Date(estimatedDeliveryDate);
    
    // Auto-set dates based on status
    if (orderState === "Shipped" && !shippedDate) {
      updateData.shippedDate = new Date();
    } else if (shippedDate) {
      updateData.shippedDate = new Date(shippedDate);
    }
    
    if (orderState === "Delivered" && !deliveredDate) {
      updateData.deliveredDate = new Date();
    } else if (deliveredDate) {
      updateData.deliveredDate = new Date(deliveredDate);
    }

    // Update order
    const order = await Order.findByIdAndUpdate(
      orderId,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate({
        path: "userId",
        select: "name email",
      })
      .populate({
        path: "addressId",
        select: "name phone address city state",
      })
      .populate({
        path: "products",
        select: "name price images",
      })
      .lean();

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Broadcast update via SSE
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orderDoc = order as any;
    sseManager.broadcast("order-updated", {
      orderId: orderDoc._id.toString(),
      orderNumber: orderDoc._id.toString().slice(-8).toUpperCase(),
      orderState: orderDoc.orderState,
      updatedAt: new Date().toISOString(),
    });

    // Format order response to match expected structure
    const formattedOrder = {
      _id: orderDoc._id.toString(),
      orderNumber: orderDoc._id.toString().slice(-8).toUpperCase(),
      date: orderDoc.date,
      totalPrice: orderDoc.totalPrice,
      orderState: orderDoc.orderState,
      paymentStatus: orderDoc.paymentStatus,
      paymentMethod: orderDoc.paymentMethod,
      userId: orderDoc.userId?._id?.toString(),
      userName: orderDoc.userId?.name || "Unknown",
      userEmail: orderDoc.userId?.email || "Unknown",
      address: orderDoc.addressId, // Map addressId to address
      products: orderDoc.products || [],
      trackingNumber: orderDoc.trackingNumber,
      estimatedDeliveryDate: orderDoc.estimatedDeliveryDate,
      shippedDate: orderDoc.shippedDate,
      deliveredDate: orderDoc.deliveredDate,
      promoCode: orderDoc.promoCode,
      discountAmount: orderDoc.discountAmount || 0,
      discountPercentage: orderDoc.discountPercentage,
    };

    return NextResponse.json(
      {
        message: "Order updated successfully",
        order: formattedOrder,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

