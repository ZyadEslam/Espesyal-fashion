"use client";
import React, { memo } from "react";
import ProductCard from "../productComponents/ProductCard";
import { ProductCardProps } from "../../types/types";
import { ProductSkeletonGroup } from "../productComponents/LoadingSkeleton";
import ErrorBox from "../../UI/ErrorBox";

interface ProductsGridProps {
  products: ProductCardProps[];
  isLoading: boolean;
  error: string | null;
  className?: string;
  gridCols?: "2" | "3" | "4" | "5" | "6";
}

const ProductsGrid = memo(
  ({
    products,
    isLoading,
    error,
    className = "",
    gridCols = "6",
  }: ProductsGridProps) => {
    if (isLoading) {
      return <ProductSkeletonGroup />;
    }

    if (error) {
      return <ErrorBox errorMessage={`Error loading products: ${error}`} />;
    }

    if (!products || products.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No products found</div>
          <p className="text-gray-500">
            Try adjusting your filters or browse other categories
          </p>
        </div>
      );
    }

    const gridClass = {
      "2": "grid-cols-2",
      "3": "grid-cols-2 md:grid-cols-3",
      "4": "grid-cols-2 md:grid-cols-4",
      "5": "grid-cols-2 md:grid-cols-4 lg:grid-cols-5",
      "6": "grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
    }[gridCols];

    return (
      <div className={`grid ${gridClass} gap-3 md:gap-6 ${className}`}>
        {products.map((product: ProductCardProps) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    );
  }
);

ProductsGrid.displayName = "ProductsGrid";

export default ProductsGrid;
