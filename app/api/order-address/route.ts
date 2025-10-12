// import { NextResponse } from "next/server";
// import Address from "@/app/models/address";
// import connectDB from "@/app/utils/db";

// export async function POST(req: Request) {
//   try {
//     await connectDB();
//     const addressData = await req.json();

//     // Validate required fields
//     const requiredFields = [
//       "name",
//       "phone",
//       "pinCode",
//       "address",
//       "city",
//       "state",
//     ];
//     const missingFields = requiredFields.filter((field) => !addressData[field]);

//     if (missingFields.length > 0) {
//       return NextResponse.json(
//         {
//           message: `Missing required fields: ${missingFields.join(", ")}`,
//           success: false,
//         },
//         { status: 400 }
//       );
//     }

//     const address = await Address.create(addressData);

//     return NextResponse.json(
//       {
//         message: "Address created successfully",
//         address,
//         success: true,
//       },
//       { status: 201 }
//     );
//   } catch (error: unknown) {
//     console.error("Error creating address:", error);
//     const errorMessage =
//       error instanceof Error ? error.message : "Failed to create address";
//     return NextResponse.json(
//       {
//         message: errorMessage,
//         success: false,
//       },
//       { status: 500 }
//     );
//   }
// }

// export async function GET() {
//   try {
//     await connectDB();
//     const addresses = await Address.find().sort({ createdAt: -1 });

//     return NextResponse.json(
//       {
//         message: "Addresses retrieved successfully",
//         addresses,
//         success: true,
//       },
//       { status: 200 }
//     );
//   } catch (error: unknown) {
//     console.error("Error fetching addresses:", error);
//     const errorMessage =
//       error instanceof Error ? error.message : "Failed to fetch addresses";
//     return NextResponse.json(
//       {
//         message: errorMessage,
//         success: false,
//       },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(req: Request) {
//   try {
//     await connectDB();
//     const { searchParams } = new URL(req.url);
//     const id = searchParams.get("id");

//     if (!id) {
//       return NextResponse.json(
//         {
//           message: "Address ID is required",
//           success: false,
//         },
//         { status: 400 }
//       );
//     }

//     const deletedAddress = await Address.findByIdAndDelete(id);

//     if (!deletedAddress) {
//       return NextResponse.json(
//         {
//           message: "Address not found",
//           success: false,
//         },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       {
//         message: "Address deleted successfully",
//         success: true,
//       },
//       { status: 200 }
//     );
//   } catch (error: unknown) {
//     console.error("Error deleting address:", error);
//     const errorMessage =
//       error instanceof Error ? error.message : "Failed to delete address";
//     return NextResponse.json(
//       {
//         message: errorMessage,
//         success: false,
//       },
//       { status: 500 }
//     );
//   }
// }

// app/api/order-address/route.js
import { NextResponse } from "next/server";
import Address from "@/app/models/address";
import User from "@/app/models/user";
import connectDB from "@/app/utils/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


export async function POST(req: Request) {
  try {
    await connectDB();

    // Get user session
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        {
          message: "Unauthorized - Please log in",
          success: false,
        },
        { status: 401 }
      );
    }

    const addressData = await req.json();
    const userEmail = session.user.email;

    // Find user by email
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
          success: false,
        },
        { status: 404 }
      );
    }

    // Validate required fields
    const requiredFields = [
      "name",
      "phone",
      "pinCode",
      "address",
      "city",
      "state",
    ];
    const missingFields = requiredFields.filter((field) => !addressData[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          message: `Missing required fields: ${missingFields.join(", ")}`,
          success: false,
        },
        { status: 400 }
      );
    }

    // Create address with user ID
    const address = await Address.create({
      ...addressData,
      userId: user._id,
    });

    // Optional: Add address reference to user
    await User.findByIdAndUpdate(user._id, {
      $push: { addresses: address._id },
    });

    return NextResponse.json(
      {
        message: "Address created successfully",
        address,
        success: true,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error creating address:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create address";
    return NextResponse.json(
      {
        message: errorMessage,
        success: false,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    // Get user session
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        {
          message: "Unauthorized - Please log in",
          success: false,
        },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
          success: false,
        },
        { status: 404 }
      );
    }

    // Get addresses for specific user
    const addresses = await Address.find({ userId: user._id }).sort({
      createdAt: -1,
    });

    return NextResponse.json(
      {
        message: "Addresses retrieved successfully",
        addresses,
        success: true,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error fetching addresses:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch addresses";
    return NextResponse.json(
      {
        message: errorMessage,
        success: false,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();

    // Get user session
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        {
          message: "Unauthorized - Please log in",
          success: false,
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          message: "Address ID is required",
          success: false,
        },
        { status: 400 }
      );
    }

    const userEmail = session.user.email;
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
          success: false,
        },
        { status: 404 }
      );
    }

    // Verify the address belongs to the user
    const address = await Address.findOne({ _id: id, userId: user._id });

    if (!address) {
      return NextResponse.json(
        {
          message: "Address not found or access denied",
          success: false,
        },
        { status: 404 }
      );
    }

    // const deletedAddress = await Address.findByIdAndDelete(id);

    // Optional: Remove address reference from user
    await User.findByIdAndUpdate(user._id, {
      $pull: { addresses: id },
    });

    return NextResponse.json(
      {
        message: "Address deleted successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error deleting address:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete address";
    return NextResponse.json(
      {
        message: errorMessage,
        success: false,
      },
      { status: 500 }
    );
  }
}

// Add PUT endpoint for updating addresses
export async function PUT(req: Request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        {
          message: "Unauthorized - Please log in",
          success: false,
        },
        { status: 401 }
      );
    }

    const { id, ...updateData } = await req.json();
    const userEmail = session.user.email;
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
          success: false,
        },
        { status: 404 }
      );
    }

    // Verify the address belongs to the user
    const address = await Address.findOne({ _id: id, userId: user._id });

    if (!address) {
      return NextResponse.json(
        {
          message: "Address not found or access denied",
          success: false,
        },
        { status: 404 }
      );
    }

    const updatedAddress = await Address.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(
      {
        message: "Address updated successfully",
        address: updatedAddress,
        success: true,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error updating address:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update address";
    return NextResponse.json(
      {
        message: errorMessage,
        success: false,
      },
      { status: 500 }
    );
  }
}
