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
