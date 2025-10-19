import { Suspense } from "react";
import { ProductSkeletonGroup } from "../components/productComponents/LoadingSkeleton";
import ShopLayout from "../components/shopComponents/ShopLayout";

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

const ShopPage = async ({ searchParams }: ShopPageProps) => {
  const params = await searchParams;
  return (
    <div className="md:px-[8.5%] sm:px-[5%]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 pt-10 mb-2">Shop</h1>
        <p className="text-gray-600">
          Discover our amazing collection of products
        </p>
      </div>

      <Suspense fallback={<ProductSkeletonGroup />}>
        <ShopLayout initialCategory={params.category} />
      </Suspense>
    </div>
  );
};

export default ShopPage;
