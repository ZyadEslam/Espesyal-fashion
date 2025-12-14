"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ProductCardProps } from "../../types/types";
import ProductCard from "../productComponents/ProductCard";
import { useLocale } from "next-intl";
import { cachedFetchJson, cacheStrategies } from "../../utils/cachedFetch";

interface CategorySectionProps {
  categoryId: string;
  categoryName: string;
  categorySlug: string;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  categoryId,
  categoryName,
  categorySlug,
}) => {
  const t = useTranslations("home");
  const locale = useLocale();
  const isArabic = locale.startsWith("ar");
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        // Limit to 20 products for home page display
        const data = await cachedFetchJson<{
          success: boolean;
          data: ProductCardProps[];
        }>(
          `/api/categories/${categoryId}/products?limit=20`,
          cacheStrategies.products()
        );

        if (data.success) {
          setProducts(data.data || []);
        } else {
          setError("Failed to load products");
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchProducts();
    }
  }, [categoryId]);

  const handleScroll = (direction: "prev" | "next") => {
    if (!scrollContainerRef.current) return;

    // Use requestAnimationFrame to batch DOM reads/writes and avoid forced reflows
    requestAnimationFrame(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      // Batch DOM reads - get all needed values at once
      const card = container.querySelector(".category-card");
      const cardWidth = card instanceof HTMLElement ? card.offsetWidth : 0;
      const scrollAmount = cardWidth + 24; // include gap

      // Batch DOM write - perform scroll in the same frame
      requestAnimationFrame(() => {
        container.scrollBy({
          left: direction === "next" ? scrollAmount : -scrollAmount,
          behavior: "smooth",
        });
      });
    });
  };

  if (loading) {
    return (
      <section className="section-spacing">
        <div className="container mx-auto px-4">
          <div className={`mb-8 ${isArabic ? "text-right" : "text-left"}`}>
            <h2 className="text-2xl uppercase lg:text-3xl font-bold text-foreground mb-4">
              {categoryName}
            </h2>
          </div>
          <div className="flex gap-6 overflow-hidden pb-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex-shrink-0 w-64 h-80 bg-gray-200 animate-pulse rounded-2xl"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || products.length === 0) {
    return null; // Don't render section if no products
  }

  return (
    <section className="section-spacing">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className={`mb-8 flex flex-row lg:flex-row justify-between lg:items-center ${
            isArabic ? "text-right sm:text-right" : "text-left sm:text-left"
          }`}
        >
          <h2 className="text-2xl uppercase lg:text-3xl font-bold text-foreground mb-4">
            {categoryName}
          </h2>
          {/* View All Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link
              href={`/${locale}/shop?category=${categorySlug}`}
              className={`inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-all duration-300 hover:text-primary ${
                isArabic ? "flex-row-reverse" : ""
              }`}
            >
              {t("viewAll") || "View All"}
              {isArabic ? (
                <ArrowLeftIcon className="w-6 h-6 bg-gray-200 rounded-full p-1" />
              ) : (
                <ArrowRightIcon className="w-6 h-6 bg-gray-200 rounded-full p-1" />
              )}
            </Link>
          </motion.div>
        </motion.div>

        {/* Scrollable Carousel */}
        <div className="relative">
          <button
            onClick={() => handleScroll("prev")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-2 shadow-sm"
            aria-label="Previous products"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div
            className="overflow-x-auto scrollbar-hide px-6 sm:px-10 lg:px-12 snap-x snap-mandatory"
            ref={scrollContainerRef}
          >
            <div className="flex gap-6 min-w-max">
              {products.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="category-card w-[calc(50vw-1.5rem)] min-w-[220px] max-w-[260px] sm:w-60 md:w-64 lg:w-72 flex-shrink-0 snap-start"
                >
                  <ProductCard
                    product={product}
                    showCartButton={false}
                    isLCP={index === 0} // First product in each category section is LCP candidate
                  />
                </motion.div>
              ))}
            </div>
          </div>

          <button
            onClick={() => handleScroll("next")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-2 shadow-sm"
            aria-label="Next products"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
