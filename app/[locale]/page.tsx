import React, { Suspense } from "react";
import CategoriesLoadingSection from "../components/homeComponents/CategoriesLoadingSection";
import LoadingSpinner from "../UI/LoadingSpinner";
import HeroSection from "../components/homeComponents/HeroSection";
import CategorySection from "../components/homeComponents/CategorySection";
import SubscriptionOffer from "../components/homeComponents/SubscriptionOffer";
import {
  getActiveCategories,
  getProductsForCategories,
} from "../utils/serverApi";
import AdditionalCategorySections from "../components/homeComponents/AdditionalCategorySections";

// Add ISR revalidation
export const revalidate = 60; // Revalidate every 60 seconds

// Separate component for categories to enable streaming
async function CategoriesContent() {
  // Fetch categories server-side
  const categories = await getActiveCategories();

  // Shopify-like: render only the first few category sections on the server
  // and lazy-load the rest on the client to reduce TTFB.
  const INITIAL_SECTIONS = 3;
  const INITIAL_PRODUCTS_LIMIT = 12;

  const initialCategories = categories.slice(0, INITIAL_SECTIONS);
  const remainingCategories = categories.slice(INITIAL_SECTIONS);

  const productsMap = await getProductsForCategories(
    initialCategories,
    INITIAL_PRODUCTS_LIMIT,
  );

  if (categories.length === 0) {
    return <CategoriesLoadingSection />;
  }

  return (
    <>
      {initialCategories.map((category, idx) => {
        const products = productsMap.get(category._id) || [];
        return (
          <CategorySection
            key={category._id}
            categoryName={category.name}
            categorySlug={category.slug}
            products={products}
            isFirstCategory={idx === 0}
          />
        );
      })}

      {remainingCategories.length > 0 && (
        <AdditionalCategorySections
          categories={remainingCategories}
          productsLimit={20}
        />
      )}
    </>
  );
}

export default async function Home() {
  return (
    <main className="min-h-screen">
      {/* Black Friday Campaign Hero Section - Render immediately */}
      <section className="w-full h-[90vh]">
        <div className="w-full h-full">
          <HeroSection />
        </div>
      </section>

      {/* Category-based Product Sections - Stream separately */}
      <Suspense fallback={<CategoriesLoadingSection />}>
        <CategoriesContent />
      </Suspense>

      {/* Subscription Offer */}
      <section className="w-full ">
        <div className="">
          <Suspense fallback={<LoadingSpinner />}>
            <SubscriptionOffer />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
