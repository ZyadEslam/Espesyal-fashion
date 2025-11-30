import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    shippingFee: {
      type: Number,
      required: [true, "Shipping fee is required"],
      default: 0,
      min: [0, "Shipping fee cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one settings document exists
settingsSchema.index({ _id: 1 }, { unique: true });

const Settings =
  mongoose.models.Settings || mongoose.model("Settings", settingsSchema);

export default Settings;
