/**
 * Server-side API functions that directly query the database
 * Use these in Server Components instead of making HTTP requests
 */

import Product from "@/app/models/product";
import connectDB from "@/app/utils/db";
import { ProductCardProps } from "../types/types";

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
  variants?: unknown[];
  totalStock?: number;
  createdAt?: Date | string;
  [key: string]: unknown;
}

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
      variants: product.variants as ProductCardProps["variants"],
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
      variants: product.variants as ProductCardProps["variants"],
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
