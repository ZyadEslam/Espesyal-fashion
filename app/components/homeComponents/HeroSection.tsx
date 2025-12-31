"use client";
import React, { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Copy, Check } from "lucide-react";
import { cachedFetchJson } from "../../utils/cachedFetch";

interface HeroContent {
  heroBadge: string;
  largestSale: string;
  useCode: string;
  forDiscount: string;
  promoCode: string;
}

// Clothing-related decorative shapes component
const FashionShapes = () => (
  <div className="absolute right-0 top-0 w-1/2 h-full overflow-hidden pointer-events-none hidden md:block">
    {/* Elegant Dress Silhouette */}
    <svg
      className="absolute top-[10%] right-[15%] w-32 h-48 opacity-20 animate-float"
      viewBox="0 0 100 150"
      fill="none"
    >
      <path
        d="M50 0 L60 20 L70 20 L65 50 L80 140 L70 145 L50 100 L30 145 L20 140 L35 50 L30 20 L40 20 Z"
        fill="url(#dressGradient)"
        stroke="#b16e27"
        strokeWidth="1"
      />
      <defs>
        <linearGradient id="dressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d9a66d" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#b16e27" stopOpacity="0.3" />
        </linearGradient>
      </defs>
    </svg>

    {/* Hanger Shape */}
    <svg
      className="absolute top-[5%] right-[40%] w-24 h-20 opacity-25 animate-float-delayed"
      viewBox="0 0 100 80"
      fill="none"
    >
      <path
        d="M50 0 L50 15 M35 15 Q50 25 65 15 L95 45 L90 50 L50 30 L10 50 L5 45 L35 15"
        stroke="#c88a4a"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <circle
        cx="50"
        cy="8"
        r="6"
        stroke="#c88a4a"
        strokeWidth="2"
        fill="none"
      />
    </svg>

    {/* T-Shirt Outline */}
    <svg
      className="absolute bottom-[20%] right-[10%] w-28 h-32 opacity-15 animate-float"
      viewBox="0 0 100 120"
      fill="none"
    >
      <path
        d="M25 0 L35 0 L40 15 L60 15 L65 0 L75 0 L95 30 L80 40 L75 35 L75 115 L25 115 L25 35 L20 40 L5 30 Z"
        fill="url(#shirtGradient)"
        stroke="#ad9452"
        strokeWidth="1.5"
      />
      <defs>
        <linearGradient id="shirtGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ad9452" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#8a7542" stopOpacity="0.2" />
        </linearGradient>
      </defs>
    </svg>

    {/* Shopping Bag */}
    <svg
      className="absolute bottom-[35%] right-[35%] w-20 h-24 opacity-20 animate-float-delayed"
      viewBox="0 0 80 100"
      fill="none"
    >
      <rect
        x="5"
        y="25"
        width="70"
        height="70"
        rx="5"
        fill="url(#bagGradient)"
        stroke="#b16e27"
        strokeWidth="2"
      />
      <path
        d="M25 25 L25 15 Q25 5 40 5 Q55 5 55 15 L55 25"
        stroke="#b16e27"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="bagGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d9a66d" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#b16e27" stopOpacity="0.15" />
        </linearGradient>
      </defs>
    </svg>

    {/* Decorative circles */}
    <div className="absolute top-[30%] right-[5%] w-4 h-4 rounded-full bg-primary-400/30 animate-pulse" />
    <div
      className="absolute top-[50%] right-[25%] w-3 h-3 rounded-full bg-secondary-400/40 animate-pulse"
      style={{ animationDelay: "0.5s" }}
    />
    <div
      className="absolute bottom-[40%] right-[8%] w-5 h-5 rounded-full bg-primary-300/25 animate-pulse"
      style={{ animationDelay: "1s" }}
    />
    <div
      className="absolute top-[15%] right-[8%] w-2 h-2 rounded-full bg-secondary-300/50 animate-pulse"
      style={{ animationDelay: "1.5s" }}
    />

    {/* Floating thread/needle */}
    <svg
      className="absolute top-[60%] right-[45%] w-16 h-16 opacity-25 animate-float"
      viewBox="0 0 60 60"
      fill="none"
    >
      <path
        d="M5 55 Q15 45 25 50 Q35 55 45 45 Q55 35 50 25"
        stroke="#c88a4a"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="4 4"
        fill="none"
      />
      <ellipse
        cx="52"
        cy="22"
        rx="6"
        ry="3"
        stroke="#c88a4a"
        strokeWidth="1.5"
        fill="none"
        transform="rotate(-45 52 22)"
      />
    </svg>

    {/* Button shapes */}
    <svg
      className="absolute bottom-[15%] right-[50%] w-8 h-8 opacity-30"
      viewBox="0 0 30 30"
    >
      <circle
        cx="15"
        cy="15"
        r="12"
        fill="none"
        stroke="#ad9452"
        strokeWidth="2"
      />
      <circle cx="10" cy="12" r="2" fill="#ad9452" />
      <circle cx="20" cy="12" r="2" fill="#ad9452" />
      <circle cx="10" cy="18" r="2" fill="#ad9452" />
      <circle cx="20" cy="18" r="2" fill="#ad9452" />
    </svg>
  </div>
);

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

  const isRTL = locale === "ar";

  return (
    <section className="relative overflow-hidden h-full shadow-2xl">
      {/* Creative Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a0f0a] via-[#2d1810] to-[#1f1209]" />

      {/* Warm overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 via-transparent to-secondary-900/60" />

      {/* Subtle radial glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary-400/10 rounded-full blur-3xl" />

      {/* Mesh pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #b16e27 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Fashion Shapes - Right Side */}
      <FashionShapes />

      {/* Content Container */}
      <div className="relative z-10 h-full container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`h-full flex flex-col md:flex-row items-center ${
            isRTL ? "justify-center" : "justify-start"
          } gap-8 md:gap-12 py-12 md:py-16`}
        >
          {/* Left Side - Badge & Heading */}
          <div
            className={`flex-1 max-w-2xl flex flex-col justify-center space-y-6 md:space-y-8 animate-fade-in ${
              isRTL ? "items-center text-center" : "items-start"
            }`}
          >
            {/* Badge */}
            <div
              className={`inline-flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-primary-500/20 to-primary-600/20 backdrop-blur-md rounded-full border border-primary-400/30 shadow-xl ${
                isRTL ? "justify-center" : ""
              }`}
            >
              <div className="relative">
                <span className="absolute inset-0 bg-primary-400 rounded-full blur-md opacity-60 animate-pulse"></span>
                <span className="relative w-2.5 h-2.5 bg-primary-400 rounded-full"></span>
              </div>
              <span
                className={`text-sm md:text-base font-bold text-white tracking-wider uppercase ${
                  isRTL ? "text-center" : ""
                }`}
              >
                {heroBadge}
              </span>
            </div>

            {/* Main Heading */}
            <div className={`space-y-4 ${isRTL ? "w-full" : ""}`}>
              <h1
                className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] ${
                  isRTL ? "max-w-full text-center" : "max-w-2xl"
                }`}
              >
                <span
                  className={`block bg-gradient-to-r from-white via-primary-100 to-primary-200 bg-clip-text text-transparent ${
                    isRTL ? "text-center" : ""
                  }`}
                >
                  {largestSale}
                </span>
              </h1>
              <div
                className={`flex items-center gap-3 ${
                  isRTL ? "justify-center" : ""
                }`}
              >
                <div className="h-1 w-16 bg-gradient-to-r from-primary-400 to-transparent rounded-full"></div>
                <div className="h-2 w-2 bg-primary-400 rounded-full shadow-lg shadow-primary-400/50"></div>
                <div className="h-1 w-32 bg-gradient-to-r from-transparent via-primary-400/50 to-transparent rounded-full"></div>
              </div>
            </div>

            {/* Promo Code Section */}
            <div
              className={`flex-shrink-0 w-full md:w-auto animate-fade-in-up-delay ${
                isRTL ? "flex justify-center" : ""
              }`}
            >
              <div
                className={`inline-flex items-center gap-3 px-4 py-3 bg-white/5 backdrop-blur-md rounded-full border border-white/20 shadow-lg ${
                  isRTL ? "flex-wrap justify-center" : ""
                }`}
              >
                {/* Text */}
                <div
                  className={`flex items-center gap-2 ${
                    isRTL ? "flex-wrap justify-center" : ""
                  }`}
                >
                  <span
                    className={`text-white text-sm md:text-base font-medium ${
                      isRTL ? "whitespace-normal" : "whitespace-nowrap"
                    }`}
                  >
                    {useCode}
                  </span>
                  <span
                    className={`text-white/80 text-xs md:text-sm ${
                      isRTL ? "whitespace-normal" : "whitespace-nowrap"
                    }`}
                  >
                    {forDiscount}
                  </span>
                </div>

                {/* Divider */}
                <div className="h-6 w-px bg-white/30"></div>

                {/* Code */}
                <code className="px-3 py-1.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-lg md:text-xl font-bold tracking-wider rounded-lg shadow-lg shadow-primary-500/30">
                  {promoCode}
                </code>

                {/* Copy Button */}
                <button
                  onClick={handleCopyCode}
                  className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                  aria-label="Copy promo code"
                  title="Copy code"
                >
                  {copied ? (
                    <Check className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 md:w-5 md:h-5 text-white transition-colors" />
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
