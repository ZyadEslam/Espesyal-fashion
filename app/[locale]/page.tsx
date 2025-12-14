"use client";

import React, { useEffect, useState, Suspense, lazy } from "react";
import CategoriesLoadingSection from "../components/homeComponents/CategoriesLoadingSection";
import LoadingSpinner from "../UI/LoadingSpinner";
import { cachedFetchJson, cacheStrategies } from "../utils/cachedFetch";

// Lazy load heavy components for better code splitting
const HeroSection = lazy(() => import("../components/homeComponents/HeroSection"));
const CategorySection = lazy(() => import("../components/homeComponents/CategorySection"));
const SubscriptionOffer = lazy(() => import("../components/homeComponents/SubscriptionOffer"));

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await cachedFetchJson<{
          success: boolean;
          data: (Category & { sortOrder: number; createdAt: string })[];
        }>("/api/categories?active=true", cacheStrategies.categories());

        if (data.success) {
          // Sort categories by sortOrder (priority) ascending, then by createdAt
          const sortedCategories = (data.data || []).sort(
            (
              a: Category & { sortOrder: number; createdAt: string },
              b: Category & { sortOrder: number; createdAt: string }
            ) => {
              // First sort by priority (lower numbers first)
              const priorityA = a.sortOrder ?? 0;
              const priorityB = b.sortOrder ?? 0;
              if (priorityA !== priorityB) {
                return priorityA - priorityB;
              }
              // If priorities are equal, sort by creation date
              return (
                new Date(a.createdAt || 0).getTime() -
                new Date(b.createdAt || 0).getTime()
              );
            }
          );
          setCategories(sortedCategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <main className="min-h-screen">
      {/* Black Friday Campaign Hero Section */}
      <section className="section-spacing">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <Suspense fallback={<LoadingSpinner />}>
            <HeroSection />
          </Suspense>
        </div>
      </section>

      {/* Category-based Product Sections */}
      {loading ? (
        <CategoriesLoadingSection />
      ) : (
        categories.map((category) => (
          <Suspense key={category._id} fallback={<LoadingSpinner />}>
            <CategorySection
              categoryId={category._id}
              categoryName={category.name}
              categorySlug={category.slug}
            />
          </Suspense>
        ))
      )}

      {/* Subscription Offer */}
      <section className="py-12 w-[95%] mx-auto">
        <div className="container mx-auto border border-orange/20">
          <Suspense fallback={<LoadingSpinner />}>
            <SubscriptionOffer />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
