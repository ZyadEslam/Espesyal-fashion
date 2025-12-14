// "use client";
// import React, { useState, useEffect } from "react";
// import Image from "next/image";
// import { ProductCardProps } from "../types/types";

// const ProductImagesSlider = ({ product }: { product: ProductCardProps }) => {
//   const [selectedImageIndex, setSelectedImageIndex] = useState(0);
//   const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
//   const [loadingImages, setLoadingImages] = useState<Set<number>>(new Set());

//   // Initialize loading state for all images
//   useEffect(() => {
//     const initialLoadingState = new Set(
//       product.imgSrc.map((_, index) => index)
//     );
//     setLoadingImages(initialLoadingState);
//   }, [product.imgSrc]);

//   const handleImageError = (index: number) => {
//     setFailedImages((prev) => new Set([...prev, index]));
//     setLoadingImages((prev) => {
//       const newSet = new Set(prev);
//       newSet.delete(index);
//       return newSet;
//     });
//     // If the failed image is the currently selected one, try to select another valid image
//     if (index === selectedImageIndex) {
//       const nextValidIndex = product.imgSrc.findIndex(
//         (_, i) => !failedImages.has(i)
//       );
//       if (nextValidIndex !== -1) {
//         setSelectedImageIndex(nextValidIndex);
//       }
//     }
//   };

//   const handleImageLoad = (index: number) => {
//     setLoadingImages((prev) => {
//       const newSet = new Set(prev);
//       newSet.delete(index);
//       return newSet;
//     });
//   };

//   if (!product?.imgSrc?.length) {
//     return (
//       <div className="w-full md:w-1/3 relative md:left-20">
//         <div className="bg-secondaryLight rounded-lg mb-2 sm:mb-3 md:mb-4 p-2 sm:p-3 md:p-4">
//           <div className="w-full h-[300px] animate-pulse bg-gray-200 rounded-lg"></div>
//         </div>
//       </div>
//     );
//   }

//   // Filter out failed images
//   const validImages = product.imgSrc.filter(
//     (_, index) => !failedImages.has(index)
//   );

//   if (validImages.length === 0) {
//     return (
//       <div className="w-full md:w-1/3 relative md:left-20">
//         <div className="bg-secondaryLight rounded-lg mb-2 sm:mb-3 md:mb-4 p-2 sm:p-3 md:p-4">
//           <div className="w-full h-[300px] flex items-center justify-center text-gray-400">
//             No images available
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full md:w-1/3 relative md:left-20">
//       <div className="bg-secondaryLight rounded-lg mb-2 sm:mb-3 md:mb-4 p-2 sm:p-3 md:p-4">
//         <div className="relative w-full h-[300px]">
//           {loadingImages.has(selectedImageIndex) && (
//             <div className="absolute inset-0 animate-pulse bg-gray-200 rounded-lg"></div>
//           )}
//           <Image
//             src={validImages[selectedImageIndex]}
//             alt={product.name}
//             className={`object-contain transition-opacity duration-300 ${
//               loadingImages.has(selectedImageIndex)
//                 ? "opacity-0"
//                 : "opacity-100"
//             }`}
//             width={500}
//             height={500}
//             priority
//             onError={() => handleImageError(selectedImageIndex)}
//             onLoad={() => handleImageLoad(selectedImageIndex)}
//           />
//         </div>
//       </div>
//       <div className="flex flex-wrap gap-2 sm:gap-3 mt-2 sm:mt-3 md:mt-4 justify-center sm:justify-start">
//         {validImages.map((img, index) => (
//           <div
//             key={index}
//             className={`rounded-lg cursor-pointer p-1 relative ${
//               selectedImageIndex === index
//                 ? "border-2 border-orange"
//                 : "bg-secondaryLight"
//             }`}
//             onClick={() => setSelectedImageIndex(index)}
//           >
//             {loadingImages.has(index) && (
//               <div className="absolute inset-0 animate-pulse bg-gray-200 rounded-lg"></div>
//             )}
//             <Image
//               src={img}
//               alt={`${product.name} view ${index + 1}`}
//               width={80}
//               height={80}
//               className={`w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] md:w-[80px] md:h-[80px] object-cover transition-opacity duration-300 ${
//                 loadingImages.has(index) ? "opacity-0" : "opacity-100"
//               }`}
//               onError={() => handleImageError(index)}
//               onLoad={() => handleImageLoad(index)}
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ProductImagesSlider;

"use client";
import React, { useState, useEffect } from "react";
import { ProductCardProps } from "../../types/types";
import { getOptimizedImageUrl, getImageDimensions } from "../../utils/imageUtils";

const ProductImagesSlider = ({ product }: { product: ProductCardProps }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const [loadingImages, setLoadingImages] = useState<Set<number>>(new Set());

  // Initialize loading state for all images
  useEffect(() => {
    const initialLoadingState = new Set(
      product.imgSrc.map((_, index) => index)
    );
    setLoadingImages(initialLoadingState);
  }, [product.imgSrc]);

  const handleImageError = (originalIndex: number) => {
    setFailedImages((prev) => new Set([...prev, originalIndex]));
    setLoadingImages((prev) => {
      const newSet = new Set(prev);
      newSet.delete(originalIndex);
      return newSet;
    });

    // If the failed image is the currently selected one, select the first valid image
    const validImages = product.imgSrc.filter(
      (_, index) => !failedImages.has(index) && index !== originalIndex
    );
    if (
      validImages.length > 0 &&
      originalIndex === getOriginalIndex(selectedImageIndex)
    ) {
      setSelectedImageIndex(0); // Reset to first valid image
    }
  };

  const handleImageLoad = (originalIndex: number) => {
    setLoadingImages((prev) => {
      const newSet = new Set(prev);
      newSet.delete(originalIndex);
      return newSet;
    });
  };

  // Helper function to get the original index from the filtered array index
  const getOriginalIndex = (filteredIndex: number) => {
    const validIndices = product.imgSrc
      .map((_, index) => index)
      .filter((index) => !failedImages.has(index));
    return validIndices[filteredIndex];
  };

  if (!product?.imgSrc?.length) {
    return (
      <div className="w-full md:w-1/3 relative md:left-20">
        <div className="bg-secondaryLight rounded-lg mb-2 sm:mb-3 md:mb-4 p-2 sm:p-3 md:p-4">
          <div className="w-full h-[300px] flex items-center justify-center text-gray-400 bg-gray-100 rounded-lg">
            No images available
          </div>
        </div>
      </div>
    );
  }

  // Filter out failed images with their original indices
  // Handle both string URLs and StaticImageData objects
  const validImagesWithIndices = product.imgSrc
    .map((img, originalIndex) => {
      // If img is a string (URL), use it directly
      // If img is an object with src property, use img.src
      const src = typeof img === "string" ? img : (img as { src: string }).src;
      return { src, originalIndex };
    })
    .filter(({ originalIndex }) => !failedImages.has(originalIndex));

  if (validImagesWithIndices.length === 0) {
    return (
      <div className="w-full md:w-1/3 relative md:left-20">
        <div className="bg-secondaryLight rounded-lg mb-2 sm:mb-3 md:mb-4 p-2 sm:p-3 md:p-4">
          <div className="w-full h-[300px] flex items-center justify-center text-gray-400 bg-gray-100 rounded-lg">
            No images available
          </div>
        </div>
      </div>
    );
  }

  // Ensure selectedImageIndex is within bounds
  const safeSelectedIndex = Math.min(
    selectedImageIndex,
    validImagesWithIndices.length - 1
  );
  const currentImage = validImagesWithIndices[safeSelectedIndex];

  // Get optimized image URLs with proper dimensions
  const mainImageDimensions = getImageDimensions("product-detail");
  const thumbnailDimensions = getImageDimensions("thumbnail");
  
  // Generate optimized URLs using product ID directly
  const getOptimizedMainImageUrl = (originalIndex: number) => {
    if (product._id) {
      return getOptimizedImageUrl(
        product._id as string,
        originalIndex,
        mainImageDimensions.width,
        mainImageDimensions.height,
        90
      );
    }
    return currentImage.src;
  };

  return (
    <div className="w-full md:w-1/3 relative md:left-20">
      <div className="bg-secondaryLight rounded-lg mb-2 sm:mb-3 md:mb-4 p-2 sm:p-3 md:p-4">
        <div className="relative w-full h-[300px]" style={{ aspectRatio: "1 / 1" }}>
          {loadingImages.has(currentImage.originalIndex) && (
            <div className="absolute inset-0 animate-pulse bg-gray-200 rounded-lg"></div>
          )}
          {failedImages.has(currentImage.originalIndex) ? (
            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100 rounded-lg">
              Image unavailable
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={getOptimizedMainImageUrl(currentImage.originalIndex)}
              alt={product.name}
              className="w-full h-full object-contain"
              width={mainImageDimensions.width}
              height={mainImageDimensions.height}
              sizes="(max-width: 768px) 100vw, 33vw"
              fetchPriority="high"
              loading="eager"
              decoding="async"
              onError={() => handleImageError(currentImage.originalIndex)}
              onLoad={() => handleImageLoad(currentImage.originalIndex)}
            />
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 sm:gap-3 mt-2 sm:mt-3 md:mt-4 justify-center sm:justify-start">
        {validImagesWithIndices.map(({ src, originalIndex }, filteredIndex) => {
          // Generate optimized thumbnail URL using product ID directly
          const getOptimizedThumbnailUrl = () => {
            if (product._id) {
              return getOptimizedImageUrl(
                product._id as string,
                originalIndex,
                thumbnailDimensions.width,
                thumbnailDimensions.height,
                75
              );
            }
            return src;
          };

          return (
            <div
              key={originalIndex}
              className={`rounded-lg cursor-pointer p-1 relative ${
                safeSelectedIndex === filteredIndex
                  ? "border-2 border-orange"
                  : "bg-secondaryLight"
              }`}
              onClick={() => setSelectedImageIndex(filteredIndex)}
              style={{ width: `${thumbnailDimensions.width}px`, height: `${thumbnailDimensions.height}px` }}
            >
              {loadingImages.has(originalIndex) && (
                <div className="absolute inset-0 animate-pulse bg-gray-200 rounded-lg"></div>
              )}
              {failedImages.has(originalIndex) ? (
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 bg-gray-100 rounded">
                  N/A
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={getOptimizedThumbnailUrl()}
                  alt={`${product.name} view ${filteredIndex + 1}`}
                  width={thumbnailDimensions.width}
                  height={thumbnailDimensions.height}
                  className="w-full h-full object-cover rounded"
                  sizes="80px"
                  loading="lazy"
                  decoding="async"
                  onLoad={() => handleImageLoad(originalIndex)}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductImagesSlider;
