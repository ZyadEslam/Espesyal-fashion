"use client";
import React, {
  useState,
} from "react";
import RatingStars from "../RatingStars";
import Toast from "../../UI/Toast";
import { ProductCardProps } from "../../types/types";

import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";

const ProductDetails = ({ data }: { data: ProductCardProps }) => {
  const { addToCart, removeFromCart, isInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [showToast, setShowToast] = useState({ show: false, message: "" });
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

      <div className="w-full flex sm:flex-col md:flex-row  sm:gap-4 mt-4 sm:mt-6">
        <button
          className="sm:w-auto sm:px-6 md:px-8 py-2 sm:py-3 bg-secondaryLight text-gray-600 hover:bg-gray-300 transition-colors text-sm sm:text-base"
          onClick={() => {
            listHandler("cart");
          }}
          disabled={showToast.show}
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
