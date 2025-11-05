"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import { useTranslations, useLocale } from "next-intl";

const ContactUsSection = () => {
  const t = useTranslations("about.contactUs");
  const locale = useLocale();

  return (
    <section className="py-20 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="container mx-auto px-4 text-center"
      >
        <h2 className="text-3xl font-bold mb-6">{t("title")}</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          {t("description")}
        </p>
        <Link
          className="bg-orange text-white px-8 py-3 rounded-lg hover:bg-orange/90 transition-colors"
          href={`/${locale}/contact`}
        >
          {t("button")}
        </Link>
      </motion.div>
    </section>
  );
};

export default ContactUsSection;
