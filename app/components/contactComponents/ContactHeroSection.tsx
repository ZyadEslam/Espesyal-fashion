"use client";
import { motion } from "framer-motion";
import React from "react";
import { useTranslations } from "next-intl";

const ContactHeroSection = () => {
  const t = useTranslations("contact.hero");

  return (
    <section className="relative h-[40vh] flex items-center justify-center bg-gradient-to-r from-gray-50 to-gray-100 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 text-center relative z-10"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          <motion.span className="text-orange">{t("title")}</motion.span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          {t("subtitle")}
        </p>
      </motion.div>
    </section>
  );
};
export default ContactHeroSection;
