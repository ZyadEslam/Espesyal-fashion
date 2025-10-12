"use client";

import { useContext } from "react";
import { ProductsContext } from "./../context/productsCtx";

export const useProducts = () => {
  const context = useContext(ProductsContext);

  if (!context) {
    throw new Error("useProducts must be used within a ProdcutsProvider");
  }

  return context;
};
