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
  const { products, loading, error } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState<ProductCardProps[]>(
    []
  );

  useEffect(() => {
    if (numOfProducts) {
      setFilteredProducts(products ? products.slice(0, numOfProducts) : []);
    }
  }, [numOfProducts, products]);

  if (loading) {
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
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-6">
        {productsToRender.map((product: ProductCardProps) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductsGroup;
