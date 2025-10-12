import { assets } from "@/public/assets/assets";
import Image, { StaticImageData } from "next/image";
import React, { useCallback, useRef } from "react";

export interface ImageState {
  image1: StaticImageData;
  image2: StaticImageData;
  image3: StaticImageData;
  image4: StaticImageData;
}

interface ImageUploaderProps {
  images: ImageState;
  onImageChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    imageKey: string
  ) => void;
  onRemoveImage: (imageKey: string) => void;
}

const ImageUploaderComponent: React.FC<ImageUploaderProps> = React.memo(
  ({ images, onImageChange, onRemoveImage }) => {
    const fileInputRefs = {
      image1: useRef<HTMLInputElement>(null),
      image2: useRef<HTMLInputElement>(null),
      image3: useRef<HTMLInputElement>(null),
      image4: useRef<HTMLInputElement>(null),
    };

    const handleImageClick = useCallback(
      (inputRef: React.RefObject<HTMLInputElement | null>) => {
        inputRef.current?.click();
      },
      []
    );

    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Product Images
        </label>
        <div className="flex sm:flex-col md:flex-row gap-3">
          {Object.keys(images).map((imageKey, index) => (
            <div className="md:w-1/4 relative" key={imageKey}>
              <div className="relative">
                {images[imageKey as keyof ImageState] !==
                  assets.upload_area && (
                  <span
                    className="absolute top-0 cursor-pointer text-gray-500 bg-gray-100 right-0 px-3 py-1 rounded-md"
                    onClick={() => onRemoveImage(imageKey)}
                  >
                    X
                  </span>
                )}
                <Image
                  src={images[imageKey as keyof ImageState]}
                  alt={`Product image ${index + 1}`}
                  width={100}
                  height={100}
                  className="upload-area cursor-pointer"
                  onClick={() =>
                    handleImageClick(
                      fileInputRefs[imageKey as keyof typeof fileInputRefs]
                    )
                  }
                />
              </div>
              <input
                type="file"
                className="hidden"
                id={`p-image${index + 1}`}
                name={`image${index + 1}`}
                ref={fileInputRefs[imageKey as keyof typeof fileInputRefs]}
                onChange={(e) => onImageChange(e, imageKey)}
                accept="image/*"
              />
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Click on images to upload (max 4 images)
        </p>
      </div>
    );
  }
);

ImageUploaderComponent.displayName = "ImageUploader";

export default ImageUploaderComponent;
