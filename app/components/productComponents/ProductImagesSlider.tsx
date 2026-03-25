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
import { getImageDimensions } from "../../utils/imageUtils";

const ProductImagesSlider = ({ product }: { product: ProductCardProps }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const [loadingImages, setLoadingImages] = useState<Set<number>>(new Set());
  const [imageLoaded, setImageLoaded] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState<Set<number>>(
    new Set()
  );

  const mainImageDimensions = getImageDimensions("product-detail");
  const thumbnailDimensions = getImageDimensions("thumbnail");

  useEffect(() => {
    if (!product.imgSrc?.length) return;

    const preloadImage = (originalIndex: number, isFirst: boolean) => {
      const raw = product.imgSrc[originalIndex] as string | { src?: string };
      const imageUrl = typeof raw === "string" ? raw : raw?.src || "";
      if (!imageUrl) return;

      const img = new window.Image();
      // Set high priority for first image
      if (isFirst) {
        img.fetchPriority = "high";
      }
      img.onload = () => {
        setPreloadedImages((prev) => new Set([...prev, originalIndex]));
        setLoadingImages((prev) => {
          const newSet = new Set(prev);
          newSet.delete(originalIndex);
          return newSet;
        });
      };
      img.onerror = () => {
        setFailedImages((prev) => new Set([...prev, originalIndex]));
        setLoadingImages((prev) => {
          const newSet = new Set(prev);
          newSet.delete(originalIndex);
          return newSet;
        });
      };
      img.src = imageUrl;
    };

    // Load first image IMMEDIATELY with no delay
    preloadImage(0, true);

    // Preload other images in background with small delay to not compete with first image
    product.imgSrc.forEach((_, index) => {
      if (index > 0) {
        // Small delay to let first image load first
        setTimeout(() => preloadImage(index, false), 200 + index * 100);
      }
    });
  }, [product._id, product.imgSrc]);

  useEffect(() => {
    const initialLoadingState = new Set(
      product.imgSrc.map((_, index) => index)
    );
    setLoadingImages(initialLoadingState);
  }, [product.imgSrc]);

  const handleImageError = (originalIndex: number) => {
    setFailedImages((prev) => {
      const newFailed = new Set([...prev, originalIndex]);
      // Calculate the current original index using the PREVIOUS failedImages set
      // to check if the failed image is currently selected
      const validIndicesBeforeFailure = product.imgSrc
        .map((_, index) => index)
        .filter((index) => !prev.has(index));
      const currentOriginalIndex =
        validIndicesBeforeFailure[selectedImageIndex];

      // If the failed image is the currently selected one, select the first valid image
      if (originalIndex === currentOriginalIndex) {
        const validIndicesAfterFailure = product.imgSrc
          .map((_, index) => index)
          .filter((index) => !newFailed.has(index));
        if (validIndicesAfterFailure.length > 0) {
          // Find the index in the new validImagesWithIndices for the first valid image
          const firstValidOriginalIndex = validIndicesAfterFailure[0];
          const newSelectedIndex = validIndicesAfterFailure.indexOf(
            firstValidOriginalIndex
          );
          if (newSelectedIndex !== -1) {
            setSelectedImageIndex(newSelectedIndex);
          }
        }
      }
      return newFailed;
    });
    setLoadingImages((prev) => {
      const newSet = new Set(prev);
      newSet.delete(originalIndex);
      return newSet;
    });
  };

  const handleImageLoad = (originalIndex: number) => {
    setLoadingImages((prev) => {
      const newSet = new Set(prev);
      newSet.delete(originalIndex);
      return newSet;
    });
    // Set image loaded when the currently selected image loads
    const validImagesWithIndices = product.imgSrc
      .map((img, origIndex) => {
        const src =
          typeof img === "string" ? img : (img as { src: string }).src;
        return { src, originalIndex: origIndex };
      })
      .filter(({ originalIndex }) => !failedImages.has(originalIndex));

    const safeIdx = Math.min(
      selectedImageIndex,
      validImagesWithIndices.length - 1
    );
    const currentImg = validImagesWithIndices[safeIdx];

    if (currentImg && originalIndex === currentImg.originalIndex) {
      setImageLoaded(true);
    }
  };

  // Reset image loaded state when selected image changes
  // But if image is already preloaded, mark it as loaded immediately
  // This must be before any early returns to follow React Hooks rules
  useEffect(() => {
    if (!product?.imgSrc?.length) return;

    const validImages = product.imgSrc
      .map((img, origIndex) => {
        const src =
          typeof img === "string" ? img : (img as { src: string }).src;
        return { src, originalIndex: origIndex };
      })
      .filter(({ originalIndex }) => !failedImages.has(originalIndex));

    if (validImages.length === 0) return;

    const safeIdx = Math.min(selectedImageIndex, validImages.length - 1);
    const currentImg = validImages[safeIdx];

    if (currentImg && preloadedImages.has(currentImg.originalIndex)) {
      setImageLoaded(true);
    } else {
      setImageLoaded(false);
    }
  }, [selectedImageIndex, preloadedImages, product.imgSrc, failedImages]);

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

  const validImagesWithIndices = product.imgSrc
    .map((img, originalIndex) => {
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

  const isCurrentImagePreloaded = preloadedImages.has(
    currentImage.originalIndex
  );

  const getOptimizedMainImageUrl = () => {
    if (currentImage.src.startsWith("/api/product/image/")) {
      try {
        const url = new URL(currentImage.src, "http://local");
        if (!url.searchParams.has("w"))
          url.searchParams.set("w", String(mainImageDimensions.width));
        if (!url.searchParams.has("h"))
          url.searchParams.set("h", String(mainImageDimensions.height));
        if (!url.searchParams.has("q")) url.searchParams.set("q", "80");
        return `${url.pathname}?${url.searchParams.toString()}`;
      } catch {
        return currentImage.src;
      }
    }
    return currentImage.src;
  };

  const getMainImageSrcSet = () => {
    return undefined;
  };

  return (
    <div className="w-full md:w-1/3 relative md:left-20">
      <div className="bg-secondaryLight rounded-lg mb-2 sm:mb-3 md:mb-4 p-2 sm:p-3 md:p-4">
        <div
          className="relative w-full h-[300px]"
          style={{ aspectRatio: "1 / 1" }}
        >
          {/* Loading skeleton - only show if image is not preloaded */}
          {loadingImages.has(currentImage.originalIndex) &&
            !isCurrentImagePreloaded && (
              <div className="absolute inset-0 animate-pulse bg-gray-200 rounded-lg z-0"></div>
            )}
          {failedImages.has(currentImage.originalIndex) ? (
            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100 rounded-lg">
              Image unavailable
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`main-image-${currentImage.originalIndex}-${safeSelectedIndex}`}
              src={getOptimizedMainImageUrl()}
              srcSet={getMainImageSrcSet()}
              alt={product.name}
              className={`w-full h-full object-contain transition-opacity duration-200 ${
                imageLoaded || isCurrentImagePreloaded
                  ? "opacity-100"
                  : "opacity-0"
              }`}
              width={currentImage.originalIndex === 0 ? 600 : mainImageDimensions.width}
              height={currentImage.originalIndex === 0 ? 600 : mainImageDimensions.height}
              sizes="(max-width: 768px) 100vw, 33vw"
              fetchPriority={currentImage.originalIndex === 0 ? "high" : "auto"}
              loading={currentImage.originalIndex === 0 ? "eager" : "lazy"}
              decoding={currentImage.originalIndex === 0 ? "sync" : "async"}
              onError={() => handleImageError(currentImage.originalIndex)}
              onLoad={() => handleImageLoad(currentImage.originalIndex)}
            />
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 sm:gap-3 mt-2 sm:mt-3 md:mt-4 justify-center sm:justify-start">
        {validImagesWithIndices.map(({ src, originalIndex }, filteredIndex) => {
          const getOptimizedThumbnailUrl = () => {
            if (src.startsWith("/api/product/image/")) {
              try {
                const url = new URL(src, "http://local");
                url.searchParams.set("w", String(thumbnailDimensions.width));
                url.searchParams.set("h", String(thumbnailDimensions.height));
                if (!url.searchParams.has("q")) url.searchParams.set("q", "80");
                return `${url.pathname}?${url.searchParams.toString()}`;
              } catch {
                return src;
              }
            }
            return src;
          };

          return (
            <div
              key={originalIndex}
              className={`rounded-lg cursor-pointer p-1 relative transition-all duration-200 ${
                safeSelectedIndex === filteredIndex
                  ? "border-2 border-orange scale-105"
                  : "bg-secondaryLight hover:border-2 hover:border-gray-300"
              }`}
              onClick={() => {
                if (safeSelectedIndex !== filteredIndex) {
                  setSelectedImageIndex(filteredIndex);
                }
              }}
              style={{
                width: `${thumbnailDimensions.width}px`,
                height: `${thumbnailDimensions.height}px`,
              }}
            >
              {loadingImages.has(originalIndex) && (
                <div className="absolute inset-0 animate-pulse bg-gray-200 rounded-lg"></div>
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getOptimizedThumbnailUrl()}
                alt={`${product.name} view ${filteredIndex + 1}`}
                width={thumbnailDimensions.width}
                height={thumbnailDimensions.height}
                className="w-full h-full object-cover rounded"
                sizes="80px"
                loading="lazy"
                decoding="async"
                onError={() => handleImageError(originalIndex)}
                onLoad={() => handleImageLoad(originalIndex)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductImagesSlider;
