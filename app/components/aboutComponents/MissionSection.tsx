"use client";
import { motion } from "framer-motion";
// import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";

const MissionSection = () => {
  const t = useTranslations("about.mission");

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-12 underlined-header after:mx-auto"
        >
          {t("title")}
        </motion.h2>
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-gray-600 leading-relaxed text-lg font-medium">
              {t("description")}
            </p>
          </motion.div>
          {/* <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative h-[400px] rounded-lg overflow-hidden"
          >
            <Image
              src="/downloaded/teamwork.svg"
              alt="Our Mission"
              fill
              className="object-fit object-bottom"
            />
          </motion.div> */}
        </div>
      </div>
    </section>
  );
};
export default MissionSection;
