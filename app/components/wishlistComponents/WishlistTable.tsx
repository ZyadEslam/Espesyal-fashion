"use client";
import React, { memo } from "react";
import { ProductCardProps } from "@/app/types/types";
import WishlistTableRow from "./WishlistTableRow";
import { useWishlist } from "@/app/hooks/useWishlist";

const WishlistTable = memo(() => {
  const { wishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Your wishlist is empty
        </h3>
        <p className="text-gray-600 mb-6">
          Save items you love to your wishlist and they&apos;ll appear here.
        </p>
        <a
          href="/shop"
          className="inline-flex items-center px-6 py-3 bg-orange text-white rounded-lg hover:bg-orange/90 transition-colors duration-200 font-medium"
        >
          Start Shopping
        </a>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Desktop Header */}
      <div className="hidden md:grid md:grid-cols-12 gap-6 mb-6 pb-4 border-b border-gray-200">
        <div className="col-span-6">
          <h3 className="font-semibold text-gray-700">Product Details</h3>
        </div>
        <div className="col-span-2">
          <h3 className="font-semibold text-gray-700">Price</h3>
        </div>
        <div className="col-span-4">
          <h3 className="font-semibold text-gray-700">Actions</h3>
        </div>
      </div>

      {/* Wishlist Items */}
      <div className="space-y-4">
        {wishlist.map((product: ProductCardProps) => (
          <WishlistTableRow key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
});

WishlistTable.displayName = "WishlistTable";

export default WishlistTable;
