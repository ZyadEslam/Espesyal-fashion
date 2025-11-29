"use client";
import React from "react";
import { motion } from "framer-motion";
import { Instagram, Facebook, Twitter, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

const SubscriptionOffer = () => {
  const t = useTranslations("home");
  const socialLinks = [
    {
      name: "Instagram",
      icon: Instagram,
      href: "#",
      followers: "25K+",
      description: "Daily Fashion Inspiration",
      gradient: "from-pink-500 via-purple-500 to-pink-600",
      hoverGradient:
        "hover:from-pink-600 hover:via-purple-600 hover:to-pink-700",
    },
    {
      name: "Facebook",
      icon: Facebook,
      href: "#",
      followers: "15K+",
      description: "Community & Updates",
      gradient: "from-blue-500 to-blue-600",
      hoverGradient: "hover:from-blue-600 hover:to-blue-700",
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: "#",
      followers: "8K+",
      description: "Latest News & Trends",
      gradient: "from-sky-400 to-sky-500",
      hoverGradient: "hover:from-sky-500 hover:to-sky-600",
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="relative "
    >
      <div className="max-full mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-black via-black/90 to-black/80 px-6 py-5 md:px-8 md:py-6"
        >
          {/* Subtle grid like HeroSection */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: `
                linear-gradient(to right, white 1px, transparent 1px),
                linear-gradient(to bottom, white 1px, transparent 1px)
              `,
              backgroundSize: "32px 32px",
            }}
          />

          <div className="relative z-10 flex flex-col items-center gap-4 md:flex-row md:items-center md:justify-between">
            {/* Text side - smaller, simple */}
            <div className="text-center md:text-left max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 mb-2">
                <Sparkles className="h-4 w-4 text-orange" />
                <span className="text-xs font-medium uppercase tracking-wide text-white/70">
                  {t("followUsNow")}
                </span>
              </div>
              <h2 className="text-lg md:text-xl font-semibold text-white leading-snug">
                {t("followUsForOffers")}{" "}
                <span className="bg-gradient-to-r from-orange via-orange-400 to-orange-500 bg-clip-text text-transparent">
                  {t("exclusiveOffers")}
                </span>
              </h2>
              <p className="mt-2 text-xs md:text-sm text-white/70">
                {t("joinSocialMedia")}
              </p>
            </div>

            {/* Social icons only */}
            <div className="flex items-center gap-3 md:gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.35,
                    delay: 0.15 + index * 0.05,
                    type: "spring",
                    stiffness: 220,
                  }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  className={`relative flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-full bg-gradient-to-br ${social.gradient} shadow-lg hover:shadow-xl transition-all duration-200`}
                  aria-label={social.name}
                  title={social.description}
                >
                  <social.icon className="h-5 w-5 text-white" />
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default SubscriptionOffer;
