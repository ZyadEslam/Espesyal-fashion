"use client";
import { useState, useMemo, useEffect } from "react";
import { ProductCardProps } from "@/app/types/types";
import { api } from "@/app/utils/api";
import { ProductsContext } from "@/app/context/productsCtx";

interface ProductsProviderProps {
  children: React.ReactNode;
}

const ProductsProvider = ({ children }: ProductsProviderProps) => {
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getProductsFromServer = async () => {
      if (typeof window !== "undefined") {
        try {
          setIsLoading(true);
          const serverProducts = await api.getProducts();
          console.log("Server Products: ", serverProducts);

          setProducts(serverProducts);
          setIsLoading(false);
        } catch (error) {
          console.error("Error migrating wishlist:", error);
          setError(
            error instanceof Error ? error.message : "Error Fetching Products"
          );
        } finally {
          setIsLoading(false);
        }
      }
    };
    getProductsFromServer();
  }, []);

  const contextValue = useMemo(
    () => ({
      products,
      isLoading,
      error,
      setProducts,
      setIsLoading,
      setError,
    }),
    [products, isLoading, error]
  );

  return (
    <ProductsContext.Provider value={contextValue}>
      {children}
    </ProductsContext.Provider>
  );
};

export default ProductsProvider;
