"use client";
import React, { useState, useEffect } from "react";
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
    <section className="relative overflow-hidden h-[70vh]  bg-gradient-to-br from-[#0F2027] via-[#203A43] to-[#2c5364] rounded-lg md:rounded-xl shadow-2xl">
      {/* Pattern Background Image */}
      <div
        className="absolute inset-0 opacity-80"
        style={{
          backgroundImage: `url('/espesyal/orange-grunge-twisting-pattern.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/50 to-black/70"></div>

      {/* Content Container */}
      <div className="relative z-10 h-full container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-full flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 py-12 md:py-16">
          {/* Left Side - Badge & Heading */}
          <div className="flex-1 flex flex-col justify-center items-start space-y-6 md:space-y-8 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-primary-500/20 to-primary-600/20 backdrop-blur-md rounded-full border border-primary-400/30 shadow-xl">
              <div className="relative">
                <span className="absolute inset-0 bg-primary-400 rounded-full blur-md opacity-60 animate-pulse"></span>
                <span className="relative w-2.5 h-2.5 bg-primary-400 rounded-full"></span>
              </div>
              <span className="text-sm md:text-base font-bold text-white tracking-wider uppercase">
                {heroBadge}
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] max-w-2xl">
                <span className="block bg-gradient-to-r from-white via-white to-primary-200 bg-clip-text text-transparent">
                  {largestSale}
                </span>
              </h1>
              <div className="flex items-center gap-3">
                <div className="h-1 w-16 bg-gradient-to-r from-primary-400 to-transparent rounded-full"></div>
                <div className="h-2 w-2 bg-primary-400 rounded-full shadow-lg shadow-primary-400/50"></div>
                <div className="h-1 w-32 bg-gradient-to-r from-transparent via-primary-400/50 to-transparent rounded-full"></div>
              </div>
            </div>
             {/* Right Side - Promo Code */}
          <div className="flex-shrink-0 w-full md:w-auto animate-fade-in-up-delay">
            <div className="inline-flex items-center gap-3 px-4 py-3  backdrop-blur-md rounded-full border border-white/20 shadow-lg">
              {/* Text */}
              <div className="flex items-center gap-2">
                <span className="text-white text-sm md:text-base font-medium whitespace-nowrap">
                  {useCode}
                </span>
                <span className="text-white text-xs md:text-sm whitespace-nowrap">
                  {forDiscount}
                </span>
              </div>

              {/* Divider */}
              <div className="h-6 w-px bg-white"></div>

              {/* Code */}
              <code className="px-3 py-1.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-lg md:text-xl font-bold tracking-wider rounded-lg">
                {promoCode}
              </code>

              {/* Copy Button */}
              <button
                onClick={handleCopyCode}
                className="p-2 hover:bg-white rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                aria-label="Copy promo code"
                title="Copy code"
              >
                {copied ? (
                  <Check className="w-4 h-4 md:w-5 md:h-5 text-green-300" />
                ) : (
                  <Copy className="w-4 h-4 md:w-5 md:h-5 text-white  transition-colors" />
                )}
              </button>
            </div>
          </div>
          </div>

         
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
