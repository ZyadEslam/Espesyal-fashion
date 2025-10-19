"use client";
import React, { memo, useState, useCallback, Suspense } from "react";
import {
  useCategories,
  useProductsByCategory,
} from "../../hooks/useCategories";
import CategoryFilter from "./CategoryFilter";
import ProductFilters from "./ProductFilters";
import ProductsGrid from "./ProductsGrid";
import CategorySection from "./CategorySection";
import Pagination from "./Pagination";
import { ProductSkeletonGroup } from "../productComponents/LoadingSkeleton";

interface ShopLayoutProps {
  initialCategory?: string;
  className?: string;
}

const ShopLayout = memo(
  ({ initialCategory, className = "" }: ShopLayoutProps) => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
      initialCategory || null
    );
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
      sortBy: "createdAt",
      sortOrder: "desc",
      minPrice: undefined,
      maxPrice: undefined,
      brand: undefined,
    });

    const {
      categories,
      featuredCategories,
      isLoading: categoriesLoading,
    } = useCategories();

    const {
      products,
      isLoading: productsLoading,
      error,
      pagination,
      filters: availableFilters,
    } = useProductsByCategory({
      categorySlug: selectedCategory || undefined,
      page: currentPage,
      limit: 12,
      ...filters,
    });

    const handleCategoryChange = useCallback((categorySlug: string | null) => {
      setSelectedCategory(categorySlug);
      setCurrentPage(1); // Reset to first page when changing category
    }, []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleFiltersChange = useCallback((newFilters: any) => {
      setFilters(newFilters);
      setCurrentPage(1); // Reset to first page when changing filters
    }, []);

    const handlePageChange = useCallback((page: number) => {
      setCurrentPage(page);
      // Scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    if (categoriesLoading) {
      return <ProductSkeletonGroup />;
    }

    return (
      <div className={`space-y-8 ${className}`}>
        {/* Featured Categories Section */}
        {featuredCategories.length > 0 && (
          <CategorySection
            categories={featuredCategories}
            title="Featured Collections"
          />
        )}

        {/* Category Filter */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Browse Categories
          </h3>
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {/* Filters and Products */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <ProductFilters
              brands={availableFilters.brands}
              onFiltersChange={handleFiltersChange}
            />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {selectedCategory
                  ? categories.find((c) => c.slug === selectedCategory)?.name ||
                    "Products"
                  : "All Products"}
              </h2>
              <p className="text-gray-600">
                {pagination.totalProducts} products found
              </p>
            </div>

            <Suspense fallback={<ProductSkeletonGroup />}>
              <ProductsGrid
                products={products}
                isLoading={productsLoading}
                error={error}
                gridCols="4"
              />
            </Suspense>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

ShopLayout.displayName = "ShopLayout";

export default ShopLayout;
