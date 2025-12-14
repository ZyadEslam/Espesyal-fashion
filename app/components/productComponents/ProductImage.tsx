import React from "react";
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
}: ProductImageProps) => {
  const sizes = getImageSizes(context);

  // Use regular img tag for our custom API routes to bypass Next.js Image validation
  // Our API route handles all optimization (resizing, format conversion, etc.)
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageSrc}
      alt={productName || "Product Image"}
      width={width}
      height={height}
      sizes={sizes}
      fetchPriority={fetchPriority}
      loading={loading}
      className="h-full w-full object-contain object-center transition-transform duration-300 hover:scale-[1.02]"
      onError={handleImageError}
      decoding="async"
    />
  );
};

export default ProductImage;
