import { Metadata } from "next";
import { ProductCardProps } from "@/app/types/types";
import LoadingSpinner from "@/app/UI/LoadingSpinner";
import { api } from "@/app/utils/api";
import React, { Suspense, lazy } from "react";
import {
  generateMetadata as generateSEOMetadata,
  generateCanonicalUrl,
} from "@/app/utils/seo";
import { ProductSchema, Breadcrumb } from "@/app/components/seo/SEOComponents";

const ProductImagesSlider = lazy(
  () => import("../../../components/productComponents/ProductImagesSlider")
);
const ProductDetails = lazy(
  () => import("../../../components/productComponents/ProductDetails")
);

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const product = await api.getProduct(id);

    if (!product) {
      return generateSEOMetadata({
        title: "Product Not Found",
        description: "The product you are looking for does not exist.",
        noIndex: true,
      });
    }

    const productImages =
      product.imgSrc?.map(
        (img: { src: string }) =>
          `${
            process.env.NEXT_PUBLIC_SITE_URL ||
            "https://espesyal-shop.vercel.app"
          }/api/product/image/${product._id}/${img.src}`
      ) || [];

    return generateSEOMetadata({
      title: product.name,
      description: product.description,
      keywords: [
        product.name,
        product.brand || "Espesyal Shop",
        product.categoryName || "General",
        "product",
        "buy",
        "shop",
      ].filter((keyword): keyword is string => typeof keyword === 'string'),
      canonical: generateCanonicalUrl(`/product/${id}`),
      ogImage: productImages[0],
      ogType: "product",
    });
  } catch (error) {
    console.error("Error generating metadata:", error);
    return generateSEOMetadata({
      title: "Product Not Found",
      description: "The product you are looking for does not exist.",
      noIndex: true,
    });
  }
}

export default async function ProductPage({ params }: Props) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  let product: ProductCardProps | null = null;
  let error: string | null = null;

  try {
    product = await api.getProduct(id);
  } catch (err) {
    console.error("Error fetching product:", err);
    error = err instanceof Error ? err.message : "An error occurred";
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
          <h1 className="text-2xl font-bold text-gray-900">
            Product not found
          </h1>
          <p className="mt-2 text-gray-600">
            The product you are looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  const productImages =
    product.imgSrc?.map(
      (img: { src: string }) =>
        `${
          process.env.NEXT_PUBLIC_SITE_URL || "https://espesyal-shop.vercel.app"
        }/api/product/image/${product._id}/${img.src}`
    ) || [];

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Shop", url: "/shop" },
    {
      name: product.categoryName || "Category",
      url: `/shop?category=${
        product.categoryName?.toLowerCase() || "category"
      }`,
    },
    { name: product.name, url: `/product/${id}`, current: true },
  ];

  const productSEOData = {
    name: product.name,
    description: product.description,
    price: product.price,
    oldPrice: product.oldPrice,
    currency: "USD",
    availability: "in_stock" as const,
    condition: "new" as const,
    brand: product.brand || "Espesyal Shop",
    category: product.categoryName || "General",
    images: productImages,
    rating: product.rating,
    reviewCount: Math.floor(Math.random() * 100) + 10, // Mock review count
    sku: product._id,
  };

  return (
    <div className="w-full px-4 sm:px-[5%] md:px-[8.5%] py-4 sm:py-6 md:py-8">
      <ProductSchema product={productSEOData} />

      <Breadcrumb items={breadcrumbItems} />

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
