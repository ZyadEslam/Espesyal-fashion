import { NextRequest, NextResponse } from "next/server";
import Product from "@/app/models/product";
import Category from "@/app/models/category";
import connectDB from "@/app/utils/db";
import { sanitizeVariants } from "@/app/utils/variantUtils";
import {
  getCachedData,
  setCachedData,
  invalidateProductCaches,
  getProductListCacheKey,
  CACHE_TTL,
} from "@/lib/cache";

const POST = async (req: NextRequest) => {
  try {
    await connectDB();
    const productData = await req.json();
    console.log("Received product data:", productData);

    if (productData.variants) {
      productData.variants = sanitizeVariants(productData.variants);
    }

    // If category is provided but categoryName is not, fetch it from the category
    if (productData.category && !productData.categoryName) {
      const category = await Category.findById(productData.category);
      if (category) {
        productData.categoryName = category.name;
      }
    }

    // Set default hideFromHome if not provided
    if (
      productData.hideFromHome === undefined ||
      productData.hideFromHome === null
    ) {
      productData.hideFromHome = false;
    }

    const product = await Product.create(productData);

    // Invalidate product list cache
    await invalidateProductCaches();

    return NextResponse.json(
      { message: "Product created successfully", product, success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { message: error, success: false },
      { status: 500 }
    );
  }
};

const GET = async () => {
  try {
    // Check cache first
    const cacheKey = getProductListCacheKey();
    const cachedData = await getCachedData<{
      products: unknown[];
      success: boolean;
    }>(cacheKey);

    if (cachedData) {
      return NextResponse.json(cachedData, {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
          "X-Cache": "HIT",
        },
      });
    }

    // Cache miss - fetch from database
    await connectDB();
    // Only select the fields we need for the product list
    const products = await Product.find()
      .select(
        "name description price oldPrice discount rating brand category categoryName imgSrc hideFromHome variants createdAt updatedAt totalStock"
      )
      .lean({ virtuals: true })
      .exec();

    console.log(`Fetched ${products.length} products from the database.`);

    // Convert to plain objects and remove image buffers
    const productsWithoutBuffers = products.map((product) => {
      const productObj = { ...product };

      // Replace image buffers with image count
      productObj.imageCount = productObj.imgSrc?.length || 0;
      delete productObj.imgSrc;
      // Ensure hideFromHome is set (default to false)
      productObj.hideFromHome = productObj.hideFromHome ?? false;
      return productObj;
    });

    const responseData = {
      products: productsWithoutBuffers,
      success: true,
    };

    // Cache the result
    await setCachedData(cacheKey, responseData, CACHE_TTL.PRODUCT_LIST);

    // Add caching headers for better performance
    return NextResponse.json(responseData, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        "X-Cache": "MISS",
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: error, success: false },
      { status: 500 }
    );
  }
};

export { POST, GET };
