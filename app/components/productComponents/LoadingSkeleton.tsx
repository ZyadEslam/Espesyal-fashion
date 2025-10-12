import React from "react";

// Single product skeleton component
const ProductCardSkeleton = () => {
  return (
    <div className="relative md:w-1/6 sm:w-[46%] h-[320px] animate-pulse">
      {/* Heart icon skeleton */}
      <div className="absolute top-2 right-2 z-100 w-4 h-4 bg-gray-300 rounded-full"></div>

      {/* Image skeleton */}
      <div className="relative bg-gray-200 rounded-lg mb-2 h-[180px] overflow-hidden">
        <div className="w-full h-full bg-gray-300"></div>
      </div>

      {/* Product name skeleton */}
      <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>

      {/* Description skeleton */}
      <div className="h-3 bg-gray-200 rounded mb-2 w-full"></div>
      <div className="h-3 bg-gray-200 rounded mb-3 w-2/3"></div>

      {/* Rating skeleton */}
      <div className="flex items-center gap-2 mb-2">
        <div className="h-3 bg-gray-300 rounded w-8"></div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={`skeleton-star-${index}`}
              className="w-3 h-3 bg-gray-300 rounded-full"
            />
          ))}
        </div>
      </div>

      {/* Price and buy button skeleton */}
      <div className="flex items-center justify-between mt-2">
        <div className="h-4 bg-gray-300 rounded w-16"></div>
        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
      </div>
    </div>
  );
};

// Group of product skeletons
const ProductSkeletonGroup = ({ count = 10 }: { count?: number }) => {
  return (
    <div className="flex flex-wrap gap-4 justify-between">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={`product-skeleton-${index}`} />
      ))}
    </div>
  );
};

// Alternative grid layout version
const ProductSkeletonGrid = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={`grid-skeleton-${index}`} className="w-full">
          <div className="animate-pulse">
            {/* Heart icon skeleton */}
            <div className="relative">
              <div className="absolute top-2 right-2 z-10 w-4 h-4 bg-gray-300 rounded-full"></div>

              {/* Image skeleton */}
              <div className="bg-gray-200 rounded-lg mb-2 h-[180px] w-full">
                <div className="w-full h-full bg-gray-300 rounded-lg"></div>
              </div>
            </div>

            {/* Product name skeleton */}
            <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>

            {/* Description skeleton */}
            <div className="h-3 bg-gray-200 rounded mb-1 w-full"></div>
            <div className="h-3 bg-gray-200 rounded mb-3 w-2/3"></div>

            {/* Rating skeleton */}
            <div className="flex items-center gap-2 mb-2">
              <div className="h-3 bg-gray-300 rounded w-8"></div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <div
                    key={`skeleton-star-${starIndex}`}
                    className="w-3 h-3 bg-gray-300 rounded-full"
                  />
                ))}
              </div>
            </div>

            {/* Price and buy button skeleton */}
            <div className="flex items-center justify-between mt-2">
              <div className="h-4 bg-gray-300 rounded w-16"></div>
              <div className="h-6 bg-gray-200 rounded-full w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export { ProductCardSkeleton, ProductSkeletonGroup, ProductSkeletonGrid };
