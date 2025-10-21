import { Metadata } from "next";
import { Suspense } from "react";
import { ProductSkeletonGroup } from "../components/productComponents/LoadingSkeleton";
import ShopLayout from "../components/shopComponents/ShopLayout";
import { generateMetadata as generateSEOMetadata } from "../utils/seo";
import { Breadcrumb } from "@/app/components/seo/SEOComponents";

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    q?: string;
    sort?: string;
    page?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: ShopPageProps): Promise<Metadata> {
  const params = await searchParams;
  const { category, q } = params;

  let title = "Shop - Espesyal Shop";
  let description =
    "Discover our amazing collection of premium products. Browse through categories and find the perfect items for your lifestyle.";
  let keywords = [
    "shop",
    "products",
    "e-commerce",
    "online shopping",
    "premium goods",
  ];

  if (category) {
    title = `${
      category.charAt(0).toUpperCase() + category.slice(1)
    } Products - Espesyal Shop`;
    description = `Browse our ${category} collection featuring premium quality products. Find the perfect ${category} items for your needs.`;
    keywords = [category, "products", "shop", "buy", "premium"];
  }

  if (q) {
    title = `Search Results for "${q}" - Espesyal Shop`;
    description = `Search results for "${q}". Find the best products matching your search criteria.`;
    keywords = [q, "search", "products", "results"];
  }

  return generateSEOMetadata({
    title,
    description,
    keywords,
    canonical: `/shop${category ? `?category=${category}` : ""}${
      q ? `?q=${q}` : ""
    }`,
  });
}

const ShopPage = async ({ searchParams }: ShopPageProps) => {
  const params = await searchParams;
  const { category, q } = params;

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Shop", url: "/shop", current: true },
  ];

  if (category) {
    breadcrumbItems.splice(-1, 0, {
      name: category.charAt(0).toUpperCase() + category.slice(1),
      url: `/shop?category=${category}`,
    });
  }

  if (q) {
    breadcrumbItems.splice(-1, 0, {
      name: `Search: "${q}"`,
      url: `/shop?q=${q}`,
    });
  }

  return (
    <div className="md:px-[8.5%] sm:px-[5%]">
      <Breadcrumb items={breadcrumbItems} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 pt-10 mb-2">
          {category
            ? `${category.charAt(0).toUpperCase() + category.slice(1)} Products`
            : q
            ? `Search Results for "${q}"`
            : "Shop"}
        </h1>
        <p className="text-gray-600">
          {category
            ? `Discover our ${category} collection featuring premium quality products`
            : q
            ? `Find the best products matching "${q}"`
            : "Discover our amazing collection of products"}
        </p>
      </div>

      <Suspense fallback={<ProductSkeletonGroup />}>
        <ShopLayout initialCategory={params.category} />
      </Suspense>
    </div>
  );
};

export default ShopPage;
