"use client";
import React, { Suspense, lazy } from "react";
import LoadingSpinner from "./UI/LoadingSpinner";
import { motion } from "framer-motion";

const AdvBar = lazy(() => import("./components/homeComponents/AdvBar"));
const SubscriptionOffer = lazy(
  () => import("./components/homeComponents/SubscriptionOffer")
);
const FeaturedProductsList = lazy(
  () => import("./components/homeComponents/FeaturedProductsList")
);
const HeroSection = lazy(() => import("./components/homeComponents/HeroSection"));

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-8 md:py-12">
        <div className="container mx-auto px-8 md:px-16 lg:px-24">
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-[400px] lg:min-h-[500px]">
                <LoadingSpinner />
              </div>
            }
          >
            <HeroSection />
          </Suspense>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-8 md:py-12 bg-gray-50/50">
        <div className="container mx-auto px-8 md:px-16 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
            <p className="text-gray-600 mt-6 max-w-2xl mx-auto text-lg">
              Discover our handpicked selection of premium products designed to
              enhance your lifestyle
            </p>
          </motion.div>

          <Suspense
            fallback={
              <div className="flex justify-center">
                <LoadingSpinner />
              </div>
            }
          >
            <FeaturedProductsList />
          </Suspense>
        </div>
      </section>

      {/* Advertisement Bar */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-8 md:px-16 lg:px-24">
          <Suspense
            fallback={
              <div className="relative w-full h-[250px] sm:h-[300px] lg:h-[350px] overflow-hidden rounded-2xl bg-gradient-to-r from-secondary/20 to-primary/20">
                <div className="flex items-center justify-center h-full">
                  <LoadingSpinner
                    size="lg"
                    text="Loading Gaming Experience..."
                  />
                </div>
              </div>
            }
          >
            <AdvBar />
          </Suspense>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-8 md:py-12 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="container mx-auto px-8 md:px-16 lg:px-24">
          <Suspense
            fallback={
              <div className="text-center">
                <div className="h-6 bg-gray-300 rounded mx-auto mb-4 w-48 animate-pulse"></div>
                <div className="h-3 bg-gray-300 rounded mx-auto mb-6 w-72 animate-pulse"></div>
                <div className="h-10 bg-gray-300 rounded mx-auto w-64 animate-pulse"></div>
              </div>
            }
          >
            <SubscriptionOffer />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
