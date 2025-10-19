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
      const sort: any = {};
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Get products with pagination
      const products = await Product.find(productQuery)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select(
          "name description price oldPrice discount rating brand categoryName imgSrc"
        )
        .exec();

      // Get total count for pagination
      const totalProducts = await Product.countDocuments(productQuery);
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
    const sort: any = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get products with pagination
    const products = await Product.find(productQuery)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select(
        "name description price oldPrice discount rating brand categoryName imgSrc"
      )
      .exec();

    // Get total count for pagination
    const totalProducts = await Product.countDocuments(productQuery);
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
