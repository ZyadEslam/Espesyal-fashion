import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Order from "@/app/models/order";
import { requireAdmin } from "@/lib/adminAuth";
import { sseManager } from "@/lib/sse";
import { Types } from "mongoose";

interface Params {
  params: Promise<{ orderId: string }>;
}

// Type for populated order from Mongoose lean()
interface PopulatedOrder {
  _id: Types.ObjectId;
  date: Date;
  totalPrice: number;
  orderState: string;
  paymentStatus: string;
  paymentMethod: string;
  userId?: {
    _id: Types.ObjectId;
    name?: string;
    email?: string;
  };
  addressId?: {
    _id: Types.ObjectId;
    name?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
  };
  products?: Array<{
    _id: Types.ObjectId;
    name?: string;
    price?: number;
    images?: string[];
  }>;
  trackingNumber?: string;
  estimatedDeliveryDate?: Date;
  shippedDate?: Date;
  deliveredDate?: Date;
  promoCode?: string;
  discountAmount?: number;
  discountPercentage?: number;
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
    const populatedOrder = order as unknown as PopulatedOrder;
    const formattedOrder = {
      _id: populatedOrder._id.toString(),
      orderNumber: populatedOrder._id.toString().slice(-8).toUpperCase(),
      date: populatedOrder.date,
      totalPrice: populatedOrder.totalPrice,
      orderState: populatedOrder.orderState,
      paymentStatus: populatedOrder.paymentStatus,
      paymentMethod: populatedOrder.paymentMethod,
      userId: populatedOrder.userId?._id?.toString(),
      userName: populatedOrder.userId?.name || "Unknown",
      userEmail: populatedOrder.userId?.email || "Unknown",
      address: populatedOrder.addressId, // Map addressId to address
      products: populatedOrder.products || [],
      trackingNumber: populatedOrder.trackingNumber,
      estimatedDeliveryDate: populatedOrder.estimatedDeliveryDate,
      shippedDate: populatedOrder.shippedDate,
      deliveredDate: populatedOrder.deliveredDate,
      promoCode: populatedOrder.promoCode,
      discountAmount: populatedOrder.discountAmount || 0,
      discountPercentage: populatedOrder.discountPercentage,
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
    const populatedOrder = order as unknown as PopulatedOrder;
    sseManager.broadcast("order-updated", {
      orderId: populatedOrder._id.toString(),
      orderNumber: populatedOrder._id.toString().slice(-8).toUpperCase(),
      orderState: populatedOrder.orderState,
      updatedAt: new Date().toISOString(),
    });

    // Format order response to match expected structure
    const formattedOrder = {
      _id: populatedOrder._id.toString(),
      orderNumber: populatedOrder._id.toString().slice(-8).toUpperCase(),
      date: populatedOrder.date,
      totalPrice: populatedOrder.totalPrice,
      orderState: populatedOrder.orderState,
      paymentStatus: populatedOrder.paymentStatus,
      paymentMethod: populatedOrder.paymentMethod,
      userId: populatedOrder.userId?._id?.toString(),
      userName: populatedOrder.userId?.name || "Unknown",
      userEmail: populatedOrder.userId?.email || "Unknown",
      address: populatedOrder.addressId, // Map addressId to address
      products: populatedOrder.products || [],
      trackingNumber: populatedOrder.trackingNumber,
      estimatedDeliveryDate: populatedOrder.estimatedDeliveryDate,
      shippedDate: populatedOrder.shippedDate,
      deliveredDate: populatedOrder.deliveredDate,
      promoCode: populatedOrder.promoCode,
      discountAmount: populatedOrder.discountAmount || 0,
      discountPercentage: populatedOrder.discountPercentage,
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

