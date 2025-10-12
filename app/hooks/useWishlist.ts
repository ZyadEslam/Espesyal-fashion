"use client";

import { useContext } from "react";
import { WishlistContext } from "../context/wishlistCtx";

export const useWishlist = () => {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }

  return context;
};
