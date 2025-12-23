"use client";
import React from "react";
import { Instagram, Facebook, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import TikTokIcon from "../icons/TikTokIcon";

const SubscriptionOffer = () => {
  const t = useTranslations("home");
  const socialLinks = [
    {
      name: "Instagram",
      icon: Instagram,
      href: "https://www.instagram.com/espesyal_brand?igsh=MTg5M3VuNWVyenF6Nw==",
      gradient: "",
      hoverGradient: "",
      bgColor: "",
      iconColor: "text-pink-600",
    },
    {
      name: "Facebook",
      icon: Facebook,
      href: "https://www.facebook.com/share/1CxWh2BmJ6/",
      gradient: "",
      hoverGradient: "",
      bgColor: "",
      iconColor: "text-blue-600",
    },
    {
      name: "TikTok",
      icon: TikTokIcon,
      href: "https://www.tiktok.com/@espesyalbrand_1?_t=8p7NIPbuJU1&_r=1",
      gradient: "from-gray-900 via-gray-800 to-gray-900",
      hoverGradient: "bg-gray-800",
      bgColor: "bg-gray-100",
      iconColor: "text-gray-800",
    },
  ];

  return (
    <section className="relative">
      <div className="max-full mx-auto">
        <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-secondary-300 via-primary-500 to-secondary-300 shadow-2xl">
          {/* Elegant Background Patterns - Matching Hero Section */}
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
            <div className="absolute top-0 right-0 w-96 h-96 bg-secondary-200/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-200/20 rounded-full blur-3xl" />

            {/* Elegant Curved Lines */}
            <svg
              className="absolute inset-0 w-full h-full opacity-20"
              xmlns="http://www.w3.org/2000/svg"
            >~
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

          <div className="relative z-10 flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-between py-8 md:py-10 px-6 md:px-8 lg:px-12">
            {/* Text side - Modern styling matching Hero Section */}
            <div className="text-center md:text-left max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-500/20 backdrop-blur-md px-4 py-2 mb-3 border border-primary-500/40 shadow-lg">
                <Sparkles className="h-4 w-4 text-white" />
                <span className="text-xs font-semibold uppercase tracking-wide text-white">
                  {t("followUsNow")}
                </span>
              </div>
              <h2
                className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-relaxed drop-shadow-xl"
                style={{
                  textShadow: "0 2px 20px rgba(0,0,0,0.3)",
                }}
              >
                {t("followUsForOffers")}{" "}
                <span className="bg-gradient-to-r from-white via-secondary-100 to-white bg-clip-text text-transparent">
                  {t("exclusiveOffers")}
                </span>
              </h2>
              <p className="mt-3 text-sm md:text-base text-white/90 leading-relaxed">
                {t("joinSocialMedia")}
              </p>
            </div>

            {/* Social icons - Modern styling */}
            <div className="flex items-center gap-3 md:gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="relative flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full bg-white/95 backdrop-blur-md shadow-xl border border-white/60 hover:shadow-2xl transition-all duration-300 hover:scale-110 hover:-translate-y-1 active:scale-95"
                  aria-label={`${t("followUsOn")} ${social.name}`}
                >
                  <social.icon className="h-5 w-5 md:h-6 md:w-6 text-gray-800" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubscriptionOffer;
