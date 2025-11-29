import { NextResponse } from "next/server";
import Order from "@/app/models/order";
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
    const orders = (await Order.find({ userId })
      .populate("products.product")
      .populate("addressId")
      .sort({ date: -1 }) // Newest first
      .lean()) as unknown as Array<{
      _id: { toString: () => string };
      date: Date | string;
      totalPrice: number;
      orderState: string;
      paymentStatus: string;
      paymentMethod: string;
      products: unknown;
      addressId: unknown;
      trackingNumber?: string;
      estimatedDeliveryDate?: Date | string;
      shippedDate?: Date | string;
      deliveredDate?: Date | string;
      promoCode?: string;
      discountAmount?: number;
    }>;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapProductsForClient = (products: any[] = []) =>
      products.map((item) => {
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
      });

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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          products: mapProductsForClient(order.products as any[]),
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

