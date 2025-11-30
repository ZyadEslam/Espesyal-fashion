import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Settings from "@/app/models/settings";
import { requireAdmin } from "@/lib/adminAuth";

// GET: Fetch current shipping fee (public endpoint)
export async function GET() {
  try {
    await dbConnect();

    // Try to fetch from database
    let settings = await Settings.findOne();

    // If no settings exist, create default one
    if (!settings) {
      settings = await Settings.create({ shippingFee: 0 });
    }

    return NextResponse.json(
      {
        success: true,
        shippingFee: settings.shippingFee,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching settings:", error);
    // Return default value on error
    return NextResponse.json(
      {
        success: true,
        shippingFee: 0,
      },
      { status: 200 }
    );
  }
}

// PUT: Update shipping fee (admin only)
export async function PUT(req: NextRequest) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    await dbConnect();

    const body = await req.json();
    const { shippingFee } = body;

    // Validate shipping fee
    if (shippingFee === undefined || shippingFee === null) {
      return NextResponse.json(
        { error: "Shipping fee is required" },
        { status: 400 }
      );
    }

    const feeValue = Number(shippingFee);
    if (isNaN(feeValue) || feeValue < 0) {
      return NextResponse.json(
        { error: "Shipping fee must be a non-negative number" },
        { status: 400 }
      );
    }

    // Upsert operation (create if doesn't exist, update if exists)
    const settings = await Settings.findOneAndUpdate(
      {},
      {
        shippingFee: feeValue,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Shipping fee updated successfully",
        shippingFee: settings.shippingFee,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating shipping fee:", error);
    return NextResponse.json(
      { error: "Failed to update shipping fee" },
      { status: 500 }
    );
  }
}
