import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/utils/db";
import Product from "@/app/models/product";
import Category from "@/app/models/category";

// GET products by category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();

    const { slug } = await params;
    
    // If the slug is "products", this route shouldn't handle it
    // It should be handled by [categoryId]/products route
    // This is a safeguard in case Next.js routing doesn't prioritize correctly
    if (slug === "products") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid route",
        },
        { status: 404 }
      );
    }
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const brand = searchParams.get("brand");

    // Handle "all products" case
    if (slug === "all") {
      // Build product query for all products
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const productQuery: any = {};

      // Add price filters
      if (minPrice || maxPrice) {
        productQuery.price = {};
        if (minPrice) productQuery.price.$gte = parseFloat(minPrice);
        if (maxPrice) productQuery.price.$lte = parseFloat(maxPrice);
      }

      // Add brand filter
      if (brand) {
        productQuery.brand = new RegExp(brand, "i");
      }

      // Build sort object
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sort: any = {};
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Get products with pagination
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const products = await Product.find(productQuery as any)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .sort(sort as any)
        .skip(skip)
        .limit(limit)
        .select(
          "name description price oldPrice discount rating brand categoryName imgSrc"
        )
        .exec();

      // Get total count for pagination
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const totalProducts = await Product.countDocuments(productQuery as any);
      const totalPages = Math.ceil(totalProducts / limit);

      // Get unique brands
      const brands = await Product.distinct("brand");

      return NextResponse.json({
        success: true,
        data: {
          category: {
            _id: "all",
            name: "All Products",
            slug: "all",
            description: "Browse all our products",
          },
          products,
          pagination: {
            currentPage: page,
            totalPages,
            totalProducts,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          },
          filters: {
            brands,
            priceRange: {
              min: minPrice ? parseFloat(minPrice) : undefined,
              max: maxPrice ? parseFloat(maxPrice) : undefined,
            },
          },
        },
      });
    }

    // Find category by slug
    const category = await Category.findOne({ slug, isActive: true });

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found",
        },
        { status: 404 }
      );
    }

    // Build product query
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const productQuery: any = { category: category._id };

    // Add price filters
    if (minPrice || maxPrice) {
      productQuery.price = {};
      if (minPrice) productQuery.price.$gte = parseFloat(minPrice);
      if (maxPrice) productQuery.price.$lte = parseFloat(maxPrice);
    }

    // Add brand filter
    if (brand) {
      productQuery.brand = new RegExp(brand, "i");
    }

    // Build sort object
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sort: any = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get products with pagination
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const products = await Product.find(productQuery as any)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .sort(sort as any)
      .skip(skip)
      .limit(limit)
      .select(
        "name description price oldPrice discount rating brand categoryName imgSrc"
      )
      .exec();

    // Get total count for pagination
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalProducts = await Product.countDocuments(productQuery as any);
    const totalPages = Math.ceil(totalProducts / limit);

    // Get unique brands for this category
    const brands = await Product.distinct("brand", { category: category._id });

    return NextResponse.json({
      success: true,
      data: {
        category: {
          _id: category._id,
          name: category.name,
          slug: category.slug,
          description: category.description,
        },
        products,
        pagination: {
          currentPage: page,
          totalPages,
          totalProducts,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
        filters: {
          brands,
          priceRange: {
            min: minPrice ? parseFloat(minPrice) : undefined,
            max: maxPrice ? parseFloat(maxPrice) : undefined,
          },
        },
      },
    });
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

// Helper function to check if a string is a valid MongoDB ObjectId
function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

// PATCH update existing category by ID or slug
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();

    const { slug } = await params;
    const body = await request.json();
    const { isActive, isFeatured, sortOrder, name, slug: newSlug, description } = body;

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
      // Auto-generate slug from name if slug is not provided
      if (!newSlug || typeof newSlug !== "string" || !newSlug.trim()) {
        const generatedSlug = name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        updateData.slug = generatedSlug;
      }
    }

    // Allow manual slug override if provided
    if (typeof newSlug === "string" && newSlug.trim()) {
      const cleanedSlug = newSlug
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      updateData.slug = cleanedSlug;
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

    // Check if slug is an ObjectId (categoryId) or a slug string
    let category;
    if (isValidObjectId(slug)) {
      // It's an ObjectId, find by ID
      category = await Category.findByIdAndUpdate(slug, updateData, {
        new: true,
      });
    } else {
      // It's a slug string, find by slug
      category = await Category.findOneAndUpdate({ slug }, updateData, {
        new: true,
      });
    }

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
