import mongoose from "mongoose";

const heroSectionSchema = new mongoose.Schema(
  {
    heroBadge: {
      type: String,
      required: [true, "Hero badge is required"],
      trim: true,
    },
    largestSale: {
      type: String,
      required: [true, "Largest sale text is required"],
      trim: true,
    },
    useCode: {
      type: String,
      trim: true,
    },
    forDiscount: {
      type: String,
      trim: true,
    },
    promoCode: {
      type: String,
      trim: true,
      uppercase: true,
    },
    showPromoSection: {
      type: Boolean,
      default: true,
    },
    locale: {
      type: String,
      enum: ["en", "ar"],
      required: [true, "Locale is required"],
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const HeroSection =
  mongoose.models.HeroSection ||
  mongoose.model("HeroSection", heroSectionSchema);

export default HeroSection;
