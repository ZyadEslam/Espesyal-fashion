"use client";

import { useState, useMemo, useEffect } from "react";
import { ProductCardProps } from "@/app/types/types";
import { useSession } from "next-auth/react";
import { WishlistContext } from "@/app/context/wishlistCtx";
import { CartContextProps } from "@/app/context/cartCtx";
import { api } from "@/app/utils/api";
import { uniqueListItems } from "@/app/utils/utilFunctions";

interface WishlistProviderProps {
  children: React.ReactNode;
}

// Storage keys
const getWishlistStorageKey = (userId?: string) => {
  return userId ? `wishlist-${userId}` : "wishlist-anonymous";
};

const WishlistProvider = ({ children }: WishlistProviderProps) => {
  const { data: session } = useSession();
  const [wishlist, setWishlist] = useState<ProductCardProps[]>([]);

  // Initialize wishlist from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const storageKey = getWishlistStorageKey(session?.user?.id);
      const storedWishlist = localStorage.getItem(storageKey);

      if (storedWishlist) {
        setWishlist(JSON.parse(storedWishlist));
      }
    } catch (error) {
      console.error("Error loading wishlist from localStorage:", error);
    }
  }, [session?.user?.id]); // Re-initialize when user changes

  // Save to localStorage whenever wishlist or user changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const storageKey = getWishlistStorageKey(session?.user?.id);
      localStorage.setItem(storageKey, JSON.stringify(wishlist));
    } catch (error) {
      console.error("Error saving wishlist to localStorage:", error);
    }
  }, [wishlist, session?.user?.id]);

  const manualSync = async () => {
    if (session?.user?.id) {
      try {
        const storageKey = getWishlistStorageKey(session.user.id);
        const storedWishlist = localStorage.getItem(storageKey);
        const localWishlist = storedWishlist ? JSON.parse(storedWishlist) : [];
        await api.mergeWishlist(localWishlist, session.user.id);
      } catch (error) {
        console.error("Error syncing wishlist with server:", error);
      }
    }
  };

  // Add product to wishlist
  const addToWishlist = (product: ProductCardProps) => {
    setWishlist((prevWishlist) => {
      // Check if product already exists
      const exists = prevWishlist.some((item) => item._id === product._id);
      if (exists) {
        return prevWishlist; // Don't add duplicates
      }
      return [...prevWishlist, product];
    });
  };

  // Remove product from wishlist
  const removeFromWishlist = (productId: string) => {
    setWishlist((prevWishlist) =>
      prevWishlist.filter((item) => item._id !== productId)
    );
  };

  // Check if product is in wishlist
  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item._id === productId);
  };

  // Clear entire wishlist
  const clearWishlist = () => {
    setWishlist([]);
  };

  const removeUserWishlist = () => {
    if (typeof window === "undefined") return;
    if (session?.user?.id) {
      const storageKey = getWishlistStorageKey(session.user.id);
      localStorage.removeItem(storageKey);
      setWishlist([]);
    }
  };

  // Move product from wishlist to cart (optional integration)
  const moveToCart = (productId: string, cartContext: CartContextProps) => {
    const product = wishlist.find((item) => item._id === productId);
    if (product && cartContext?.addToCart) {
      cartContext.addToCart(product);
      removeFromWishlist(productId);
    }
  };
  const getWishlistItemCount = () => {
    return wishlist.reduce(
      (total, item) => total + (item.quantityInCart || 1),
      0
    );
  };

  // Migrate anonymous wishlist to user wishlist when user logs in
  useEffect(() => {
    const syncWishlistWithServer = async () => {
      console.log("Entered First useEffect");

      if (session?.user?.id && typeof window !== "undefined") {
        try {
          console.log("Entered Try");
          const anonymousKey = getWishlistStorageKey();
          const userKey = getWishlistStorageKey(session.user.id);

          const anonymousWishlist = localStorage.getItem(anonymousKey);
          const userWishlist = localStorage.getItem(userKey);
          const { wishlist: serverWishlist } = await api.getWishlist(
            session?.user?.id as string
          );
          console.log("Server Wishlist: ", serverWishlist);

          if (anonymousWishlist && !userWishlist) {
            // Migrate anonymous wishlist to user
            if (serverWishlist.length > 0) {
              const uniqueItems = uniqueListItems([
                ...serverWishlist,
                ...JSON.parse(anonymousWishlist),
              ]);
              setWishlist(uniqueItems);

              localStorage.setItem(userKey, JSON.stringify(uniqueItems));
              localStorage.removeItem(anonymousKey);
            } else {
              setWishlist(JSON.parse(anonymousWishlist));
              localStorage.setItem(userKey, anonymousWishlist);
              localStorage.removeItem(anonymousKey);
            }
          } else if (userWishlist) {
            // Load user's existing wishlist
            setWishlist(
              uniqueListItems([...serverWishlist, ...JSON.parse(userWishlist)])
            );
          }
        } catch (error) {
          console.error("Error migrating wishlist:", error);
        }
      }
    };
    syncWishlistWithServer();
  }, []);

  const contextValue = useMemo(
    () => ({
      wishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist,
      moveToCart,
      manualSync,
      removeUserWishlist,
      getWishlistItemCount,
    }),
    [wishlist]
  );

  return (
    <WishlistContext.Provider value={contextValue}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistProvider;
