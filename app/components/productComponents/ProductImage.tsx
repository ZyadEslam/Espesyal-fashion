import Image from "next/image";
import React from "react";

const ProductImage = ({
  imageSrc,
  productName,
  handleImageError,
}: {
  imageSrc: string;
  productName: string;
  handleImageError?: () => void;
}) => {
  return (
    <Image
      src={imageSrc}
      alt={productName || "Product Image"}
      width={300}
      height={300}
      className="h-full w-full object-contain object-center transition-transform duration-300 hover:scale-[1.02]"
      onError={handleImageError}
      unoptimized={true} // Important for custom image API
    />
  );
};

export default ProductImage;
