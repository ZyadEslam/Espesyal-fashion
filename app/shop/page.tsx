import { lazy, Suspense } from "react";
// import LoadingSpinner from "../UI/LoadingSpinner";
import { ProductSkeletonGroup } from "../components/productComponents/LoadingSkeleton";
const ProductsGroup = lazy(
  () => import("../components/productComponents/ProductsGroup")
);
const ShopPage = () => {
  return (
    <div className="md:px-[8.5%] sm:px-[5%]">
      <div className="mb-12">
        <h2 className={`text-[22px] font-medium underlined-header w-fit pt-10`}>
          All products
        </h2>
      </div>
      <Suspense fallback={<ProductSkeletonGroup />}>
        <ProductsGroup />
      </Suspense>
    </div>
  );
};

export default ShopPage;
