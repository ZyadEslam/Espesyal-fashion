"use client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React, { lazy, Suspense } from "react";
import LoadingSpinner from "../UI/LoadingSpinner";

// import { WishlistTable } from "../components";
const WishlistTable = lazy(
  () => import("../components/wishlistComponents/WishlistTable")
);

const WishListPage = () => {
  return (
    <>
      <div className="md:px-[8.5%] sm:px-[5%] py-6">
        <div className="border-b border-gray-300 pb-6 mb-6 flex justify-between items-center">
          <h1 className="text-3xl">
            <span className="text-gray-500">Your</span>{" "}
            <span className="text-orange">Wishlist</span>
          </h1>
          {/* <p className="text-xl text-gray-400">{wishlist.length} Items</p> */}
        </div>
        <Suspense fallback={<LoadingSpinner />}>
          <WishlistTable />
        </Suspense>
        <Link href={"../"} className="flex gap-2 text-orange mt-6">
          <ArrowLeft /> Continue Shopping{" "}
        </Link>
      </div>
    </>
  );
};

export default WishListPage;
