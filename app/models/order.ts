import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Order item must reference a product"],
    },
    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
    size: {
      type: String,
      required: false,
      trim: true,
    },
    color: {
      type: String,
      required: false,
      trim: true,
    },
    sku: {
      type: String,
      required: false,
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Order item quantity is required"],
      min: [1, "Order item quantity must be at least 1"],
    },
    price: {
      type: Number,
      required: [true, "Order item price is required"],
      min: [0, "Order item price cannot be negative"],
    },
  },
  { _id: true }
);

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  products: {
    type: [orderItemSchema],
    default: [],
    validate: [
      {
        validator: (items: unknown[]) => Array.isArray(items) && items.length > 0,
        message: "Order must include at least one product",
      },
    ],
  },
  addressId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: [true, "Order Address is required"],
  },
  totalPrice: {
    type: Number,
    required: [true, "Order Address is required"],
  },
  orderState: {
    type: String,
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    required: [true, "Order State is required"],
    default: "Pending"
  },
  promoCode: {
    type: String,
    required: false,
  },
  discountAmount: {
    type: Number,
    required: false,
    default: 0,
  },
  discountPercentage: {
    type: Number,
    required: false,
  },
  paymentMethod: {
    type: String,
    enum: ["cash_on_delivery", "stripe"],
    default: "cash_on_delivery",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
  stripePaymentIntentId: {
    type: String,
    required: false,
  },
  trackingNumber: {
    type: String,
    required: false,
  },
  estimatedDeliveryDate: {
    type: Date,
    required: false,
  },
  shippedDate: {
    type: Date,
    required: false,
  },
  deliveredDate: {
    type: Date,
    required: false,
  },
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;