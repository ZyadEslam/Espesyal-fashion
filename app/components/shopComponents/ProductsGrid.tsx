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
      return null; // ProductsGrid doesn't handle empty state, let the parent handle it
    }

    const gridClass = {
      "2": "grid-cols-2",
      "3": "grid-cols-2 md:grid-cols-3",
      "4": "grid-cols-2 md:grid-cols-4",
      "5": "grid-cols-2 md:grid-cols-4 lg:grid-cols-5",
      "6": "grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
    }[gridCols];

    return (
      <div className={`grid ${gridClass} gap-4 sm:gap-6 ${className}`}>
        {products.map((product: ProductCardProps) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    );
  }
);

ProductsGrid.displayName = "ProductsGrid";

export default ProductsGrid;
