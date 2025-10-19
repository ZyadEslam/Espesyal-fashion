"use client";
import React, { memo, useCallback } from "react";
import { CategoryProps } from "../../types/types";

interface CategoryFilterProps {
  categories: CategoryProps[];
  selectedCategory: string | null;
  onCategoryChange: (categorySlug: string | null) => void;
  className?: string;
}

const CategoryFilter = memo(
  ({
    categories,
    selectedCategory,
    onCategoryChange,
    className = "",
  }: CategoryFilterProps) => {
    const handleCategoryClick = useCallback(
      (slug: string | null) => {
        onCategoryChange(slug);
      },
      [onCategoryChange]
    );

    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        <button
          onClick={() => handleCategoryClick(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            selectedCategory === null
              ? "bg-orange text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All Products
        </button>

        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => handleCategoryClick(category.slug)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedCategory === category.slug
                ? "bg-orange text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    );
  }
);

CategoryFilter.displayName = "CategoryFilter";

export default CategoryFilter;
