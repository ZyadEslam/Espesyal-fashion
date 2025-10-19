import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
  },
  description: {
    type: String,
    required: [true, "Product description is required"],
  },
  rating: {
    type: Number,
    required: [true, "Product rating is required"],
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
  },
  oldPrice: {
    type: Number,
    required: [false],
  },
  discount: {
    type: Number,
    required: [false, "Product discount is not required"],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Product category is required"],
  },
  categoryName: {
    type: String,
    required: [true, "Product category name is required"],
  },
  brand: {
    type: String,
    required: [true, "Product brand is required"],
  },

  imgSrc: {
    type: [Buffer],
    required: [true, "Product images are required"],
  },
  quantityInCart: {
    type: Number,
    required: false,
    default: 0,
  },
});
const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema); // see if the user is already exist & if not create a new one
export default Product;
