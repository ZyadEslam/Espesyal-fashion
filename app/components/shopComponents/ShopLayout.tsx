"use client";
import React, { memo, useState, useCallback, Suspense, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  useCategories,
  useProductsByCategory,
} from "../../hooks/useCategories";
import { useShopProducts } from "../../hooks/useShopProducts";
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
    const t = useTranslations("shop");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
      initialCategory || null
    );
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState<{
      sortBy: string;
      sortOrder: string;
      minPrice?: number;
      maxPrice?: number;
      brand?: string;
    }>({
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

    // Get prefetched data from context
    const {
      initialProducts,
      initialPagination,
      initialFilters,
      setCurrentProducts,
      setCurrentPagination,
      setCurrentFilters,
    } = useShopProducts();

    // Check if we need to fetch (if filters changed from initial state)
    const needsFetch =
      currentPage !== 1 ||
      filters.minPrice !== undefined ||
      filters.maxPrice !== undefined ||
      filters.brand !== undefined ||
      filters.sortBy !== "createdAt" ||
      filters.sortOrder !== "desc" ||
      selectedCategory !== initialCategory;

    // Use conditional fetching hook
    const {
      products: fetchedProducts,
      isLoading: isFetching,
      error: fetchError,
      pagination: fetchedPagination,
      filters: fetchedFilters,
    } = useProductsByCategory({
      categorySlug: selectedCategory || undefined,
      page: currentPage,
      limit: 12,
      ...filters,
      enabled: needsFetch,
    });

    // Update context state when we fetch new data
    useEffect(() => {
      if (needsFetch && !isFetching && fetchedProducts.length > 0) {
        setCurrentProducts(fetchedProducts);
        setCurrentPagination(fetchedPagination);
        setCurrentFilters(fetchedFilters);
      }
    }, [
      needsFetch,
      isFetching,
      fetchedProducts,
      fetchedPagination,
      fetchedFilters,
      setCurrentProducts,
      setCurrentPagination,
      setCurrentFilters,
    ]);

    const products = needsFetch ? fetchedProducts : initialProducts;
    const pagination = needsFetch ? fetchedPagination : initialPagination;
    const availableFilters = initialFilters;
    const productsLoading = needsFetch ? isFetching : false;
    const error = needsFetch ? fetchError : null;

    const handleCategoryChange = useCallback((categorySlug: string | null) => {
      setSelectedCategory(categorySlug);
      setCurrentPage(1);
    }, []);

    const handleFiltersChange = useCallback(
      (newFilters: {
        sortBy: string;
        sortOrder: string;
        minPrice?: number;
        maxPrice?: number;
        brand?: string;
      }) => {
        setFilters(newFilters);
        setCurrentPage(1);
      },
      []
    );

    const handlePageChange = useCallback((page: number) => {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    if (categoriesLoading) {
      return <ProductSkeletonGroup />;
    }

    return (
      <div className={`max-w-7xl mx-auto ${className}`}>
        {/* Featured Categories */}
        {featuredCategories.length > 0 && (
          <section className="mb-12">
            <CategorySection
              categories={featuredCategories}
              title={t("featuredCollections")}
            />
          </section>
        )}

        {/* Category Tabs */}
        <section className="mb-8">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </section>

        {/* Main Content Area */}
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar Filters */}
          <aside className="col-span-12 lg:col-span-3">
            <div className="lg:sticky lg:top-24 space-y-6 bg-white rounded-lg p-6 shadow-sm">
              <ProductFilters
                brands={availableFilters.brands}
                onFiltersChange={handleFiltersChange}
              />
            </div>
          </aside>

          {/* Products Section */}
          <main className="col-span-12 lg:col-span-9">
            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {selectedCategory
                    ? categories.find((c) => c.slug === selectedCategory)
                        ?.name || t("title")
                    : t("allProducts")}
                </h1>
                <p className="text-gray-500 mt-1.5">
                  {pagination.totalProducts} {t("productCount")}
                </p>
              </div>
            </div>

            {/* Products Grid */}
            <Suspense fallback={<ProductSkeletonGroup />}>
              {products.length === 0 && !productsLoading ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg mb-2">
                    {t("noProducts")}
                  </div>
                  <p className="text-gray-500">{t("tryAdjusting")}</p>
                </div>
              ) : (
                <ProductsGrid
                  products={products}
                  isLoading={productsLoading}
                  error={error}
                  gridCols="4"
                />
              )}
            </Suspense>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    );
  }
);

ShopLayout.displayName = "ShopLayout";

export default ShopLayout;
