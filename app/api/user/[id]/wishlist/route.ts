import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "../../../../models/user";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    console.log("Starting wishlist GET request");
    await dbConnect();
    console.log("Database connected");

    const { id } = await params;
    console.log("User ID:", id);

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json(
        { message: "Invalid user ID format", wishlist: [] },
        { status: 400 }
      );
    }

    const userFound = await User.findById(id).populate("wishlist");
    console.log("User found:", !!userFound);

    if (userFound) {
      const { wishlist } = userFound;
      console.log("Wishlist length:", wishlist?.length || 0);
      return NextResponse.json(
        {
          wishlist: Array.isArray(wishlist) ? wishlist : [],
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "User Not Found", wishlist: [] },
        { status: 404 }
      );
    }
  } catch (err) {
    console.error("Wishlist GET error:", err);
    return NextResponse.json(
      {
        error: "Failed to fetch wishlist",
        message: err instanceof Error ? err.message : String(err),
        wishlist: [],
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    console.log("Starting wishlist POST request");
    await dbConnect();

    const { id } = await params;

    // Validate ObjectId format
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json(
        { message: "Invalid user ID format" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { wishlistToAdd } = body;

    console.log("newWishlist: ", wishlistToAdd);
    console.log("userId: ", id);

    // Ensure wishlistToAdd is an array
    if (!Array.isArray(wishlistToAdd)) {
      return NextResponse.json(
        { message: "Wishlist must be an array" },
        { status: 400 }
      );
    }

    const loggedUser = await User.findOne({ _id: id });

    if (!loggedUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    loggedUser.wishlist = wishlistToAdd;
    await loggedUser.save();

    return NextResponse.json(
      { message: "Wishlist updated successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Wishlist POST error:", error);
    return NextResponse.json(
      {
        message: "Failed to update wishlist",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
