"use client";

import React from "react";
import HeroSection from "./components/homeComponents/HeroSection";
import BestSellersSection from "./components/homeComponents/BestSellersSection";
import NewCollectionsSection from "./components/homeComponents/NewCollectionsSection";
import FeaturedProductsList from "./components/homeComponents/FeaturedProductsList";
import SubscriptionOffer from "./components/homeComponents/SubscriptionOffer";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Enhanced Hero Section with Promotional Offers */}
      <section className="py-6 md:py-8">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <HeroSection />
        </div>
      </section>

      {/* Best Sellers Section */}
      <BestSellersSection />

      {/* New Collections Section */}
      <NewCollectionsSection />

      {/* Featured Products */}
      <section className="py-12 bg-gradient-to-br from-secondaryLight to-background">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
              ⭐ FEATURED PRODUCTS
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Handpicked <span className="text-primary">Selections</span>
            </h2>
            <p className="text-foreground/70 text-base max-w-2xl mx-auto">
              Discover our carefully curated selection of premium products
              designed to enhance your lifestyle
            </p>
          </div>
          <FeaturedProductsList />
        </div>
      </section>

      {/* Subscription Offer */}
      <section className="py-12 w-[95%]  mx-auto">
        <div className="container mx-auto rounded-2xl px-4 md:px-6 lg:px-8 shadow-2xl border border-orange/20">
          <SubscriptionOffer />
        </div>
      </section>
    </main>
  );
}
