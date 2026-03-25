import React, { useState, useCallback } from "react";
import { getImageSizes } from "../../utils/imageUtils";

interface ProductImageProps {
  imageSrc: string;
  productName: string;
  handleImageError?: () => void;
  fetchPriority?: "high" | "low" | "auto";
  loading?: "lazy" | "eager";
  context?: "product-card" | "product-detail" | "thumbnail" | "hero";
  width?: number;
  height?: number;
  showPlaceholder?: boolean;
}

function buildOptimizedProductImageUrl(
  src: string,
  width: number,
  height: number
): string {
  if (!src) return src;

  // DB imageSrc values are already Cloudinary links.
  // For maximum visual quality (restore previous behavior), do not modify Cloudinary URLs.
  if (src.includes("res.cloudinary.com") && src.includes("/image/upload/")) {
    return src;
  }

  // If it’s our Sharp-powered API route, add sizing params to avoid serving huge images.
  if (src.startsWith("/api/product/image/")) {
    try {
      const url = new URL(src, "http://local");
      const sp = url.searchParams;
      if (!sp.has("w")) sp.set("w", String(width));
      if (!sp.has("h")) sp.set("h", String(height));
      if (!sp.has("q")) sp.set("q", "80");
      return `${url.pathname}?${sp.toString()}`;
    } catch {
      return src;
    }
  }

  return src;
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
  showPlaceholder = true,
}: ProductImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const sizes = getImageSizes(context);
  const optimizedSrc = buildOptimizedProductImageUrl(imageSrc, width, height);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const onError = useCallback(() => {
    setHasError(true);
    handleImageError?.();
  }, [handleImageError]);

  // Use regular img tag for our custom API routes to bypass Next.js Image validation
  // Our API route handles all optimization (resizing, format conversion, etc.)
  return (
    <div className="relative w-full h-full">
      {/* Simple placeholder - shows while image is loading */}
      {showPlaceholder && !isLoaded && !hasError && (
        <div
          className="absolute inset-0 bg-gradient-to-br from-primary-50 to-secondary-50"
        />
      )}

      {/* Main image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={optimizedSrc}
        alt={productName || "Product Image"}
        width={width}
        height={height}
        sizes={sizes}
        fetchPriority={fetchPriority}
        loading={loading}
        className={`block h-full w-full max-h-full max-w-full object-contain object-center mx-auto transition-opacity duration-200 hover:scale-[1.02] ${
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
