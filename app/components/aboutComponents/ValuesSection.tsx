"use client";
import { values } from "@/app/utils/staticData";
import { motion } from "framer-motion";
// import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};
const ValuesSection = () => {
  const t = useTranslations("about.values");
  const valueKeys = ["innovation", "quality", "customerFirst"];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-12 underlined-header after:mx-auto"
        >
          {t("title")}
        </motion.h2>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {values.map((value, index) => {
            const key = valueKeys[index];
            return (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 mb-4 relative">
                  {/* <Image
                    src={value.icon}
                    alt={t(`${key}.title`)}
                    fill
                    className="object-contain"
                  /> */}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  {t(`${key}.title`)}
                </h3>
                <p className="text-gray-600">{t(`${key}.description`)}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default ValuesSection;
