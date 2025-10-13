"use client";
import React, {
  lazy,
  Suspense,
  useEffect,
  useState,
  memo,
  useCallback,
} from "react";
import Image from "next/image";
import { assets } from "@/public/assets/assets";
import Link from "next/link";
import { Heart, Plus, Minus } from "lucide-react";
import { ProductCardProps } from "../../types/types";
import { useWishlist } from "../../hooks/useWishlist";
import { useCart } from "../../hooks/useCart";
const Toast = lazy(() => import("../../UI/Toast"));
const ProductImage = lazy(() => import("./ProductImage"));

const ProductCard = memo(({ product }: { product: ProductCardProps }) => {
  const [inWishlist, setInWishlist] = useState(false);
  const [inCart, setInCart] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [showToast, setShowToast] = useState({ show: false, message: "" });
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart, removeFromCart, isInCart: checkInCart } = useCart();

  useEffect(() => {
    setInWishlist(isInWishlist(product._id as string));
    setInCart(checkInCart(product._id as string));

    if (product._id) {
      setImageSrc(`/api/product/image/${product._id}?index=0`);
    }
  }, [product._id, isInWishlist, checkInCart]);

  const handleShowToast = useCallback((showState: boolean, message: string) => {
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
  }, []);

  const wishlistHandler = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault(); // Prevent navigation when clicking heart
      e.stopPropagation();

      if (!inWishlist) {
        addToWishlist(product);
        handleShowToast(true, "Added To wishlist");
        setInWishlist(true);
      } else {
        removeFromWishlist(product._id as string);
        handleShowToast(true, "Removed from wishlist");
        setInWishlist(false);
      }
    },
    [inWishlist, addToWishlist, removeFromWishlist, product, handleShowToast]
  );

  const cartHandler = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault(); // Prevent navigation when clicking cart button
      e.stopPropagation();

      if (!inCart) {
        addToCart(product);
        handleShowToast(true, "Added to cart");
        setInCart(true);
      } else {
        removeFromCart(product._id as string);
        handleShowToast(true, "Removed from cart");
        setInCart(false);
      }
    },
    [inCart, addToCart, removeFromCart, product, handleShowToast]
  );

  const handleImageError = useCallback(() => {
    console.error("Image failed to load");
    setImageError(true);
  }, []);

  return (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-orange/20">
      {/* Wishlist Button */}
      <button
        className={`absolute top-3 right-3 z-20 w-8 h-8 rounded-full backdrop-blur-sm transition-all duration-200 ${
          inWishlist
            ? "bg-orange/90 text-white shadow-md"
            : "bg-white/80 text-gray-500 hover:bg-orange/10 hover:text-orange"
        }`}
        onClick={wishlistHandler}
        aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          className={`w-4 h-4 mx-auto ${
            inWishlist ? "text-white" : "text-gray-500"
          }`}
          fill={inWishlist ? "#c4956c" : "none"}
        />
      </button>

      {/* Toast Notification */}
      {showToast.show && (
        <Toast
          state={showToast.message.includes("Added") ? "success" : "fail"}
          message={showToast.message}
        />
      )}

      {/* Product Link */}
      <Link href={`/product/${product._id}`} className="block">
        {/* Product Image Container */}
        <div className="relative bg-secondaryLight rounded-t-2xl h-48 overflow-hidden">
          {imageSrc && !imageError ? (
            <Suspense
              fallback={
                <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Loading...</span>
                </div>
              }
            >
              <ProductImage
                productName={product.name}
                imageSrc={imageSrc}
                handleImageError={handleImageError}
              />
            </Suspense>
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-sm">No image</span>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300" />
        </div>

        {/* Product Details */}
        <div className="p-4 space-y-3">
          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 group-hover:text-orange transition-colors duration-200">
            {product.name}
          </h3>

          {/* Product Description */}
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.floor(product.rating) }).map(
                (_, index) => (
                  <Image
                    key={`star-filled-${index}`}
                    src={assets.star_icon}
                    width={12}
                    height={12}
                    alt="star"
                    className="transition-transform duration-200 hover:scale-110"
                  />
                )
              )}
              {Array.from({ length: Math.ceil(5 - product.rating) }).map(
                (_, index) => (
                  <Image
                    key={`star-empty-${index}`}
                    src={assets.star_dull_icon}
                    width={12}
                    height={12}
                    alt="star"
                  />
                )
              )}
            </div>
            <span className="text-xs text-gray-500 font-medium">
              {product.rating}
            </span>
          </div>

          {/* Price and Cart Button */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex flex-col">
              <span className="font-bold text-lg text-gray-900">
                ${product.price}
              </span>
            </div>

            {/* Cart Button */}
            <button
              onClick={cartHandler}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                inCart
                  ? "bg-orange text-white shadow-md hover:shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-orange hover:text-white hover:shadow-md"
              }`}
              aria-label={inCart ? "Remove from cart" : "Add to cart"}
            >
              {inCart ? (
                <Minus className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
