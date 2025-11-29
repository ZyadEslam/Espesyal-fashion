"use client";

import React, { useEffect, useState } from "react";
import HeroSection from "../components/homeComponents/HeroSection";
import CategorySection from "../components/homeComponents/CategorySection";
import SubscriptionOffer from "../components/homeComponents/SubscriptionOffer";
import CategoriesLoadingSection from "../components/homeComponents/CategoriesLoadingSection";
import { cachedFetchJson, cacheStrategies } from "../utils/cachedFetch";

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
          <HeroSection />
        </div>
      </section>

      {/* Category-based Product Sections */}
      {loading ? (
        <CategoriesLoadingSection />
      ) : (
        categories.map((category) => (
          <CategorySection
            key={category._id}
            categoryId={category._id}
            categoryName={category.name}
            categorySlug={category.slug}
          />
        ))
      )}

      {/* Subscription Offer */}
      <section className="py-12 w-[95%] mx-auto">
        <div className="container mx-auto border border-orange/20">
          <SubscriptionOffer />
        </div>
      </section>
    </main>
  );
}
