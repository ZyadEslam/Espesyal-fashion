"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Copy, Check, Sparkles } from "lucide-react";
import { cachedFetchJson } from "../../utils/cachedFetch";

interface HeroContent {
  heroBadge: string;
  largestSale: string;
  useCode: string;
  forDiscount: string;
  promoCode: string;
}

const HeroSection = () => {
  const t = useTranslations("home");
  const locale = useLocale();
  const [copied, setCopied] = useState(false);
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);

  // Fetch hero content from API with caching - prioritize initial render
  useEffect(() => {
    let isMounted = true;
    let idleCallbackId: number | null = null;
    let timeoutId: NodeJS.Timeout | null = null;

    // Use cached fetch for better performance
    const fetchHeroContent = async () => {
      try {
        const result = await cachedFetchJson<{
          success: boolean;
          data: HeroContent;
        }>(`/api/hero-section?locale=${locale}`, {
          cache: "default",
          revalidate: 300, // Cache for 5 minutes
        });

        // Only update state if component is still mounted
        if (isMounted && result?.success && result.data) {
          setHeroContent(result.data);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching hero section:", error);
        }
      }
    };

    // Defer non-critical fetch to avoid blocking initial render
    // Use requestIdleCallback if available, otherwise setTimeout
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      idleCallbackId = requestIdleCallback(fetchHeroContent, { timeout: 1000 });
    } else {
      timeoutId = setTimeout(fetchHeroContent, 0);
    }

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
      if (
        idleCallbackId !== null &&
        typeof window !== "undefined" &&
        "cancelIdleCallback" in window
      ) {
        cancelIdleCallback(idleCallbackId);
      }
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, [locale]);

  // Use API content if available, otherwise fallback to translations
  const heroBadge = heroContent?.heroBadge || t("heroBadge");
  const largestSale = heroContent?.largestSale || t("largestSale");
  const useCode = heroContent?.useCode || t("useCode");
  const forDiscount = heroContent?.forDiscount || t("forDiscount");
  const promoCode = heroContent?.promoCode || "BFRIDAY";

  const handleCopyCode = () => {
    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-black via-black/90 to-black/80 px-6 py-5 md:px-8 md:py-6">
      {/* Creative Background Patterns */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.09]"
          style={{
            backgroundImage: `
              linear-gradient(to right, white 1px, transparent 1px),
              linear-gradient(to bottom, white 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Sparkle Icons - Defer animation to reduce initial render cost */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3 + 0.5, // Slight delay to prioritize content
            }}
            className={`absolute ${
              i === 0
                ? "top-1/4 right-1/4"
                : i === 1
                ? "top-1/2 left-1/4"
                : i === 2
                ? "bottom-1/3 right-1/3"
                : i === 3
                ? "top-1/3 left-1/2"
                : i === 4
                ? "bottom-1/4 left-1/3"
                : "top-2/3 right-1/2"
            } text-white/50`}
          >
            <Sparkles className="w-4 h-4 md:w-6 md:h-6" />
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center py-6 px-4 md:py-8 md:px-8">
        {/* Hero Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-3 md:mb-4"
        >
          <span className="inline-flex items-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight uppercase drop-shadow-lg">
            {heroBadge}
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white mb-4 md:mb-6 leading-tight px-2 drop-shadow-md max-w-3xl"
        >
          {largestSale}
        </motion.h1>

        {/* Promo Code Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-2 md:gap-3 bg-white/95 backdrop-blur-sm px-4 md:px-6 py-2.5 md:py-3 rounded-full shadow-xl border-2 border-white/50">
            <span className=" font-semibold text-xs sm:text-sm md:text-base whitespace-nowrap">
              {useCode}
            </span>
            <div className="flex items-center gap-1 md:gap-2">
              <code className=" text-black px-2 md:px-3 py-1 rounded-lg font-bold text-sm sm:text-base md:text-lg tracking-wider ">
                {promoCode}
              </code>
              <button
                onClick={handleCopyCode}
                className="p-1 md:p-1.5 hover:bg-primary-100 rounded-lg transition-colors"
                aria-label="Copy code"
                title="Copy code"
              >
                {copied ? (
                  <Check className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 md:w-5 md:h-5 text-black" />
                )}
              </button>
            </div>
            <span className=" font-semibold text-xs sm:text-sm md:text-base whitespace-nowrap">
              {forDiscount}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
