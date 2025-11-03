"use client";
import React from "react";
import Image from "next/image";
import { assets } from "@/public/assets/assets";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import PrimaryBtn from "../PrimaryBtn";

const HeroSection = () => {
  const t = useTranslations("home");
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-background via-secondaryLight to-background shadow-lg border border-secondary">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-primary/30 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center p-6 lg:p-8">
        {/* Text Content - Left Side */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col justify-center space-y-6 text-foreground"
        >
          {/* Limited Time Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="inline-flex items-center"
          >
            <span className="bg-orange/10 text-orange px-4 py-2 rounded-full text-sm font-semibold border border-orange/20">
              {t("specialOffer")}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
          >
            {t("elevateYourStyle")} <span className="text-orange">{t("styleGame")}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-foreground/70 text-base md:text-lg leading-relaxed max-w-lg"
          >
            {t("discoverExclusive")} <span className="text-orange font-bold">30% {t("off")}</span>. {t("limitedTimeOffer")}
          </motion.p>

         

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex lg:flex-row sm:flex-col sm:gap-8 items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <PrimaryBtn
                text={t("shopNow")}
                href="/shop"
                customClass="px-6 py-3 rounded-full text-base font-semibold shadow-md hover:shadow-lg transition-all duration-300 bg-orange text-white hover:bg-primary border border-orange hover:border-primary"
              />
            </motion.div>
            <button className="text-foreground/70 hover:text-orange transition-colors duration-300 font-medium text-base">
              {t("viewCollection")}
            </button>
          </motion.div>

       
        </motion.div>

        {/* Image - Right Side */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full h-[350px] lg:h-[500px] order-first lg:order-last"
        >
          <div className="relative w-full h-full rounded-2xl overflow-hidden">
            <Image
              src={assets.girl8}
              alt="Fashion Collection - Special Offer"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
              priority
              quality={90}
            />
            {/* Overlay for better contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background/20"></div>
          </div>

          {/* Simple Sale Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="absolute top-4 right-4 bg-orange text-white px-3 py-2 rounded-lg shadow-md font-semibold text-sm"
          >
            -30% OFF
          </motion.div>

          {/* Subtle Floating Elements */}
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-8 left-8 w-3 h-3 bg-orange/40 rounded-full"
          />
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute bottom-8 right-8 w-2 h-2 bg-primary/40 rounded-full"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
