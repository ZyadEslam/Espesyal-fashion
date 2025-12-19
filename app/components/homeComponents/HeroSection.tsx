"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import {
  Copy,
  Check,
  // Sparkles
} from "lucide-react";
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
    <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-secondary-300 via-primary-500  to-secondary-300 shadow-2xl">
      {/* Elegant Background Patterns */}
      <div className="absolute inset-0">
        {/* Subtle Pattern */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Floating Orbs for Depth */}
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-secondary-200/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-80 h-80 bg-primary-200/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* Elegant Curved Lines */}
        <svg
          className="absolute inset-0 w-full h-full opacity-20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,100 Q250,50 500,100 T1000,100"
            stroke="white"
            strokeWidth="2"
            fill="none"
            className="hidden md:block"
          />
          <path
            d="M0,200 Q300,150 600,200 T1200,200"
            stroke="white"
            strokeWidth="2"
            fill="none"
            className="hidden md:block"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center py-12 px-4 md:py-16 md:px-8 lg:py-20">
        {/* Hero Badge with Elegant Styling */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-4 md:mb-6"
        >
          <span className="inline-flex items-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight drop-shadow-2xl">
            <span className="bg-primary-500/20 backdrop-blur-md px-6 py-2 md:px-8 md:py-3 rounded-full border border-primary-500/40 shadow-lg">
              {heroBadge}
            </span>
          </span>
        </motion.div>

        {/* Main Heading with Modern Typography */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6 md:mb-8 leading-relaxed px-4 drop-shadow-xl max-w-4xl"
          style={{
            textShadow: "0 2px 20px rgba(0,0,0,0.3)",
          }}
        >
          {largestSale}
        </motion.h1>

        {/* Promo Code Badge - Modern & Elegant */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="w-full max-w-lg"
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-3 md:gap-4 bg-white backdrop-blur-md px-6 md:px-8 py-4 md:py-5 rounded-2xl shadow-2xl border border-primary-500/40 hover:shadow-3xl transition-all duration-300">
            <span className="font-semibold text-sm sm:text-base md:text-lg text-gray-800 whitespace-nowrap">
              {useCode}
            </span>
            <div className="flex items-center gap-2 md:gap-3">
              <code className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 md:px-5 py-2 md:py-2.5 rounded-xl font-bold text-base sm:text-lg md:text-xl tracking-wider shadow-lg">
                {promoCode}
              </code>
              <button
                onClick={handleCopyCode}
                className="p-2 md:p-2.5 hover:bg-primary-50 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
                aria-label="Copy code"
                title="Copy code"
              >
                {copied ? (
                  <Check className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                ) : (
                  <Copy className="w-5 h-5 md:w-6 md:h-6 text-gray-800" />
                )}
              </button>
            </div>
            <span className="font-semibold text-sm sm:text-base md:text-lg text-gray-800 whitespace-nowrap">
              {forDiscount}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
