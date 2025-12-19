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
      className="relative"
    >
      <div className="max-full mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-secondary-300 via-primary-500 to-secondary-300 shadow-2xl"
        >
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

          <div className="relative z-10 flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-between py-8 md:py-10 px-6 md:px-8 lg:px-12">
            {/* Text side - Modern styling matching Hero Section */}
            <div className="text-center md:text-left max-w-xl">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 rounded-full bg-primary-500/20 backdrop-blur-md px-4 py-2 mb-3 border border-primary-500/40 shadow-lg"
              >
                <Sparkles className="h-4 w-4 text-white" />
                <span className="text-xs font-semibold uppercase tracking-wide text-white">
                  {t("followUsNow")}
                </span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                viewport={{ once: true }}
                className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-relaxed drop-shadow-xl"
                style={{
                  textShadow: "0 2px 20px rgba(0,0,0,0.3)",
                }}
              >
                {t("followUsForOffers")}{" "}
                <span className="bg-gradient-to-r from-white via-secondary-100 to-white bg-clip-text text-transparent">
                  {t("exclusiveOffers")}
                </span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                viewport={{ once: true }}
                className="mt-3 text-sm md:text-base text-white/90 leading-relaxed"
              >
                {t("joinSocialMedia")}
              </motion.p>
            </div>

            {/* Social icons - Modern styling */}
            <div className="flex items-center gap-3 md:gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.3 + index * 0.1,
                    ease: "easeOut",
                  }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.15, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full bg-white/95 backdrop-blur-md shadow-xl border border-white/60 hover:shadow-2xl transition-all duration-300"
                  aria-label={social.name}
                  title={social.description}
                >
                  <social.icon className="h-5 w-5 md:h-6 md:w-6 text-gray-800" />
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
