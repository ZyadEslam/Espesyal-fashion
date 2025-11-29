import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/utils/db";
import Product from "@/app/models/product";
import Category from "@/app/models/category";

interface Params {
  params: Promise<{ slug: string }>;
}

// Helper function to check if a string is a valid MongoDB ObjectId
function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    
    console.log("[slug]/products route hit with slug:", slug);

    if (!slug) {
      console.error("No slug provided");
      return NextResponse.json(
        {
          success: false,
          message: "Category identifier is required",
        },
        { status: 400 }
      );
    }

    let category;
    
    // Check if slug is an ObjectId (categoryId) or a slug string
    if (isValidObjectId(slug)) {
      // It's an ObjectId, find by ID
      category = await Category.findById(slug);
    } else {
      // It's a slug string, find by slug
      category = await Category.findOne({ slug, isActive: true });
    }

    if (!category) {
      console.log("Category not found for identifier:", slug);
      return NextResponse.json(
        {
          success: false,
          message: "Category not found",
        },
        { status: 404 }
      );
    }
    
    console.log("Category found:", category.name);

    // Fetch all products for this category, excluding hidden products, sorted by createdAt
    const products = await Product.find({ 
      category: category._id,
      hideFromHome: { $ne: true } // Exclude products hidden from home
    })
      .select("name description price oldPrice discount rating brand categoryName imgSrc hideFromHome createdAt")
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    // Convert products to format compatible with ProductCardProps
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedProducts = products.map((product: any) => ({
      _id: product._id?.toString() || "",
      name: product.name,
      description: product.description,
      price: product.price,
      oldPrice: product.oldPrice,
      discount: product.discount,
      rating: product.rating,
      brand: product.brand,
      categoryName: product.categoryName,
      imgSrc: (product.imgSrc || []).map(
        (_: unknown, index: number) =>
          `/api/product/image/${product._id}?index=${index}`
      ) as unknown as Array<unknown>,
    }));

    return NextResponse.json(
      {
        success: true,
        data: formattedProducts,
        count: formattedProducts.length,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        }
      }
    );
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch products",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}


