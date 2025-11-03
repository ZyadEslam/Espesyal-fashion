"use client";

import React from "react";
import { useTranslations } from "next-intl";
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
  q,
  breadcrumbItems,
}) => {
  const t = useTranslations("shop");

  return (
    <div className="md:px-[8.5%] sm:px-[5%]">
      <Breadcrumb items={breadcrumbItems} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 pt-10 mb-2">
          {category
            ? `${category.charAt(0).toUpperCase() + category.slice(1)} ${t(
                "products"
              )}`
            : q
            ? `${t("searchResults")} "${q}"`
            : t("title")}
        </h1>
        <p className="text-gray-600">
          {category
            ? t("categoryDescription", { category })
            : q
            ? t("searchDescription", { query: q })
            : t("defaultDescription")}
        </p>
      </div>

      <Suspense fallback={<ProductSkeletonGroup />}>
        <ShopLayout initialCategory={category} />
      </Suspense>
    </div>
  );
};

export default ShopContent;
