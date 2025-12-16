import React from "react";
import { getImageSizes, getImageSrcSet } from "../../utils/imageUtils";

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
}: ProductImageProps) => {
  const sizes = getImageSizes(context);

  // Generate srcset for responsive images if productId is provided
  // Optimized sizes to match actual display dimensions (no unnecessary larger sizes)
  const srcset =
    productId && context !== "thumbnail"
      ? getImageSrcSet(
          productId,
          0,
          context === "product-card"
            ? [220, 260, 320] // Match actual display sizes: mobile ~220px, tablet ~260px, desktop ~320px
            : [400, 600, 800, 1200]
        )
      : undefined;

  // Use regular img tag for our custom API routes to bypass Next.js Image validation
  // Our API route handles all optimization (resizing, format conversion, etc.)
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageSrc}
      srcSet={srcset}
      alt={productName || "Product Image"}
      width={width}
      height={height}
      sizes={sizes}
      fetchPriority={fetchPriority}
      loading={loading}
      className="block h-full w-full max-h-full max-w-full object-contain object-center mx-auto transition-transform duration-300 hover:scale-[1.02]"
      onError={handleImageError}
      decoding="async"
    />
  );
};

export default ProductImage;
