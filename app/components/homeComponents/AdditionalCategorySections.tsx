"use client";

import React, { useEffect, useMemo, useState } from "react";
import CategorySection from "./CategorySection";
import type { ProductCardProps } from "../../types/types";

type HomeCategory = {
  _id: string;
  name: string;
  slug: string;
};

interface AdditionalCategorySectionsProps {
  categories: HomeCategory[];
  // Uses the same product limit as the carousel on the category page.
  productsLimit: number;
}

function CategorySectionSkeleton({ categoryName }: { categoryName: string }) {
  return (
    <section className="section-spacing" aria-label={`${categoryName} loading`}>
      <div className="layout-shell">
        <div className="mb-8">
          <div className="h-8 w-56 bg-gray-200 animate-pulse rounded" />
        </div>

        <div className="relative">
          <div className="overflow-hidden pb-4">
            <div className="flex gap-6 overflow-hidden">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-64 h-80 bg-gray-200 animate-pulse rounded-2xl"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function AdditionalCategorySections({
  categories,
  productsLimit,
}: AdditionalCategorySectionsProps) {
  const [productsByCategoryId, setProductsByCategoryId] = useState<
    Record<string, ProductCardProps[]>
  >({});

  const remainingCategories = useMemo(() => categories ?? [], [categories]);

  useEffect(() => {
    if (remainingCategories.length === 0) return;

    let cancelled = false;

    const fetchProductsForCategory = async (
      category: HomeCategory
    ): Promise<ProductCardProps[]> => {
      try {
        const res = await fetch(
          `/api/categories/${encodeURIComponent(
            category.slug
          )}/products?limit=${productsLimit}`,
          { cache: "force-cache" }
        );

        if (!res.ok) return [];

        const json = await res.json();
        if (json?.success && Array.isArray(json?.data)) {
          return json.data as ProductCardProps[];
        }
        return [];
      } catch {
        return [];
      }
    };

    // Defer network work so the initial load stays snappy.
    type RequestIdleCallback = (
      callback: () => void,
      options?: { timeout?: number }
    ) => number;

    const requestIdleCallback = (window as {
      requestIdleCallback?: RequestIdleCallback;
    }).requestIdleCallback;

    const schedule = requestIdleCallback
      ? (fn: () => void) =>
          requestIdleCallback(fn, { timeout: 2500 })
      : (fn: () => void) => window.setTimeout(fn, 0);

    schedule(() => {
      (async () => {
        const BATCH_SIZE = 2;
        for (let i = 0; i < remainingCategories.length; i += BATCH_SIZE) {
          if (cancelled) return;

          const batch = remainingCategories.slice(i, i + BATCH_SIZE);
          const entries = await Promise.all(
            batch.map(async (category) => {
              const products = await fetchProductsForCategory(category);
              return [category._id, products] as const;
            })
          );

          if (cancelled) return;
          setProductsByCategoryId((prev) => {
            const next = { ...prev };
            for (const [categoryId, products] of entries) {
              next[categoryId] = products;
            }
            return next;
          });
        }
      })();
    });

    return () => {
      cancelled = true;
    };
  }, [remainingCategories, productsLimit]);

  return (
    <>
      {remainingCategories.map((category) => {
        const isLoaded = Object.prototype.hasOwnProperty.call(
          productsByCategoryId,
          category._id
        );
        const products = productsByCategoryId[category._id] || [];

        if (!isLoaded) {
          return <CategorySectionSkeleton key={category._id} categoryName={category.name} />;
        }

        return (
          <CategorySection
            key={category._id}
            categoryName={category.name}
            categorySlug={category.slug}
            products={products}
            isFirstCategory={false}
          />
        );
      })}
    </>
  );
}

