/**
 * Server-side API functions that directly query the database
 * Use these in Server Components instead of making HTTP requests
 */

import Product from "@/app/models/product";
import Category from "@/app/models/category";
import connectDB from "@/app/utils/db";
import { ProductCardProps } from "../types/types";

type ProductDoc = {
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
  variants?: unknown[];
  totalStock?: number;
  createdAt?: Date | string;
} & Record<string, unknown>;

/**
 * Get a single product by ID (server-side only)
 */
export async function getProductById(
  id: string
): Promise<ProductCardProps | null> {
  try {
    await connectDB();

    if (!id) {
      throw new Error("Product ID is required");
    }

    const product = (await Product.findById(
      id
    ).lean()) as unknown as ProductDoc | null;

    if (!product) {
      return null;
    }

    // Convert to ProductCardProps format
    const productObj: ProductCardProps = {
      _id: product._id.toString(),
      name: product.name,
      description: product.description,
      price: product.price,
      oldPrice: product.oldPrice,
      discount: product.discount?.toString(),
      rating: product.rating,
      brand: product.brand,
      categoryName: product.categoryName,
      variants: Array.isArray(product.variants)
        ? (product.variants as Array<{ _id?: { toString: () => string } | string; [key: string]: unknown }>).map((variant) => ({
            ...variant,
            _id: variant._id
              ? typeof variant._id === "string"
                ? variant._id
                : variant._id.toString()
              : undefined,
          })) as ProductCardProps["variants"]
        : (product.variants as ProductCardProps["variants"]),
      totalStock: product.totalStock,
      // Convert image buffers to API endpoints (return as strings, matching API route format)
      imgSrc: (product.imgSrc || []).map(
        (_: unknown, index: number) => `/api/product/image/${id}?index=${index}`
      ) as unknown as ProductCardProps["imgSrc"],
    };

    return productObj;
  } catch (error) {
    console.error("Error fetching product from database:", error);
    throw error;
  }
}

/**
 * Get all products (server-side only)
 */
export async function getAllProducts(): Promise<ProductCardProps[]> {
  try {
    await connectDB();

    const products = (await Product.find()
      .select(
        "name description price oldPrice discount rating brand category categoryName imgSrc hideFromHome variants createdAt updatedAt totalStock"
      )
      .lean({ virtuals: true })
      .exec()) as unknown as (ProductDoc & {
      category?: { toString: () => string } | string;
    })[];

    // Convert to ProductCardProps format
    const formattedProducts: ProductCardProps[] = products.map((product) => ({
      _id: product._id.toString(),
      name: product.name,
      description: product.description,
      price: product.price,
      oldPrice: product.oldPrice,
      discount: product.discount?.toString(),
      rating: product.rating,
      brand: product.brand,
      category: product.category?.toString(),
      categoryName: product.categoryName,
      variants: Array.isArray(product.variants)
        ? (product.variants as Array<{ _id?: { toString: () => string } | string; [key: string]: unknown }>).map((variant) => ({
            ...variant,
            _id: variant._id
              ? typeof variant._id === "string"
                ? variant._id
                : variant._id.toString()
              : undefined,
          })) as ProductCardProps["variants"]
        : (product.variants as ProductCardProps["variants"]),
      totalStock: product.totalStock,
      // Convert image buffers to API endpoints (return as strings, matching API route format)
      imgSrc: Array.from(
        { length: product.imgSrc?.length || 0 },
        (_, i) => `/api/product/image/${product._id}?index=${i}`
      ) as unknown as ProductCardProps["imgSrc"],
    }));

    return formattedProducts;
  } catch (error) {
    console.error("Error fetching products from database:", error);
    return [];
  }
}

interface CategoryDoc {
  _id: { toString: () => string };
  name: string;
  slug: string;
  sortOrder?: number;
  createdAt?: Date | string;
  [key: string]: unknown;
}

export interface ServerCategory {
  _id: string;
  name: string;
  slug: string;
  sortOrder: number;
  createdAt: string;
}

/**
 * Get active categories sorted by sortOrder (server-side only)
 */
export async function getActiveCategories(): Promise<ServerCategory[]> {
  try {
    await connectDB();

    const categories = (await Category.find({ isActive: true })
      .select("name slug sortOrder createdAt")
      .sort({ sortOrder: 1, createdAt: 1 })
      .lean()
      .exec()) as unknown as CategoryDoc[];

    return categories.map((cat) => ({
      _id: cat._id.toString(),
      name: cat.name,
      slug: cat.slug,
      sortOrder: cat.sortOrder ?? 0,
      createdAt: cat.createdAt
        ? new Date(cat.createdAt).toISOString()
        : new Date().toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching categories from database:", error);
    return [];
  }
}

/**
 * Get products by category ID (server-side only)
 * @param categoryId - Category ID or slug
 * @param limit - Maximum number of products to return
 */
export async function getProductsByCategory(
  categoryId: string,
  limit: number = 20
): Promise<ProductCardProps[]> {
  try {
    await connectDB();

    // Check if categoryId is an ObjectId or slug
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(categoryId);
    let category: CategoryDoc | null = null;

    if (isValidObjectId) {
      category = (await Category.findById(
        categoryId
      ).lean()) as unknown as CategoryDoc | null;
    } else {
      category = (await Category.findOne({
        slug: categoryId,
        isActive: true,
      }).lean()) as unknown as CategoryDoc | null;
    }

    if (!category) {
      return [];
    }

    const products = (await Product.find({
      category: category._id,
      hideFromHome: { $ne: true },
    })
      .select(
        "name description price oldPrice discount rating brand categoryName imgSrc hideFromHome createdAt"
      )
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
      .exec()) as unknown as ProductDoc[];

    return products.map((product) => ({
      _id: product._id.toString(),
      name: product.name,
      description: product.description,
      price: product.price,
      oldPrice: product.oldPrice,
      discount: product.discount?.toString(),
      rating: product.rating,
      brand: product.brand,
      categoryName: product.categoryName,
      imgSrc: (product.imgSrc || []).map(
        (_: unknown, index: number) =>
          `/api/product/image/${product._id}?index=${index}`
      ) as unknown as ProductCardProps["imgSrc"],
    }));
  } catch (error) {
    console.error("Error fetching products by category from database:", error);
    return [];
  }
}

/**
 * Batch fetch products for multiple categories in parallel (server-side only)
 */
export async function getProductsForCategories(
  categories: ServerCategory[],
  limit: number = 20
): Promise<Map<string, ProductCardProps[]>> {
  try {
    await connectDB();

    // Fetch products for all categories in parallel
    const productPromises = categories.map((category) =>
      getProductsByCategory(category._id, limit)
    );

    const productsArrays = await Promise.all(productPromises);

    // Create a map of category ID to products
    const productsMap = new Map<string, ProductCardProps[]>();
    categories.forEach((category, index) => {
      productsMap.set(category._id, productsArrays[index] || []);
    });

    return productsMap;
  } catch (error) {
    console.error("Error batch fetching products:", error);
    return new Map();
  }
}
