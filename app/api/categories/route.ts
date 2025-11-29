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

    // Use .lean() for faster queries - returns plain objects instead of Mongoose documents
    const categories = await categoriesQuery.lean().exec();

    return NextResponse.json(
      {
        success: true,
        data: categories,
        count: categories.length,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
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
    const { name, description, image, isFeatured, sortOrder, isActive } = body;

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
      isActive: typeof isActive === "boolean" ? isActive : true,
      isFeatured: isFeatured || false,
      sortOrder: typeof sortOrder === "number" ? sortOrder : 0,
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

// PATCH update existing category (e.g. active state and priority/sort order)
export async function PATCH(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { id, isActive, isFeatured, sortOrder, name, description } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Category id is required",
        },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (typeof isActive === "boolean") {
      updateData.isActive = isActive;
    }

    if (typeof isFeatured === "boolean") {
      updateData.isFeatured = isFeatured;
    }

    if (typeof sortOrder === "number") {
      // Ensure non-negative integer priority
      updateData.sortOrder = Math.max(0, Math.floor(sortOrder));
    }

    if (typeof name === "string" && name.trim()) {
      updateData.name = name.trim();
    }

    if (typeof description === "string") {
      updateData.description = description;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No valid fields provided to update",
        },
        { status: 400 }
      );
    }

    const category = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
      message: "Category updated successfully",
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update category",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
