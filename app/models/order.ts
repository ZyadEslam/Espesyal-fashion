import mongoose from "mongoose";
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
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Order Products are required"],
    default:[]
  }],
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
    required: [true, "Order State is required"],
    default: "Pending"
  },
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;