import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Order from "@/app/models/order";
import User from "@/app/models/user";
import { requireAdmin } from "@/lib/adminAuth";
import { Types } from "mongoose";

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
 * GET: Fetch all orders with filtering and pagination
 */
export async function GET(req: NextRequest) {
  try {
    // Check admin access
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const orderNumber = searchParams.get("orderNumber");
    const username = searchParams.get("username");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "15");
    const skip = (page - 1) * limit;

    // Build query
    const query: Record<string, unknown> = {};

    // Filter by order number (last 8 chars of order ID)
    if (orderNumber) {
      // Try to find orders where the last 8 characters match
      const orderIdPattern = new RegExp(orderNumber.slice(-8) + "$", "i");
      query._id = { $regex: orderIdPattern };
    }

    // Filter by status
    if (status && status !== "all") {
      query.orderState = status;
    }

    // Filter by username (user name or email)
    if (username) {
      const users = await User.find({
        $or: [
          { name: { $regex: username, $options: "i" } },
          { email: { $regex: username, $options: "i" } },
        ],
      }).select("_id");
      
      if (users.length > 0) {
        query.userId = { $in: users.map((u) => u._id) };
      } else {
        // No users found, return empty result
        return NextResponse.json({
          orders: [],
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 0,
          },
        });
      }
    }

    // Get total count for pagination
    const total = await Order.countDocuments(query);

    // Fetch orders with populated data
    const orders = await Order.find(query)
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
      .sort({ date: -1 }) // Most recent first
      .skip(skip)
      .limit(limit)
      .lean();

    // Format orders for response
    const formattedOrders = (orders as unknown as PopulatedOrder[]).map((order) => ({
      _id: order._id.toString(),
      orderNumber: order._id.toString().slice(-8).toUpperCase(),
      date: order.date,
      totalPrice: order.totalPrice,
      orderState: order.orderState,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      userId: order.userId?._id?.toString(),
      userName: order.userId?.name || "Unknown",
      userEmail: order.userId?.email || "Unknown",
      address: order.addressId,
      products: order.products || [],
      trackingNumber: order.trackingNumber,
      estimatedDeliveryDate: order.estimatedDeliveryDate,
      shippedDate: order.shippedDate,
      deliveredDate: order.deliveredDate,
      promoCode: order.promoCode,
      discountAmount: order.discountAmount || 0,
      discountPercentage: order.discountPercentage,
    }));

    return NextResponse.json(
      {
        orders: formattedOrders,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

