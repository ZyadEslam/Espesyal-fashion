import { NextRequest, NextResponse } from "next/server";
import Product from "@/app/models/product";
import connectDB from "@/app/utils/db";
import { StaticImageData } from "next/image";

// Define the params type
interface Params {
  params: Promise<{ id: string }>;
}

// Define the product update type
interface ProductUpdateData {
  name?: string;
  description?: string;
  price?: number;
  oldPrice?: number;
  discount?: number;
  category?: string;
  brand?: string;
  color?: string;
  imgSrc?: StaticImageData[]; // Use a more specific type if you know the structure
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { message: "Product not found", success: false },
        { status: 404 }
      );
    }

    // Convert to plain object and keep the image data
    const productObj = product.toObject();

    // Instead of converting to base64, we'll use the image API endpoint
    productObj.imgSrc = productObj.imgSrc.map(
      (_: unknown, index: number) => `/api/product/image/${id}?index=${index}`
    );

    return NextResponse.json(
      { product: productObj, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { message: error, success: false },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    const {
      name,
      description,
      price,
      oldPrice,
      discount,
      category,
      brand,
      color,
      imgSrc,
    }: ProductUpdateData = await request.json();

    const product = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        oldPrice,
        discount,
        category,
        brand,
        color,
        imgSrc,
      },
      { new: true }
    );

    if (!product) {
      return NextResponse.json(
        { message: "Product not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Product updated successfully", product, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { message: error, success: false },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json(
        { message: "Product not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Product deleted successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { message: error, success: false },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    const {
      name,
      description,
      price,
      oldPrice,
      discount,
      category,
      brand,
      color,
      imgSrc,
    }: ProductUpdateData = await request.json();

    const product = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        oldPrice,
        discount,
        category,
        brand,
        color,
        imgSrc,
      },
      { new: true }
    );

    if (!product) {
      return NextResponse.json(
        { message: "Product not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Product updated successfully", product, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { message: error, success: false },
      { status: 500 }
    );
  }
}
