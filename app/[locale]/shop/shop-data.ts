import mongoose from "mongoose";
import connectDB from "../../utils/db";
import Category from "../../models/category";
import Product from "../../models/product";
import { ProductCardProps } from "../../types/types";

export interface ShopInitialData {
  products: ProductCardProps[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters: {
    brands: string[];
    priceRange: {
      min?: number;
      max?: number;
    };
  };
}

// Minimal category shape needed for the shop layout (name + slug)
export interface ShopCategory {
  _id: string;
  name: string;
  slug: string;
}

export async function fetchInitialProducts(
  categorySlug?: string
): Promise<ShopInitialData> {
  try {
    await connectDB();

    const page = 1;
    const limit = 12;
    const sortBy = "createdAt";
    const sortOrder = "desc";

    // Handle "all products" case
    const slug = categorySlug || "all";

    if (slug === "all") {
      // Build sort object
      const sort: Record<string, 1 | -1> = {};
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;

      // Calculate pagination
      const skip = (page - 1) * limit;

      const [productsRaw, totalProducts, brands] = await Promise.all([
        Product.aggregate([
          // Keep the shop consistent with other endpoints (exclude hidden products)
          { $match: { hideFromHome: { $ne: true } } },
          { $sort: sort },
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              name: 1,
              description: 1,
              price: 1,
              oldPrice: 1,
              discount: 1,
              rating: 1,
              brand: 1,
              categoryName: 1,
              imgSrc: 1,
            },
          },
        ]),
        // Get total count for pagination
        Product.countDocuments({ hideFromHome: { $ne: true } }),
        // Get unique brands
        Product.distinct("brand", { hideFromHome: { $ne: true } }),
      ]);

      const products: ProductCardProps[] = productsRaw.map((p) => ({
        _id: p._id.toString(),
        name: p.name,
        description: p.description,
        price: p.price,
        oldPrice: p.oldPrice,
        discount: p.discount,
        rating: p.rating,
        brand: p.brand,
        categoryName: p.categoryName,
        imgSrc: (p.imgSrc || []) as ProductCardProps["imgSrc"],
      }));

      const totalPages = Math.ceil(totalProducts / limit);

      return {
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
            min: undefined,
            max: undefined,
          },
        },
      };
    }

    // Find category by slug
    const category = await Category.findOne({ slug, isActive: true });

    if (!category) {
      throw new Error("Category not found");
    }

    // Build sort object
    const sort: Record<string, 1 | -1> = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    const [productsRaw, totalProducts, brands] = await Promise.all([
      Product.aggregate([
        {
          $match: {
            category: new mongoose.Types.ObjectId(category._id.toString()),
            hideFromHome: { $ne: true },
          },
        },
        { $sort: sort },
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            name: 1,
            description: 1,
            price: 1,
            oldPrice: 1,
            discount: 1,
            rating: 1,
            brand: 1,
            categoryName: 1,
            imgSrc: 1,
          },
        },
      ]),
      // Get total count for pagination
      Product.countDocuments({
        category: category._id,
        hideFromHome: { $ne: true },
      }),
      // Get unique brands for this category
      Product.distinct("brand", {
        category: category._id,
        hideFromHome: { $ne: true },
      }),
    ]);

    const products: ProductCardProps[] = productsRaw.map((p) => ({
      _id: p._id.toString(),
      name: p.name,
      description: p.description,
      price: p.price,
      oldPrice: p.oldPrice,
      discount: p.discount,
      rating: p.rating,
      brand: p.brand,
      categoryName: p.categoryName,
      imgSrc: (p.imgSrc || []) as ProductCardProps["imgSrc"],
    }));

    const totalPages = Math.ceil(totalProducts / limit);

    return {
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
          min: undefined,
          max: undefined,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching initial products:", error);
    return {
      products: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalProducts: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
      filters: {
        brands: [],
        priceRange: {
          min: undefined,
          max: undefined,
        },
      },
    };
  }
}

// Type definition for category document from Mongoose
interface CategoryDoc {
  _id: { toString: () => string };
  name: string;
  slug: string;
  sortOrder?: number;
  [key: string]: unknown;
}

// Server-side helper to fetch active categories for the shop page.
// This lets the shop page render with real category names immediately,
// without waiting for a client-side API request.
export async function fetchShopCategories(): Promise<ShopCategory[]> {
  try {
    await connectDB();

    // Only active categories, ordered by sortOrder if available
    const categoriesRaw = (await Category.find({ isActive: true })
      .sort({ sortOrder: 1 })
      .select("name slug")
      .lean()
      .exec()) as unknown as CategoryDoc[];

    return categoriesRaw.map((c) => ({
      _id: c._id.toString(),
      name: c.name,
      slug: c.slug,
    }));
  } catch (error) {
    console.error("Error fetching shop categories:", error);
    return [];
  }
}
