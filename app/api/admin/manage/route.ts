import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/app/models/user";
import { requireAdmin } from "@/lib/adminAuth";

// GET: Fetch all admin users
export async function GET() {
  try {
    // Check admin access
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    await dbConnect();

    // Find all users with isAdmin = true
    const admins = await User.find({ isAdmin: true })
      .select("_id name email isAdmin")
      .lean();

    return NextResponse.json({ admins }, { status: 200 });
  } catch (error) {
    console.error("Error fetching admins:", error);
    return NextResponse.json(
      { error: "Failed to fetch admins" },
      { status: 500 }
    );
  }
}

// POST: Add admin by email
export async function POST(req: NextRequest) {
  try {
    // Check admin access
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { email } = body;

    // Validate email
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        {
          error:
            "User not found. User must sign in first before being granted admin access.",
        },
        { status: 404 }
      );
    }

    // Check if already admin
    if (user.isAdmin) {
      return NextResponse.json(
        { error: "User is already an admin" },
        { status: 400 }
      );
    }

    // Update user to admin
    user.isAdmin = true;
    await user.save();

    return NextResponse.json(
      {
        message: "Admin access granted successfully",
        admin: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding admin:", error);
    return NextResponse.json({ error: "Failed to add admin" }, { status: 500 });
  }
}

// DELETE: Remove admin by email
export async function DELETE(req: NextRequest) {
  try {
    // Check admin access
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if already not admin
    if (!user.isAdmin) {
      return NextResponse.json(
        { error: "User is not an admin" },
        { status: 400 }
      );
    }

    // Prevent self-removal
    if (session.user?.email?.toLowerCase() === email.toLowerCase()) {
      return NextResponse.json(
        { error: "You cannot remove your own admin access" },
        { status: 400 }
      );
    }

    // Remove admin access
    user.isAdmin = false;
    await user.save();

    return NextResponse.json(
      {
        message: "Admin access removed successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing admin:", error);
    return NextResponse.json(
      { error: "Failed to remove admin" },
      { status: 500 }
    );
  }
}
