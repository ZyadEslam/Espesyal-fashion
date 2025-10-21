"use client";

import React from "react";
import AdvBar from "./components/homeComponents/AdvBar";
import HeroSection from "./components/homeComponents/HeroSection";
import FeaturedProductsList from "./components/homeComponents/FeaturedProductsList";
import SubscriptionOffer from "./components/homeComponents/SubscriptionOffer";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Advertisement Banner */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-8 md:px-16 lg:px-24">
          <AdvBar />
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-8 md:px-16 lg:px-24">
          <HeroSection />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-8 md:py-12 bg-gray-50/50">
        <div className="container mx-auto px-8 md:px-16 lg:px-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of premium products designed to
              enhance your lifestyle
            </p>
          </div>
          <FeaturedProductsList />
        </div>
      </section>

      {/* Subscription Offer */}
      <section className="py-8 md:py-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="container mx-auto px-8 md:px-16 lg:px-24">
          <SubscriptionOffer />
        </div>
      </section>
    </main>
  );
}
