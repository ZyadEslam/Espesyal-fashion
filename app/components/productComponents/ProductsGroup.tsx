"use client";
import React, { useEffect, useState, useContext } from "react";
import ProductCard from "./ProductCard";
import { ProductCardProps } from "../../types/types";
import ErrorBox from "../../UI/ErrorBox";
import { ProductSkeletonGroup } from "./LoadingSkeleton";
import { ProductsContext } from "@/app/context/productsCtx";

const ProductsGroup = ({
  numOfProducts,
  customClassName,
}: {
  numOfProducts?: number;
  customClassName?: string;
}) => {
  const context = useContext(ProductsContext);
  
  if (!context) {
    return (
      <ErrorBox errorMessage="Products context is not available. Please ensure ProductsProvider is set up." />
    );
  }

  const { products, isLoading, error } = context;
  const [filteredProducts, setFilteredProducts] = useState<ProductCardProps[]>(
    []
  );

  useEffect(() => {
    if (numOfProducts && products) {
      setFilteredProducts(products.slice(0, numOfProducts));
    }
  }, [numOfProducts, products]);

  if (isLoading) {
    return <ProductSkeletonGroup />;
  }

  if (error || !products || products.length === 0) {
    return (
      <ErrorBox errorMessage={error || "Error loading products: Please Wait and try again"} />
    );
  }

  const productsToRender = numOfProducts ? filteredProducts : products;

  return (
    <section className={`${customClassName}`}>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-6">
        {productsToRender.map((product: ProductCardProps) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductsGroup;
