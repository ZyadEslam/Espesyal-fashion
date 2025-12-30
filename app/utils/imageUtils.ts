export const bufferToBase64 = (
  buffer: Buffer | Uint8Array | null | undefined
): string | null => {
  if (!buffer) return null;
  return `data:image/jpeg;base64,${Buffer.from(buffer).toString("base64")}`;
};

interface ProductWithImages {
  imgSrc?: (Buffer | Uint8Array | null | undefined)[];
}

export const getProductImages = (
  product: ProductWithImages | null | undefined
): string[] => {
  if (!product?.imgSrc) return [];
  return product.imgSrc
    .map(bufferToBase64)
    .filter((img): img is string => Boolean(img));
};

/**
 * Generate optimized image URL with size parameters
 * @param productId - Product ID
 * @param index - Image index (default: 0)
 * @param width - Desired width in pixels
 * @param height - Desired height in pixels (optional, maintains aspect ratio if not provided)
 * @param quality - Image quality 1-100 (default: 85)
 * @returns Optimized image URL
 */
export const getOptimizedImageUrl = (
  productId: string,
  index: number = 0,
  width?: number,
  height?: number,
  quality: number = 85
): string => {
  const baseUrl = `/api/product/image/${productId}?index=${index}`;
  const params = new URLSearchParams();

  if (width) params.append("w", width.toString());
  if (height) params.append("h", height.toString());
  if (quality !== 85) params.append("q", quality.toString());

  const queryString = params.toString();
  return queryString ? `${baseUrl}&${queryString}` : baseUrl;
};

/**
 * Generate srcset for responsive images
 * Sizes are optimized for both 1x displays AND retina displays (2x, 3x DPR)
 * @param productId - Product ID
 * @param index - Image index (default: 0)
 * @param sizes - Array of widths to generate
 * @returns srcset string
 */
export const getImageSrcSet = (
  productId: string,
  index: number = 0,
  sizes: number[] = [320, 480, 640, 800] // Optimized for product cards including retina displays
): string => {
  return sizes
    .map((width) => {
      const url = getOptimizedImageUrl(productId, index, width, width, 80); // Use optimized quality
      return `${url} ${width}w`;
    })
    .join(", ");
};

/**
 * Check if an image should be treated as LCP (Largest Contentful Paint) candidate
 * @param index - Image index in the list
 * @param maxLCPCandidates - Maximum number of LCP candidates (default: 1)
 * @returns true if image should be prioritized for LCP
 */
export const isLCPImage = (
  index: number,
  maxLCPCandidates: number = 1
): boolean => {
  return index < maxLCPCandidates;
};

/**
 * Get appropriate image sizes attribute for responsive images
 * @param context - Context where image is displayed
 * @returns sizes attribute string
 */
export const getImageSizes = (
  context:
    | "product-card"
    | "product-detail"
    | "thumbnail"
    | "hero" = "product-card"
): string => {
  switch (context) {
    case "product-card":
      return "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw";
    case "product-detail":
      return "(max-width: 768px) 100vw, 33vw";
    case "thumbnail":
      return "80px";
    case "hero":
      return "100vw";
    default:
      return "(max-width: 640px) 100vw, 50vw";
  }
};

/**
 * Get recommended image dimensions based on context
 * @param context - Context where image is displayed
 * @returns Object with width and height
 */
export const getImageDimensions = (
  context:
    | "product-card"
    | "product-detail"
    | "thumbnail"
    | "hero" = "product-card"
): { width: number; height: number } => {
  switch (context) {
    case "product-card":
      // Match actual display size: mobile ~260px, sm+ ~320px
      return { width: 320, height: 320 };
    case "product-detail":
      return { width: 800, height: 800 };
    case "thumbnail":
      return { width: 80, height: 80 };
    case "hero":
      return { width: 1920, height: 1080 };
    default:
      return { width: 320, height: 320 };
  }
};
