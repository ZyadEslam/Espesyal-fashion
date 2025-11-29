import { NextResponse } from "next/server";
import Order from "@/app/models/order";
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
      .populate("products.product")
      .populate("addressId")
      .populate("userId")
      .lean() as {
        _id: { toString: () => string };
        date: Date | string;
        totalPrice: number;
        orderState: string;
        paymentStatus: string;
        paymentMethod: string;
        products: unknown;
        addressId: unknown;
        userId?: unknown;
        trackingNumber?: string;
        estimatedDeliveryDate?: Date | string;
        shippedDate?: Date | string;
        deliveredDate?: Date | string;
        promoCode?: string;
        discountAmount?: number;
        discountPercentage?: number;
        stripePaymentIntentId?: string;
      } | null;

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    const clientProducts = Array.isArray(order.products)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ? order.products.map((item: any) => {
          if (item?.product) {
            const productDoc = item.product;
            const normalizedProduct = productDoc?.toObject
              ? productDoc.toObject()
              : productDoc;
            return {
              ...normalizedProduct,
              _id: normalizedProduct?._id || item.product,
              price: item.price ?? normalizedProduct?.price,
              quantityInCart: item.quantity ?? item.quantityInCart ?? 1,
              selectedColor: item.color || normalizedProduct?.color,
              selectedSize: item.size || normalizedProduct?.size,
              sku: item.sku || normalizedProduct?.sku,
              selectedVariantId: item.variantId?.toString?.(),
            };
          }
          return item;
        })
      : [];

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
          products: clientProducts,
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

