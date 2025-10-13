import React, { useEffect, useState, memo, useCallback } from "react";
import { ProductCardProps } from "../../types/types";
import Link from "next/link";
import Image from "next/image";
import Toast from "../../UI/Toast";
import { useWishlist } from "@/app/hooks/useWishlist";
import { useCart } from "@/app/hooks/useCart";
import { Heart, ShoppingCart, Trash2, ExternalLink } from "lucide-react";

interface WishlistTableProps {
  product: ProductCardProps;
}

const WishlistTableRow = memo(({ product }: WishlistTableProps) => {
  const [showToast, setShowToast] = useState({ show: false, message: "" });
  const [inCart, setInCart] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { removeFromWishlist } = useWishlist();
  const { isInCart, addToCart } = useCart();

  useEffect(() => {
    setInCart(isInCart(product._id as string));
  }, [product._id, isInCart]);

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

  const addToCartHandler = useCallback(
    (product: ProductCardProps) => {
      addToCart(product);
      handleShowToast(true, "Added To Cart");
      removeFromWishlist(product._id as string);
      setInCart(true);
    },
    [addToCart, handleShowToast, removeFromWishlist]
  );

  const removeFromWishlistHandler = useCallback(() => {
    removeFromWishlist(product._id as string);
    handleShowToast(true, "Removed from wishlist");
  }, [product._id, removeFromWishlist, handleShowToast]);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  return (
    <div className="group bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 hover:border-orange/20">
      {/* Mobile Layout */}
      <div className="md:hidden">
        <div className="flex gap-4 mb-4">
          {/* Product Image */}
          <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            <Link href={`/product/${product._id}`}>
              {!imageError ? (
                <Image
                  src={`/api/product/image/${product._id}?index=0`}
                  width={80}
                  height={80}
                  alt={product.name}
                  className="object-cover w-full h-full"
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-xs">No image</span>
                </div>
              )}
            </Link>
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <Link href={`/product/${product._id}`}>
              <h3 className="font-semibold text-gray-900 text-sm leading-tight hover:text-orange transition-colors duration-200 line-clamp-2">
                {product.name}
              </h3>
            </Link>
            <p className="text-lg font-bold text-gray-900 mt-1">
              ${product.price}
            </p>
          </div>
        </div>

        {/* Mobile Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => addToCartHandler(product)}
            disabled={inCart}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              inCart
                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                : "bg-orange text-white hover:bg-orange/90"
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            {inCart ? "In Cart" : "Add to Cart"}
          </button>

          <button
            onClick={removeFromWishlistHandler}
            className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-200"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {inCart && (
          <div className="mt-3">
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 text-orange hover:text-orange/80 transition-colors duration-200 text-sm font-medium"
            >
              <ExternalLink className="w-3 h-3" />
              Go to Cart
            </Link>
          </div>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:grid md:grid-cols-12 gap-6 items-center">
        {/* Product Details */}
        <div className="col-span-6 flex items-center gap-4">
          <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            <Link href={`/product/${product._id}`}>
              {!imageError ? (
                <Image
                  src={`/api/product/image/${product._id}?index=0`}
                  width={64}
                  height={64}
                  alt={product.name}
                  className="object-cover w-full h-full"
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-xs">No image</span>
                </div>
              )}
            </Link>
          </div>

          <div className="flex-1 min-w-0">
            <Link href={`/product/${product._id}`}>
              <h3 className="font-semibold text-gray-900 hover:text-orange transition-colors duration-200 line-clamp-2">
                {product.name}
              </h3>
            </Link>
            <button
              onClick={removeFromWishlistHandler}
              className="text-red-500 hover:text-red-600 text-sm mt-1 transition-colors duration-200"
            >
              Remove from wishlist
            </button>
          </div>
        </div>

        {/* Price */}
        <div className="col-span-2">
          <p className="text-lg font-bold text-gray-900">${product.price}</p>
        </div>

        {/* Actions */}
        <div className="col-span-4 flex items-center gap-3">
          <button
            onClick={() => addToCartHandler(product)}
            disabled={inCart}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              inCart
                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                : "bg-orange text-white hover:bg-orange/90"
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            {inCart ? "In Cart" : "Add to Cart"}
          </button>

          {inCart && (
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 text-orange hover:text-orange/80 transition-colors duration-200 text-sm font-medium"
            >
              <ExternalLink className="w-3 h-3" />
              Go to Cart
            </Link>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {showToast.show && (
        <Toast
          state={showToast.message.includes("Added") ? "success" : "fail"}
          message={showToast.message}
        />
      )}
    </div>
  );
});

WishlistTableRow.displayName = "WishlistTableRow";

export default WishlistTableRow;
