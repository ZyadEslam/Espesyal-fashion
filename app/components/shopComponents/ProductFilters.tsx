"use client";
import React, { memo, useCallback, useState } from "react";
import { useTranslations } from "next-intl";

interface FilterOptions {
  sortBy: string;
  sortOrder: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
}

interface ProductFiltersProps {
  brands: string[];
  onFiltersChange: (filters: FilterOptions) => void;
  className?: string;
}

const ProductFilters = memo(
  ({ brands, onFiltersChange, className = "" }: ProductFiltersProps) => {
    const t = useTranslations("common");
    const [filters, setFilters] = useState<FilterOptions>({
      sortBy: "createdAt",
      sortOrder: "desc",
    });

    const handleFilterChange = useCallback(
      (newFilters: Partial<FilterOptions>) => {
        const updatedFilters = { ...filters, ...newFilters };
        setFilters(updatedFilters);
        onFiltersChange(updatedFilters);
      },
      [filters, onFiltersChange]
    );

    const clearFilters = useCallback(() => {
      const clearedFilters = {
        sortBy: "createdAt",
        sortOrder: "desc",
      };
      setFilters(clearedFilters);
      onFiltersChange(clearedFilters);
    }, [onFiltersChange]);

    const hasActiveFilters =
      filters.minPrice !== undefined ||
      filters.maxPrice !== undefined ||
      filters.brand !== undefined;

    return (
      <div className={`${className}`}>
        <h2 className="text-lg font-bold text-gray-900 mb-4">{t("filter")}</h2>

        <div className="space-y-4">
          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("sortBy")}
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange focus:border-orange bg-white"
            >
              <option value="createdAt">{t("newestFirst")}</option>
              <option value="price">{t("price")}</option>
              <option value="rating">{t("rating")}</option>
              <option value="name">{t("nameAZ")}</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("order")}
            </label>
            <select
              value={filters.sortOrder}
              onChange={(e) =>
                handleFilterChange({ sortOrder: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange focus:border-orange bg-white"
            >
              <option value="desc">{t("highToLow")}</option>
              <option value="asc">{t("lowToHigh")}</option>
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("priceRange")}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder={t("minPrice")}
                value={filters.minPrice || ""}
                onChange={(e) =>
                  handleFilterChange({
                    minPrice: e.target.value
                      ? parseFloat(e.target.value)
                      : undefined,
                  })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange focus:border-orange"
              />
              <input
                type="number"
                placeholder={t("maxPrice")}
                value={filters.maxPrice || ""}
                onChange={(e) =>
                  handleFilterChange({
                    maxPrice: e.target.value
                      ? parseFloat(e.target.value)
                      : undefined,
                  })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange focus:border-orange"
              />
            </div>
          </div>

          {/* Brand Filter */}
          {brands.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("brand")}
              </label>
              <select
                value={filters.brand || ""}
                onChange={(e) =>
                  handleFilterChange({
                    brand: e.target.value || undefined,
                  })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange focus:border-orange bg-white"
              >
                <option value="">{t("allBrands")}</option>
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-md transition-colors"
            >
              {t("clearAll")}
            </button>
          )}
        </div>
      </div>
    );
  }
);

ProductFilters.displayName = "ProductFilters";

export default ProductFilters;
