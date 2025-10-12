"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { ProductCardProps } from "../../types/types";
import ErrorBox from "../../UI/ErrorBox";
import { ProductSkeletonGroup } from "./LoadingSkeleton";
import { useProducts } from "@/app/hooks/useProducts";
const ProductsGroup = ({
  numOfProducts,
  customClassName,
}: {
  numOfProducts?: number;
  customClassName?: string;
}) => {
  const { products, isLoading, error } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState<ProductCardProps[]>(
    []
  );

  useEffect(() => {
    if (numOfProducts) {
      setFilteredProducts(products ? products.slice(0, numOfProducts) : []);
    }
  }, [numOfProducts, products]);

  if (isLoading) {
    return <ProductSkeletonGroup />;
  }

  if (!products) {
    console.log(error);
    return (
      <ErrorBox errorMessage="Error loading products: Please Wait and try again" />
    );
  }

  const productsToRender = numOfProducts ? filteredProducts : products;

  return (
    <section className={`${customClassName}`}>
      <div className="flex flex-wrap md:gap-4 gap-0 justify-between mb-8">
        {productsToRender.map((product: ProductCardProps) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductsGroup;
