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
    const formattedOrder = {
      _id: (order as any)._id.toString(),
      orderNumber: (order as any)._id.toString().slice(-8).toUpperCase(),
      date: (order as any).date,
      totalPrice: (order as any).totalPrice,
      orderState: (order as any).orderState,
      paymentStatus: (order as any).paymentStatus,
      paymentMethod: (order as any).paymentMethod,
      userId: (order as any).userId?._id?.toString(),
      userName: (order as any).userId?.name || "Unknown",
      userEmail: (order as any).userId?.email || "Unknown",
      address: (order as any).addressId, // Map addressId to address
      products: (order as any).products || [],
      trackingNumber: (order as any).trackingNumber,
      estimatedDeliveryDate: (order as any).estimatedDeliveryDate,
      shippedDate: (order as any).shippedDate,
      deliveredDate: (order as any).deliveredDate,
      promoCode: (order as any).promoCode,
      discountAmount: (order as any).discountAmount || 0,
      discountPercentage: (order as any).discountPercentage,
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
    sseManager.broadcast("order-updated", {
      orderId: (order as any)._id.toString(),
      orderNumber: (order as any)._id.toString().slice(-8).toUpperCase(),
      orderState: (order as any).orderState,
      updatedAt: new Date().toISOString(),
    });

    // Format order response to match expected structure
    const formattedOrder = {
      _id: (order as any)._id.toString(),
      orderNumber: (order as any)._id.toString().slice(-8).toUpperCase(),
      date: (order as any).date,
      totalPrice: (order as any).totalPrice,
      orderState: (order as any).orderState,
      paymentStatus: (order as any).paymentStatus,
      paymentMethod: (order as any).paymentMethod,
      userId: (order as any).userId?._id?.toString(),
      userName: (order as any).userId?.name || "Unknown",
      userEmail: (order as any).userId?.email || "Unknown",
      address: (order as any).addressId, // Map addressId to address
      products: (order as any).products || [],
      trackingNumber: (order as any).trackingNumber,
      estimatedDeliveryDate: (order as any).estimatedDeliveryDate,
      shippedDate: (order as any).shippedDate,
      deliveredDate: (order as any).deliveredDate,
      promoCode: (order as any).promoCode,
      discountAmount: (order as any).discountAmount || 0,
      discountPercentage: (order as any).discountPercentage,
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

