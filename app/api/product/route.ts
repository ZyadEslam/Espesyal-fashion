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
import { requireAdminAccess } from "@/lib/security/authMiddleware";
import { checkProductCreationRateLimit } from "@/lib/security/rateLimiter";
import { productCreateSchema, safeParseInput } from "@/lib/security/validator";
import { createErrorResponse } from "@/lib/security/errorHandler";
import { logAdminAction } from "@/lib/security/auditLogger";
import { sanitizeObject } from "@/lib/security/sanitizer";

const POST = async (req: NextRequest) => {
  try {
    // 1. Require admin authentication
    const adminSession = await requireAdminAccess();
    if (!adminSession) {
      return NextResponse.json(
        {
          message: "Unauthorized",
          success: false,
          error: "Admin access required",
        },
        { status: 403 }
      );
    }

    // 2. Rate limiting
    const rateLimitResult = await checkProductCreationRateLimit(
      req,
      adminSession.user.id
    );
    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          message: "Rate limit exceeded",
          success: false,
          error: "Too many product creation requests",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              Math.ceil((rateLimitResult.reset - Date.now()) / 1000)
            ),
          },
        }
      );
    }

    // 3. Parse and validate input
    const body = await req.json();
    const sanitizedBody = sanitizeObject(body);
    const validation = safeParseInput(productCreateSchema, sanitizedBody);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          success: false,
          error: "Invalid product data",
          details: validation.errors.errors.map((e) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    await connectDB();
    const productData = validation.data;

    if (productData.variants) {
      productData.variants = sanitizeVariants(productData.variants);
    }

    // Convert base64 image strings back to Buffer objects for storage
    const imageBuffers: Buffer[] = [];
    if (productData.imgSrc && Array.isArray(productData.imgSrc)) {
      for (const img of productData.imgSrc) {
        if (typeof img === "string" && img.length > 0) {
          try {
            const buffer = Buffer.from(img, "base64");
            imageBuffers.push(buffer);
          } catch (error) {
            console.error("Error converting base64 to buffer:", error);
            // Skip invalid images
          }
        }
      }
    }

    // Validate that at least one image is provided
    if (imageBuffers.length === 0) {
      return NextResponse.json(
        {
          message: "Validation failed",
          success: false,
          error: "At least one product image is required",
        },
        { status: 400 }
      );
    }

    // Assign converted buffers to productData
    // Cast through unknown first to allow type conversion
    (productData as unknown as { imgSrc: Buffer[] }).imgSrc = imageBuffers;

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

    // Log admin action
    await logAdminAction(
      adminSession.user.id,
      adminSession.user.email || "",
      "create_product",
      `/api/product`,
      req,
      { productId: product._id.toString(), productName: product.name }
    );

    return NextResponse.json(
      { message: "Product created successfully", product, success: true },
      {
        status: 201,
        headers: {
          "X-RateLimit-Remaining": String(rateLimitResult.remaining),
        },
      }
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return createErrorResponse(error, "Failed to create product");
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
