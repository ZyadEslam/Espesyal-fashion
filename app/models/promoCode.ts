import mongoose from "mongoose";

const promoCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, "Code is required"],
    unique: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  discountPercentage: {
    type: Number,
    required: [true, "Discount Percentage is required"],
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Admin ID is required"],
  },
});

const PromoCode =
  mongoose.models.PromoCode || mongoose.model("promoCode", promoCodeSchema);
export default PromoCode;
