import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "../../../../models/user";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    await dbConnect();
    const { id } = await params;
    const userFound = await User.findById(id).populate("cart");

    if (userFound) {
      const { cart } = userFound;
      // if(cart)
      // return NextResponse.json({ cart: cart || [] }, { status: 200 });
      return NextResponse.json({ cart: cart }, { status: 200 });
    } else {
      return NextResponse.json(
        { message: "User Not Found", cart: [] },
        { status: 404 }
      );
    }
  } catch (err) {
    console.error("Cart GET error:", err);
    return NextResponse.json(
      {
        error: "Failed to fetch cart",
        message: err instanceof Error ? err.message : String(err),
        cart: [],
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    await dbConnect();
    const { id } = await params;
    const { cartToAdd } = await req.json();
    console.log("newCart: ", cartToAdd);
    console.log("userId: ", id);

    const loggedUser = await User.findOne({ _id: id });

    if (!loggedUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Replace the user's cart with the new cart from the request
    loggedUser.cart = cartToAdd;
    await loggedUser.save();

    return NextResponse.json(
      { message: "Cart updated successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Cart POST error:", error);
    return NextResponse.json(
      {
        message: "Failed to update cart",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
