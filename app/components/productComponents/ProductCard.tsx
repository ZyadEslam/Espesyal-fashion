"use client";
import React, {
  lazy,
  Suspense,
  useEffect,
  useState,
  memo,
  useCallback,
  useRef,
} from "react";
// import Image from "next/image";
// import { assets } from "@/public/assets/assets";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { ProductCardProps } from "../../types/types";
import { useCart } from "../../hooks/useCart";
import { useTranslations } from "next-intl";
const Toast = lazy(() => import("../../UI/Toast"));
const ProductImage = lazy(() => import("./ProductImage"));

const ProductCard = memo(({ product }: { product: ProductCardProps }) => {
  const [inCart, setInCart] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [showToast, setShowToast] = useState({ show: false, message: "" });
  const { addToCart, removeFromCart, isInCart: checkInCart } = useCart();
  const t = useTranslations("product");

  // Check if product is in cart - use a ref to track previous state to prevent unnecessary updates
  const prevInCartRef = useRef(inCart);

  useEffect(() => {
    const currentlyInCart = checkInCart(product._id as string);
    // Only update state if the value actually changed
    if (currentlyInCart !== prevInCartRef.current) {
      prevInCartRef.current = currentlyInCart;
      setInCart(currentlyInCart);
    }
  }, [product._id, checkInCart]);

  // Set image source only once
  useEffect(() => {
    if (product._id) {
      setImageSrc(`/api/product/image/${product._id}?index=0`);
    }
  }, [product._id]);

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

  const cartHandler = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault(); // Prevent navigation when clicking cart button
      e.stopPropagation();

      if (product.variants?.length) {
        handleShowToast(true, t("selectSizeColor"));
        return;
      }

      if (!inCart) {
        addToCart(product);
        handleShowToast(true, t("addedToCartShort"));
        setInCart(true);
      } else {
        removeFromCart(product._id as string);
        handleShowToast(true, t("removedFromCartShort"));
        setInCart(false);
      }
    },
    [inCart, addToCart, removeFromCart, product, handleShowToast, t]
  );

  const handleImageError = useCallback(() => {
    console.error("Image failed to load");
    setImageError(true);
  }, []);

  return (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-orange/20">
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
        <div className="relative bg-secondaryLight rounded-t-2xl h-[260px] sm:h-[320px] flex items-center justify-center overflow-hidden">
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
                  : "bg-gray-100 text-gray-600 hover:bg-orange/10 hover:text-orange hover:shadow-md"
              }`}
              aria-label={inCart ? t("removeFromCart") : t("addToCart")}
            >
              {
                <ShoppingCart
                  className={`w-4 h-4 ${
                    inCart ? "text-white" : "text-gray-500"
                  }`}
                />
              }
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
