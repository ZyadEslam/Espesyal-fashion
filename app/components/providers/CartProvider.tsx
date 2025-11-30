"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
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
  const [isCartHydrated, setIsCartHydrated] = useState(false);
  const hasSyncedRef = useRef(false);

  const matchCartItem = useCallback(
    (item: ProductCardProps, productId?: string, variantId?: string | null) =>
      item._id === productId &&
      (item.selectedVariantId || null) === (variantId || null),
    []
  );

  const resolveVariantQuantity = useCallback(
    (product: ProductCardProps): number | undefined => {
      if (product.maxAvailable !== undefined) {
        return product.maxAvailable;
      }
      if (product.selectedVariantId && product.variants?.length) {
        const variant = product.variants.find(
          (v) => v._id === product.selectedVariantId
        );
        if (variant) {
          return variant.quantity;
        }
      }
      return product.totalStock;
    },
    []
  );

  // Initialize cart from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsCartHydrated(false);

    try {
      const storageKey = getCartStorageKey(session?.user?.id);
      const storedCart = localStorage.getItem(storageKey);

      if (storedCart) {
        setCart(JSON.parse(storedCart));
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
    } finally {
      setIsCartHydrated(true);
    }
  }, [session?.user?.id]);

  // Save to localStorage whenever cart or user changes
  useEffect(() => {
    if (typeof window === "undefined" || !isCartHydrated) return;

    try {
      const storageKey = getCartStorageKey(session?.user?.id);
      localStorage.setItem(storageKey, JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cart, session?.user?.id, isCartHydrated]);

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
  const addToCart = useCallback(
    (product: ProductCardProps) => {
      if (!product?._id) {
        console.warn("Cannot add product without id to cart");
        return;
      }

      if (product.variants?.length && !product.selectedVariantId) {
        console.warn("Variant selection required for this product");
        return;
      }

      setCart((prevCart) => {
        const variantId = product.selectedVariantId || null;
        const existingIndex = prevCart.findIndex((item) =>
          matchCartItem(item, product._id, variantId)
        );
        const quantityToAdd =
          product.quantityInCart && product.quantityInCart > 0
            ? product.quantityInCart
            : 1;
        const maxAvailable = resolveVariantQuantity(product);

        if (existingIndex !== -1) {
          return prevCart.map((item, idx) => {
            if (idx !== existingIndex) return item;
            const currentQty = item.quantityInCart || 1;
            const updatedQuantity = maxAvailable
              ? Math.min(currentQty + quantityToAdd, maxAvailable)
              : currentQty + quantityToAdd;

            return {
              ...item,
              quantityInCart: updatedQuantity,
              maxAvailable: maxAvailable ?? item.maxAvailable,
            };
          });
        }

        return [
          ...prevCart,
          {
            ...product,
            quantityInCart: maxAvailable
              ? Math.min(quantityToAdd, maxAvailable)
              : quantityToAdd,
            maxAvailable,
          },
        ];
      });
    },
    [matchCartItem, resolveVariantQuantity]
  );

  // Remove from cart
  const removeFromCart = useCallback(
    (productId: string, variantId?: string) => {
      setCart((prevCart) =>
        prevCart.filter(
          (item) => !matchCartItem(item, productId, variantId || null)
        )
      );
    },
    [matchCartItem]
  );

  // Update quantity
  const updateQuantity = useCallback(
    (productId: string, variantId: string | undefined, quantity: number) => {
      if (quantity <= 0) {
        setCart((prevCart) =>
          prevCart.filter(
            (item) => !matchCartItem(item, productId, variantId || null)
          )
        );
        return;
      }

      setCart((prevCart) =>
        prevCart.map((item) => {
          if (!matchCartItem(item, productId, variantId || null)) {
            return item;
          }
          const maxAvailable =
            item.maxAvailable ?? resolveVariantQuantity(item);
          const clampedQuantity = maxAvailable
            ? Math.min(quantity, maxAvailable)
            : quantity;
          return { ...item, quantityInCart: clampedQuantity, maxAvailable };
        })
      );
    },
    [matchCartItem, resolveVariantQuantity]
  );

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
  const isInCart = useCallback(
    (productId: string, variantId?: string) => {
      if (!variantId) {
        return cart.some((item) => item._id === productId);
      }

      return cart.some((item) =>
        matchCartItem(item, productId, variantId || null)
      );
    },
    [cart, matchCartItem]
  );

  // Sync with server database on component mount (only when user ID changes)
  useEffect(() => {
    // Prevent multiple syncs for the same user
    if (hasSyncedRef.current && session?.user?.id) {
      return;
    }

    const syncCartWithServer = async () => {
      if (session?.user?.id && typeof window !== "undefined") {
        try {
          hasSyncedRef.current = true;
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
        } catch (err) {
          setError("Error Fetching Cart Please try again later ");
          console.error("Error syncing cart with server:", err);
          hasSyncedRef.current = false; // Allow retry on error
        }
      }
    };

    syncCartWithServer();
    // Only sync when user ID changes, not on every error state change
  }, [session?.user?.id]);

  // Reset sync flag when user changes
  useEffect(() => {
    hasSyncedRef.current = false;
  }, [session?.user?.id]);

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
      addToCart,
      getCartItemCount,
      isInCart,
      manualSync,
      removeUserCart,
      updateQuantity,
      removeFromCart,
    ]
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

export default CartProvider;
