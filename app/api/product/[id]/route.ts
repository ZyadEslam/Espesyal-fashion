import { NextRequest, NextResponse } from "next/server";
import Product from "@/app/models/product";
import Category from "@/app/models/category";
import connectDB from "@/app/utils/db";
import { StaticImageData } from "next/image";
import { sanitizeVariants, VariantInput } from "@/app/utils/variantUtils";
import {
  getCachedData,
  setCachedData,
  invalidateProductCaches,
  getProductCacheKey,
  CACHE_TTL,
} from "@/lib/cache";

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
  categoryName?: string;
  brand?: string;
  color?: string;
  imgSrc?: StaticImageData[]; // Use a more specific type if you know the structure
  hideFromHome?: boolean;
  variants?: VariantInput[];
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Product ID is required", success: false },
        { status: 400 }
      );
    }

    // Check cache first
    const cacheKey = getProductCacheKey(id);
    const cachedData = await getCachedData<{
      product: unknown;
      success: boolean;
    }>(cacheKey);

    if (cachedData) {
      return NextResponse.json(cachedData, {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
          "X-Cache": "HIT",
        },
      });
    }

    // Cache miss - connect to database
    try {
      await connectDB();
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return NextResponse.json(
        {
          message: "Database connection failed",
          success: false,
          error:
            dbError instanceof Error
              ? dbError.message
              : "Database connection error",
        },
        { status: 500 }
      );
    }

    interface ProductDoc {
      _id: { toString: () => string };
      name: string;
      description: string;
      price: number;
      oldPrice?: number;
      discount?: number;
      rating: number;
      brand: string;
      categoryName: string;
      imgSrc?: unknown[];
      hideFromHome?: boolean;
      createdAt?: Date | string;
      [key: string]: unknown;
    }

    const product = (await Product.findById(
      id
    ).lean()) as unknown as ProductDoc | null;

    if (!product) {
      return NextResponse.json(
        { message: "Product not found", success: false },
        { status: 404 }
      );
    }

    // Convert to plain object and format image sources
    const productObj = {
      ...product,
      _id: product._id.toString(),
      // Instead of converting to base64, we'll use the image API endpoint
      imgSrc: (product.imgSrc || []).map(
        (_: unknown, index: number) => `/api/product/image/${id}?index=${index}`
      ),
    };

    const responseData = {
      product: productObj,
      success: true,
    };

    // Cache the result
    await setCachedData(cacheKey, responseData, CACHE_TTL.PRODUCT_SINGLE);

    return NextResponse.json(responseData, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        "X-Cache": "MISS",
      },
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : typeof error === "string"
        ? error
        : "Failed to fetch product";

    return NextResponse.json(
      {
        message: errorMessage,
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    const updateData: ProductUpdateData = await request.json();

    if (updateData.variants) {
      updateData.variants = sanitizeVariants(updateData.variants);
    }

    // If category is provided but categoryName is not, fetch it from the category
    if (updateData.category && !updateData.categoryName) {
      const category = await Category.findById(updateData.category);
      if (category) {
        updateData.categoryName = category.name;
      }
    }

    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found", success: false },
        { status: 404 }
      );
    }

    // Invalidate caches
    await invalidateProductCaches(id);

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

    // Invalidate caches
    await invalidateProductCaches(id);

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
    const updateData: ProductUpdateData = await request.json();

    if (updateData.variants) {
      updateData.variants = sanitizeVariants(updateData.variants);
    }

    // If category is provided but categoryName is not, fetch it from the category
    if (updateData.category && !updateData.categoryName) {
      const category = await Category.findById(updateData.category);
      if (category) {
        updateData.categoryName = category.name;
      }
    }

    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found", success: false },
        { status: 404 }
      );
    }

    // Invalidate caches
    await invalidateProductCaches(id);

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
