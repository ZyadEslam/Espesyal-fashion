"use client";
import { ArrowLeft, Heart } from "lucide-react";
import Link from "next/link";
import React, { lazy, Suspense } from "react";
import LoadingSpinner from "../UI/LoadingSpinner";

// import { WishlistTable } from "../components";
const WishlistTable = lazy(
  () => import("../components/wishlistComponents/WishlistTable")
);

const WishListPage = () => {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-orange/10 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-orange" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Your Wishlist
              </h1>
              <p className="text-gray-600 mt-1">
                Items you&apos;ve saved for later
              </p>
            </div>
          </div>
        </div>

        {/* Wishlist Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <Suspense
            fallback={
              <div className="p-8">
                <LoadingSpinner />
              </div>
            }
          >
            <WishlistTable />
          </Suspense>
        </div>

        {/* Continue Shopping */}
        <div className="mt-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-orange hover:text-orange/80 transition-colors duration-200 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WishListPage;
