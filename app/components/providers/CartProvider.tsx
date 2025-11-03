"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { ProductCardProps } from "@/app/types/types";
import { CartContext } from "../../context/cartCtx";
import { useSession } from "next-auth/react"; // If using NextAuth
import { api } from "@/app/utils/api";
import { uniqueListItems } from "@/app/utils/utilFunctions";

interface CartProviderProps {
  children: React.ReactNode;
}

// Storage keys
const getCartStorageKey = (userId?: string) => {
  return userId ? `cart-${userId}` : "cart-anonymous";
};

const CartProvider = ({ children }: CartProviderProps) => {
  const { data: session } = useSession();
  const [cart, setCart] = useState<ProductCardProps[]>([]);
  const [error, setError] = useState<string>("");
  const [totalPrice, setTotalPrice] = useState(0);

  // Initialize cart from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const storageKey = getCartStorageKey(session?.user?.id);
      const storedCart = localStorage.getItem(storageKey);

      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
    }
  }, [session?.user?.id]);

  // Save to localStorage whenever cart or user changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const storageKey = getCartStorageKey(session?.user?.id);
      localStorage.setItem(storageKey, JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cart, session?.user?.id]);

  //This occurs when a user navigates away from a page, closes a tab, or refreshes the browser.
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (session?.user?.id && cart.length > 0) {
        // Use navigator.sendBeacon for reliable sync during page unload
        const data = JSON.stringify({ cart });
        navigator.sendBeacon("/api/cart", data);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [cart, session?.user?.id]);

  // Calculate totals
  const calculateTotals = useCallback(() => {
    const total = cart.reduce((sum, item) => {
      return sum + item.price * (item.quantityInCart || 1);
    }, 0);
    setTotalPrice(Number(total.toFixed(2)));
  }, [cart]);

  useEffect(() => {
    calculateTotals();
  }, [calculateTotals]);

  // Manual sync function (call this on signout)
  const manualSync = useCallback(async () => {
    if (session?.user?.id) {
      try {
        const storageKey = getCartStorageKey(session.user.id);
        const storedCart = localStorage.getItem(storageKey);
        const localCart = storedCart ? JSON.parse(storedCart) : [];
        await api.mergeCart(localCart, session.user.id);
      } catch (error) {
        console.error("Error syncing cart with server:", error);
      }
    }
  }, [session?.user?.id]);
  // Add to cart
  const addToCart = (product: ProductCardProps) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);

      if (existingItem) {
        return prevCart.map((item) =>
          item._id === product._id
            ? {
                ...item,
                quantityInCart: (item.quantityInCart || 1) + 1,
              }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantityInCart: 1 }];
      }
    });
  };

  // Remove from cart
  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
  }, []);

  // Update quantity
  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === productId ? { ...item, quantityInCart: quantity } : item
      )
    );
  }, []);

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  const removeUserCart = useCallback(() => {
    if (typeof window === "undefined") return;
    if (session?.user?.id) {
      const storageKey = getCartStorageKey(session.user.id);
      localStorage.removeItem(storageKey);
      setCart([]);
    }
  }, [session?.user?.id]);

  // Get cart item count
  const getCartItemCount = useCallback(() => {
    return cart.reduce((total, item) => total + (item.quantityInCart || 1), 0);
  }, [cart]);

  // Check if product is in cart
  const isInCart = useCallback((productId: string) => {
    return cart.some((item) => item._id === productId);
  }, [cart]);

  // Sync with server database on component mount
  useEffect(() => {
    const syncCartWithServer = async () => {
      if (session?.user?.id && typeof window !== "undefined") {
        try {
          const anonymousKey = getCartStorageKey();
          const userKey = getCartStorageKey(session.user.id);

          const anonymousCart = localStorage.getItem(anonymousKey);
          const userCart = localStorage.getItem(userKey);
          const { cart: serverCart } = await api.getCart(
            session?.user?.id as string
          );
          console.log("Server Cart: ", serverCart);
          if (anonymousCart && !userCart) {
            if (serverCart.length > 0) {
              const uniqueItems = uniqueListItems([
                ...serverCart,
                ...JSON.parse(anonymousCart),
              ]);
              setCart(uniqueItems);
              localStorage.setItem(userKey, JSON.stringify(uniqueItems));
              localStorage.removeItem(anonymousKey);
            } else {
              setCart(JSON.parse(anonymousCart));
              localStorage.setItem(userKey, anonymousCart);
              localStorage.removeItem(anonymousKey);
            }
          } else if (userCart && userCart.length > 0) {
            setCart(uniqueListItems([...serverCart, ...JSON.parse(userCart)]));
          }
        } catch {
          setError("Error Fetching Cart Please try again later ");
          console.error("Error syncing cart with server:", error);
        }
      }
    };

    syncCartWithServer();
  }, [session?.user?.id, error]);

  const contextValue = useMemo(
    () => ({
      cart,
      totalPrice,
      error,
      calculateTotals,
      setCart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartItemCount,
      isInCart,
      manualSync,
      removeUserCart,
    }),
    [
      cart,
      totalPrice,
      error,
      calculateTotals,
      getCartItemCount,
      isInCart,
      manualSync,
      removeUserCart,
      updateQuantity,
    ]
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

export default CartProvider;
