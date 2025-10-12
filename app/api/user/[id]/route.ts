import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../../lib/mongoose";
import User from "../../../models/user";
interface Params {
  params: Promise<{ id: string }>;
}
export async function GET(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    console.log(id);
    const userFound = await User.findById(id);

    if (userFound) {
      const { _id, name, email, isAdmin, cart, wishlist } = userFound;
      return NextResponse.json(
        { _id, name, email, isAdmin, cart, wishlist },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ message: "User Not Found" }, { status: 401 });
    }
  } catch (err) {
    NextResponse.json(err, { status: 500 });
    console.log(err);
  }
}
