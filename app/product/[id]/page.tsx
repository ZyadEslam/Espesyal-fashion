"use client";

import { ProductCardProps } from "@/app/types/types";
import LoadingSpinner from "@/app/UI/LoadingSpinner";
import { api } from "@/app/utils/api";
import React, { Suspense, lazy, useEffect, useState } from "react";

const ProductImagesSlider = lazy(
  () => import("../../components/productComponents/ProductImagesSlider")
);
const ProductDetails = lazy(
  () => import("../../components/productComponents/ProductDetails")
);

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default function ProductPage({ params }: Props) {
  const [product, setProduct] = useState<ProductCardProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const resolvedParams = await params;
        const { id } = resolvedParams;

        const data = await api.getProduct(id);
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params]);

  if (loading) {
    return (
      <div className="w-full px-4 sm:px-[5%] md:px-[8.5%] py-4 sm:py-6 md:py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-4 sm:px-[5%] md:px-[8.5%] py-4 sm:py-6 md:py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full px-4 sm:px-[5%] md:px-[8.5%] py-4 sm:py-6 md:py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">
            Product not found
          </h2>
          <p className="mt-2 text-gray-600">
            The product you are looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-[5%] md:px-[8.5%] py-4 sm:py-6 md:py-8">
      <div className="flex flex-col justify-between md:flex-row gap-4 sm:gap-6 md:gap-8">
        <Suspense fallback={<LoadingSpinner />}>
          <ProductImagesSlider product={product} />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <ProductDetails data={product} />
        </Suspense>
      </div>
    </div>
  );
}
