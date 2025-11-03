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
      // Build product query for all products
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const productQuery: any = {};

      // Build sort object
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sort: any = {};
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Get products with pagination
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const productsRaw = await Product.find(productQuery as any)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .sort(sort as any)
        .skip(skip)
        .limit(limit)
        .select(
          "name description price oldPrice discount rating brand categoryName imgSrc"
        )
        .lean()
        .exec();

      // Convert to proper format - convert imgSrc buffers to API endpoints
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const products: ProductCardProps[] = productsRaw.map((p: any) => ({
        _id: p._id.toString(),
        name: p.name,
        description: p.description,
        price: p.price,
        oldPrice: p.oldPrice,
        discount: p.discount,
        rating: p.rating,
        brand: p.brand,
        categoryName: p.categoryName,
        imgSrc: (p.imgSrc || []).map(
          (_: unknown, index: number) =>
            `/api/product/image/${p._id}?index=${index}`
        ) as unknown as ProductCardProps["imgSrc"],
      }));

      // Get total count for pagination
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const totalProducts = await Product.countDocuments(productQuery as any);
      const totalPages = Math.ceil(totalProducts / limit);

      // Get unique brands
      const brands = await Product.distinct("brand");

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

    // Build product query
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const productQuery: any = { category: category._id };

    // Build sort object
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sort: any = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get products with pagination
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const productsRaw = await Product.find(productQuery as any)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .sort(sort as any)
      .skip(skip)
      .limit(limit)
      .select(
        "name description price oldPrice discount rating brand categoryName imgSrc"
      )
      .lean()
      .exec();

    // Convert to proper format - convert imgSrc buffers to API endpoints
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const products: ProductCardProps[] = productsRaw.map((p: any) => ({
      _id: p._id.toString(),
      name: p.name,
      description: p.description,
      price: p.price,
      oldPrice: p.oldPrice,
      discount: p.discount,
      rating: p.rating,
      brand: p.brand,
      categoryName: p.categoryName,
      imgSrc: (p.imgSrc || []).map(
        (_: unknown, index: number) =>
          `/api/product/image/${p._id}?index=${index}`
      ) as unknown as ProductCardProps["imgSrc"],
    }));

    // Get total count for pagination
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalProducts = await Product.countDocuments(productQuery as any);
    const totalPages = Math.ceil(totalProducts / limit);

    // Get unique brands for this category
    const brands = await Product.distinct("brand", { category: category._id });

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

