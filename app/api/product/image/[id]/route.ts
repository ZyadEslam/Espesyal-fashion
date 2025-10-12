import { NextRequest, NextResponse } from "next/server";
import Product from "@/app/models/product";
import connectDB from "@/app/utils/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const url = new URL(request.url);
    const imageIndex = parseInt(url.searchParams.get("index") || "0");

    console.log(`Fetching image for product ${id}, index ${imageIndex}`);

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      console.error(`Invalid product ID format: ${id}`);
      return new NextResponse("Invalid product ID", { status: 400 });
    }

    const product = await Product.findById(id);

    if (!product) {
      console.error(`Product not found with ID: ${id}`);
      return new NextResponse("Product not found", { status: 404 });
    }

    if (!product.imgSrc || product.imgSrc.length === 0) {
      console.error(`No images found for product ${id}`);
      return new NextResponse("No images found", { status: 404 });
    }

    if (imageIndex >= product.imgSrc.length || imageIndex < 0) {
      console.error(
        `Image index ${imageIndex} out of bounds for product ${id}`
      );
      return new NextResponse("Image index out of bounds", { status: 404 });
    }

    const imageData = product.imgSrc[imageIndex];

    // Check if the image data is valid (not empty)
    if (!imageData || imageData === "") {
      console.error(`Empty image data for product ${id}, index ${imageIndex}`);
      return new NextResponse("Empty image data", { status: 404 });
    }

    // Convert base64 to buffer with better error handling
    let imageBuffer;
    let contentType = "image/jpeg"; // default

    try {
      let base64String;

      // Handle different possible formats of imageData
      if (typeof imageData === "string") {
        base64String = imageData;
      } else if (typeof imageData === "object") {
        // Handle MongoDB Binary objects
        if (imageData.base64) {
          base64String = imageData.base64;
        } else if (imageData.buffer) {
          // If it's already a buffer
          imageBuffer = Buffer.from(imageData.buffer);
        } else if (imageData.toString) {
          base64String = imageData.toString();
        } else {
          throw new Error("Unknown image data format");
        }
      } else {
        throw new Error("Unsupported image data type");
      }

      // Process base64 string if we have one
      if (base64String && !imageBuffer) {
        // Extract content type from data URL if present
        const dataUrlMatch = base64String.match(/^data:image\/(\w+);base64,/);
        if (dataUrlMatch) {
          contentType = `image/${dataUrlMatch[1]}`;
          base64String = base64String.replace(/^data:image\/\w+;base64,/, "");
        }

        // Validate base64 string
        if (!base64String || base64String.length === 0) {
          throw new Error("Empty base64 string");
        }

        // Check if it's valid base64
        if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64String)) {
          throw new Error("Invalid base64 format");
        }

        imageBuffer = Buffer.from(base64String, "base64");
      }

      // Validate buffer
      if (!imageBuffer || imageBuffer.length === 0) {
        return NextResponse.json(
          { message: "Empty image buffer" },
          { status: 500 }
        );
      }

      // Basic image validation - check for common image headers
      const header = imageBuffer.subarray(0, 4);
      if (header[0] === 0xff && header[1] === 0xd8) {
        contentType = "image/jpeg";
      } else if (
        header[0] === 0x89 &&
        header[1] === 0x50 &&
        header[2] === 0x4e &&
        header[3] === 0x47
      ) {
        contentType = "image/png";
      } else if (
        header[0] === 0x47 &&
        header[1] === 0x49 &&
        header[2] === 0x46
      ) {
        contentType = "image/gif";
      }
    } catch (error) {
      console.error(`Error processing image data for product ${id}:`, error);
      console.error(`Image data type:`, typeof imageData);
      console.error(
        `Image data preview:`,
        typeof imageData === "string"
          ? imageData.substring(0, 100) + "..."
          : JSON.stringify(imageData).substring(0, 100) + "..."
      );
      return new NextResponse("Invalid image format", { status: 500 });
    }

    console.log(
      `Serving image for product ${id}, size: ${imageBuffer.length} bytes, type: ${contentType}`
    );

    // Return the image buffer
    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000",
        "Content-Length": imageBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Error serving image:", error);
    console.error(
      "Stack trace:",
      error instanceof Error ? error.stack : "No stack trace"
    );
    return new NextResponse("Error serving image", { status: 500 });
  }
}
