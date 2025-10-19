import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/utils/db";
import Category from "@/app/models/category";
import Product from "@/app/models/product";

// GET all categories with their products
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");
    const active = searchParams.get("active");
    const limit = searchParams.get("limit");
    const includeProducts = searchParams.get("includeProducts") === "true";

    const query: Record<string, unknown> = {};

    if (featured === "true") {
      query.isFeatured = true;
    }

    if (active === "true") {
      query.isActive = true;
    }

    let categoriesQuery = Category.find(query).sort({
      sortOrder: 1,
      createdAt: -1,
    });

    if (limit) {
      categoriesQuery = categoriesQuery.limit(parseInt(limit));
    }

    if (includeProducts) {
      categoriesQuery = categoriesQuery.populate({
        path: "products",
        model: Product,
        select: "name price oldPrice discount rating imgSrc brand categoryName",
        options: { limit: 8 }, // Limit products per category for performance
      });
    }

    const categories = await categoriesQuery.exec();

    return NextResponse.json({
      success: true,
      data: categories,
      count: categories.length,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch categories",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST create new category
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, description, image, isFeatured, sortOrder } = body;

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Category name is required",
        },
        { status: 400 }
      );
    }

    // Create slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const category = new Category({
      name,
      slug,
      description,
      image,
      isFeatured: isFeatured || false,
      sortOrder: sortOrder || 0,
      products: [],
    });

    await category.save();

    return NextResponse.json({
      success: true,
      data: category,
      message: "Category created successfully",
    });
  } catch (error) {
    console.error("Error creating category:", error);

    if (error instanceof Error && error.message.includes("duplicate key")) {
      return NextResponse.json(
        {
          success: false,
          message: "Category with this name already exists",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create category",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
