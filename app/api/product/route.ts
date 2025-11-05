import { NextRequest, NextResponse } from "next/server";
import Product from "@/app/models/product";
import connectDB from "@/app/utils/db";

const POST = async (req: NextRequest) => {
  try {
    await connectDB();
    const productData = await req.json();
    console.log("Received product data:", productData);

    const product = await Product.create(productData);

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
    await connectDB();
    // Only select the fields we need for the product list
    const products = await Product.find()
      .select("name description price oldPrice discount rating brand category categoryName imgSrc createdAt updatedAt")
      .lean()
      .exec();
    
    console.log(`Fetched ${products.length} products from the database.`);
    
    // Convert to plain objects and remove image buffers
    const productsWithoutBuffers = products.map((product) => {
      const productObj = { ...product };

      // Replace image buffers with image count
      productObj.imageCount = productObj.imgSrc?.length || 0;
      delete productObj.imgSrc;
      return productObj;
    });

    // Add caching headers for better performance
    return NextResponse.json(
      { products: productsWithoutBuffers, success: true },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        }
      }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: error, success: false },
      { status: 500 }
    );
  }
};

export { POST, GET };
