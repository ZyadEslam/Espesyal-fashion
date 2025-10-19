"use client";
import React, { memo, useCallback, useState } from "react";

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
    const [filters, setFilters] = useState<FilterOptions>({
      sortBy: "createdAt",
      sortOrder: "desc",
    });

    const [isExpanded, setIsExpanded] = useState(false);

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

    return (
      <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-orange hover:text-orange-600 transition-colors"
            >
              {isExpanded ? "Hide" : "Show"} Filters
            </button>
          </div>

          {isExpanded && (
            <div className="space-y-4">
              {/* Sort Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      handleFilterChange({ sortBy: e.target.value })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange"
                  >
                    <option value="createdAt">Date Added</option>
                    <option value="price">Price</option>
                    <option value="rating">Rating</option>
                    <option value="name">Name</option>
                  </select>
                  <select
                    value={filters.sortOrder}
                    onChange={(e) =>
                      handleFilterChange({ sortOrder: e.target.value })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange"
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min Price"
                    value={filters.minPrice || ""}
                    onChange={(e) =>
                      handleFilterChange({
                        minPrice: e.target.value
                          ? parseFloat(e.target.value)
                          : undefined,
                      })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange"
                  />
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={filters.maxPrice || ""}
                    onChange={(e) =>
                      handleFilterChange({
                        maxPrice: e.target.value
                          ? parseFloat(e.target.value)
                          : undefined,
                      })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange"
                  />
                </div>
              </div>

              {/* Brand Filter */}
              {brands.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand
                  </label>
                  <select
                    value={filters.brand || ""}
                    onChange={(e) =>
                      handleFilterChange({
                        brand: e.target.value || undefined,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange"
                  >
                    <option value="">All Brands</option>
                    {brands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
);

ProductFilters.displayName = "ProductFilters";

export default ProductFilters;
