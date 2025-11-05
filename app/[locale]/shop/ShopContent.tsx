"use client";

import React from "react";
import { Breadcrumb } from "@/app/components/seo/SEOComponents";
import { Suspense } from "react";
import { ProductSkeletonGroup } from "../../components/productComponents/LoadingSkeleton";
import ShopLayout from "../../components/shopComponents/ShopLayout";

interface ShopContentProps {
  category?: string;
  q?: string;
  breadcrumbItems: Array<{ name: string; url: string; current?: boolean }>;
}

const ShopContent: React.FC<ShopContentProps> = ({
  category,
  breadcrumbItems,
}) => {

  return (
    <div className="md:px-[8.5%] sm:px-[5%]">
      <Breadcrumb items={breadcrumbItems} />

      <Suspense fallback={<ProductSkeletonGroup />}>
        <ShopLayout initialCategory={category} />
      </Suspense>
    </div>
  );
};

export default ShopContent;
