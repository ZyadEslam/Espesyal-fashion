import React, { useState, useCallback } from "react";
import {
  getImageSizes,
  getImageSrcSet,
  getBlurPlaceholder,
} from "../../utils/imageUtils";

interface ProductImageProps {
  imageSrc: string;
  productName: string;
  handleImageError?: () => void;
  fetchPriority?: "high" | "low" | "auto";
  loading?: "lazy" | "eager";
  context?: "product-card" | "product-detail" | "thumbnail" | "hero";
  width?: number;
  height?: number;
  productId?: string;
  showPlaceholder?: boolean;
}

const ProductImage = ({
  imageSrc,
  productName,
  handleImageError,
  fetchPriority = "auto",
  loading = "lazy",
  context = "product-card",
  width = 400,
  height = 400,
  productId,
  showPlaceholder = true,
}: ProductImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const sizes = getImageSizes(context);

  // Generate srcset for responsive images if productId is provided
  // Sizes account for retina/high-DPI displays (2x-3x) to ensure sharp images on all devices
  const srcset =
    productId && context !== "thumbnail"
      ? getImageSrcSet(
          productId,
          0,
          context === "product-card"
            ? [320, 480, 640, 800] // 320 for 1x, 480-640 for 2x, 800 for 3x retina
            : [400, 600, 800, 1200]
        )
      : undefined;

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const onError = useCallback(() => {
    setHasError(true);
    handleImageError?.();
  }, [handleImageError]);

  // Static blur placeholder (tiny SVG)
  const blurPlaceholder = getBlurPlaceholder();

  // Use regular img tag for our custom API routes to bypass Next.js Image validation
  // Our API route handles all optimization (resizing, format conversion, etc.)
  return (
    <div className="relative w-full h-full">
      {/* Blur placeholder - shows while image is loading */}
      {showPlaceholder && !isLoaded && !hasError && (
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            backgroundImage: `url("${blurPlaceholder}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(8px)",
            transform: "scale(1.1)", // Prevent blur edges from showing
          }}
        />
      )}

      {/* Main image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageSrc}
        srcSet={srcset}
        alt={productName || "Product Image"}
        width={width}
        height={height}
        sizes={sizes}
        fetchPriority={fetchPriority}
        loading={loading}
        className={`block h-full w-full max-h-full max-w-full object-contain object-center mx-auto transition-all duration-300 hover:scale-[1.02] ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={handleLoad}
        onError={onError}
        decoding="async"
      />
    </div>
  );
};

export default ProductImage;
