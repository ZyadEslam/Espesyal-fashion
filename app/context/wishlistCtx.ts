"use client";

import { createContext } from "react";
import { ProductCardProps } from "@/app/types/types";
import { CartContextProps } from "./cartCtx";

interface WishlistContextProps {
  wishlist: ProductCardProps[];
  addToWishlist: (product: ProductCardProps) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  moveToCart: (productId: string, cartContext: CartContextProps) => void; // Optional: integration with cart
  manualSync: () => Promise<void>;
  removeUserWishlist: () => void;
  getWishlistItemCount: () => number;
}

export const WishlistContext = createContext<WishlistContextProps | null>(null);
