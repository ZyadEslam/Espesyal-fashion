"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { CategoryProps, ProductCardProps } from "../types/types";

interface UseCategoriesReturn {
  categories: CategoryProps[];
  featuredCategories: CategoryProps[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useCategories = (): UseCategoriesReturn => {
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        "/api/categories?includeProducts=true&active=true"
      );
      const data = await response.json();

      if (data.success) {
        setCategories(data.data);
      } else {
        setError(data.message || "Failed to fetch categories");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const featuredCategories = useMemo(() => {
    return categories.filter((category) => category.isFeatured);
  }, [categories]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    featuredCategories,
    isLoading,
    error,
    refetch: fetchCategories,
  };
};

interface UseProductsByCategoryReturn {
  products: ProductCardProps[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters: {
    brands: string[];
    priceRange: {
      min?: number;
      max?: number;
    };
  };
  refetch: () => Promise<void>;
}

interface UseProductsByCategoryProps {
  categorySlug?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
}

export const useProductsByCategory = ({
  categorySlug,
  page = 1,
  limit = 12,
  sortBy = "createdAt",
  sortOrder = "desc",
  minPrice,
  maxPrice,
  brand,
}: UseProductsByCategoryProps): UseProductsByCategoryReturn => {
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [filters, setFilters] = useState({
    brands: [],
    priceRange: { min: undefined, max: undefined },
  });

  const fetchProducts = useCallback(async () => {
    // Use "all" for no category, otherwise use the provided slug
    const slug = categorySlug || "all";

    try {
      setIsLoading(true);
      setError(null);

      const searchParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
      });

      if (minPrice !== undefined)
        searchParams.append("minPrice", minPrice.toString());
      if (maxPrice !== undefined)
        searchParams.append("maxPrice", maxPrice.toString());
      if (brand) searchParams.append("brand", brand);

      const response = await fetch(`/api/categories/${slug}?${searchParams}`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.data.products);
        setPagination(data.data.pagination);
        setFilters(data.data.filters);
      } else {
        setError(data.message || "Failed to fetch products");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [categorySlug, page, limit, sortBy, sortOrder, minPrice, maxPrice, brand]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    isLoading,
    error,
    pagination,
    filters,
    refetch: fetchProducts,
  };
};
