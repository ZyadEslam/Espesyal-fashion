"use client";
import React, { useState } from "react";
import RatingStars from "../RatingStars";
import Toast from "../../UI/Toast";
import { ProductCardProps } from "../../types/types";
import { Plus, Minus } from "lucide-react";

import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";

const ProductDetails = ({ data }: { data: ProductCardProps }) => {
  const { addToCart, removeFromCart, isInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [showToast, setShowToast] = useState({ show: false, message: "" });

  // Product options state
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  // Available options (you can make these dynamic based on product data)
  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const availableColors = [
    { name: "Black", value: "black", color: "bg-black" },
    { name: "White", value: "white", color: "bg-white border border-gray-300" },
    { name: "Red", value: "red", color: "bg-red-500" },
    { name: "Blue", value: "blue", color: "bg-blue-500" },
    { name: "Green", value: "green", color: "bg-green-500" },
    { name: "Gray", value: "gray", color: "bg-gray-500" },
  ];

  const handleShowToast = (showState: boolean, message: string) => {
    setShowToast(() => {
      return {
        show: showState,
        message: message,
      };
    });
    setTimeout(() => {
      setShowToast(() => {
        return { show: false, message: "" };
      });
    }, 3000);
  };

  const listHandler = (handlerType: string) => {
    if (handlerType === "wishlist") {
      if (!isInWishlist(data._id as string)) {
        handleShowToast(true, "Added To wishlist");
        addToWishlist(data);
      } else {
        handleShowToast(true, "Removed from wishlist");
        removeFromWishlist(data._id as string);
      }
    } else if (handlerType === "cart") {
      if (!isInCart(data._id as string)) {
        handleShowToast(true, "Added To Cart");
        addToCart(data);
      } else {
        handleShowToast(true, "Removed From Cart");
        removeFromCart(data._id as string);
      }
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const isAddToCartDisabled = !selectedSize || !selectedColor;

  return (
    <div className="w-full md:w-1/2 mt-6 md:mt-0">
      <h1 className="sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3">
        {data.name}
      </h1>

      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <RatingStars rating={data.rating} />
        <span className="text-xs sm:text-sm text-gray-600">{data.rating}</span>
      </div>

      <p className="md:text-[15px] sm:text-sm text-gray-600 mb-3 sm:mb-4">
        {data.description}
      </p>

      <p className="text-xl sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6">
        {data.price}$
        {data.oldPrice && (
          <span className="text-gray-400 font-normal text-sm ml-2 line-through">
            {data.oldPrice}$
          </span>
        )}
      </p>

      <hr className="my-4 sm:my-5 md:my-6 border-gray-200" />

      {/* Size Selection */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Size</h3>
        <div className="flex flex-wrap gap-2">
          {availableSizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
                selectedSize === size
                  ? "bg-orange text-white border-orange"
                  : "bg-white text-gray-700 border-gray-300 hover:border-orange hover:text-orange"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color Selection */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Color</h3>
        <div className="flex flex-wrap gap-3">
          {availableColors.map((color) => (
            <button
              key={color.value}
              onClick={() => setSelectedColor(color.value)}
              className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                color.color
              } ${
                selectedColor === color.value
                  ? "ring-2 ring-orange ring-offset-2"
                  : "hover:ring-2 hover:ring-gray-300 hover:ring-offset-2"
              }`}
              title={color.name}
            />
          ))}
        </div>
        {selectedColor && (
          <p className="text-sm text-gray-600 mt-2">
            Selected:{" "}
            {availableColors.find((c) => c.value === selectedColor)?.name}
          </p>
        )}
      </div>

      {/* Quantity Selection */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Quantity</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center font-semibold text-lg">
            {quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= 10}
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="md:space-y-1 text-[14px] sm:space-y-3 mb-4 sm:mb-6">
        <div className="flex">
          <span className="w-20 text-gray-600 sm:w-24 font-medium">Brand:</span>
          <span className="text-gray-400">{data.brand}</span>
        </div>
        <div className="flex">
          <span className="w-20 text-gray-600 sm:w-24 font-medium">Color:</span>
          <span className="text-gray-400">{data.color}</span>
        </div>
        <div className="flex">
          <span className="w-20 text-gray-600 sm:w-24 font-medium">
            Category:
          </span>
          <span className="text-gray-400">{data.category}</span>
        </div>
      </div>

      <div className="w-full flex sm:flex-col md:flex-row sm:gap-4 mt-4 sm:mt-6">
        <button
          className={`sm:w-auto sm:px-6 md:px-8 py-2 sm:py-3 transition-colors text-sm sm:text-base ${
            isAddToCartDisabled
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-secondaryLight text-gray-600 hover:bg-gray-300"
          }`}
          onClick={() => {
            listHandler("cart");
          }}
          disabled={showToast.show || isAddToCartDisabled}
        >
          {isInCart(data._id as string) ? "Remove From Cart" : "Add to Cart"}
        </button>
        <button
          className="sm:w-auto sm:px-6 md:px-8 py-2 sm:py-3 bg-orange text-white hover:bg-orange/90 transition-colors text-sm sm:text-base"
          onClick={() => {
            listHandler("wishlist");
          }}
          disabled={showToast.show}
        >
          {isInWishlist(data._id as string)
            ? "Remove from wishlist"
            : "Add to wishlist"}
        </button>
      </div>

      {/* Selection Summary */}
      {(selectedSize || selectedColor) && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            Selected Options:
          </h4>
          <div className="text-sm text-gray-600">
            {selectedSize && <p>Size: {selectedSize}</p>}
            {selectedColor && (
              <p>
                Color:{" "}
                {availableColors.find((c) => c.value === selectedColor)?.name}
              </p>
            )}
            <p>Quantity: {quantity}</p>
          </div>
        </div>
      )}

      {showToast.show && (
        <Toast
          state={showToast.message.includes("Added") ? "success" : "fail"}
          message={showToast.message}
        />
      )}
    </div>
  );
};

export default ProductDetails;
