"use client";
import React, {
  lazy,
  Suspense,
  useState,
  memo,
  useCallback,
  useMemo,
} from "react";
// import Image from "next/image";
// import { assets } from "@/public/assets/assets";
import Link from "next/link";
import { ProductCardProps } from "../../types/types";
import { getOptimizedImageUrl } from "../../utils/imageUtils";
import { useTranslations } from "next-intl";
// Import ProductImage directly for LCP candidates to avoid lazy loading delay
import ProductImage from "./ProductImage";
const ProductImageLazy = lazy(() => import("./ProductImage"));

interface ProductCardComponentProps {
  product: ProductCardProps;
  isLCP?: boolean; // Indicates if this is an LCP candidate
  isAboveFold?: boolean; // Indicates if this image is above the fold
}

const ProductCard = memo(
  ({
    product,
    isLCP = false,
    isAboveFold = false,
  }: ProductCardComponentProps) => {
    const t = useTranslations("common");
    const [imageError, setImageError] = useState(false);

    // Compute image URL synchronously during render instead of useEffect
    // This eliminates delay in image src assignment and improves LCP significantly
    const imageSrc = useMemo(() => {
      if (product._id) {
        const displayWidth = 320; // Max display size for product cards
        const displayHeight = 320;
        // Use optimized quality (80) for better compression while maintaining visual quality
        return getOptimizedImageUrl(
          product._id as string,
          0,
          displayWidth,
          displayHeight,
          80
        );
      }
      return "";
    }, [product._id]);

    const handleImageError = useCallback(() => {
      console.error("Image failed to load");
      setImageError(true);
    }, []);

    return (
      <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden ">
        {/* Product Link */}
        <Link href={`/product/${product._id}`} className="block">
          {/* Product Image Container */}
          <div
            className="relative bg-secondaryLight rounded-t-2xl flex items-center justify-center overflow-hidden"
            style={{ aspectRatio: "1 / 1" }}
          >
            {imageSrc && !imageError ? (
              isLCP || isAboveFold ? (
                // Render LCP and above-fold images directly without lazy loading
                <ProductImage
                  productName={product.name}
                  imageSrc={imageSrc}
                  handleImageError={handleImageError}
                  fetchPriority={isLCP ? "high" : "auto"}
                  loading="eager"
                  context="product-card"
                  width={320}
                  height={320}
                  productId={product._id as string}
                />
              ) : (
                <Suspense
                  fallback={
                    <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                      <span className="text-gray-400 text-sm">
                        {t("loading")}
                      </span>
                    </div>
                  }
                >
                  <ProductImageLazy
                    productName={product.name}
                    imageSrc={imageSrc}
                    handleImageError={handleImageError}
                    fetchPriority="auto"
                    loading="lazy"
                    context="product-card"
                    width={320}
                    height={320}
                    productId={product._id as string}
                  />
                </Suspense>
              )
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

            {/* Price */}
            <div className="flex items-center justify-start pt-2">
              <div className="flex flex-col">
                <span className="font-bold text-lg text-gray-900">
                  {product.price} {t("currency")}
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }
);

ProductCard.displayName = "ProductCard";

export default ProductCard;
