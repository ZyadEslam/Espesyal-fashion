"use client";
import { assets } from "@/public/assets/assets";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import PrimaryBtn from "../PrimaryBtn";
import { motion } from "framer-motion";
import LoadingSpinner from "../../UI/LoadingSpinner";

const AdvBar = () => {
  // const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // const handleResize = () => {
    //   setIsMobile(window.innerWidth < 768);
    // };

    setIsMounted(true);
    // handleResize();

    // if (typeof window !== "undefined") {
    //   window.addEventListener("resize", handleResize);
    //   return () => window.removeEventListener("resize", handleResize);
    //   //   return () => window.removeEventListener("resize", handleResize);
    // }
  }, []);

  if (!isMounted) {
    return (
      <div className="relative w-full h-[250px] sm:h-[300px] lg:h-[350px] overflow-hidden rounded-2xl bg-gradient-to-r from-orange/20 to-primary/20">
        <div className="w-full h-full flex flex-col lg:flex-row justify-center items-center gap-6 p-6 lg:p-8">
          <LoadingSpinner
            size="lg"
            text="Loading Special Offers..."
            className="text-white"
          />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="relative w-full h-auto min-h-[300px] sm:min-h-[350px] lg:min-h-[400px] overflow-hidden rounded-2xl bg-gradient-to-r from-orange via-orange/90 to-primary shadow-2xl border border-orange/20"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/30 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-white/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-white/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full h-full flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-12 p-4 sm:p-6 lg:p-8 xl:p-12">
        {/* Left Fashion Image */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 order-1 lg:order-1 rounded-2xl overflow-hidden shadow-2xl"
        >
          <Image
            className="w-full h-full object-cover filter brightness-110"
            src={assets.girl2}
            alt="Fashion Model - Special Offer"
            priority
          />
          {/* Offer Badge */}
          <div className="absolute -top-2 -right-2 bg-white text-orange px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            -30%
          </div>
        </motion.div>

        {/* Center Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center lg:text-left flex-1 max-w-md lg:max-w-lg xl:max-w-xl order-2 lg:order-2 px-2"
        >
          <div className="mb-2">
            <span className="inline-block bg-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold mb-3">
              LIMITED TIME OFFER
            </span>
          </div>
          <h1 className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-white mb-3 sm:mb-4 lg:mb-6 leading-tight">
            Exclusive{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-yellow-100 to-white">
              Fashion Collection
            </span>
          </h1>
          <p className="text-white/95 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 lg:mb-8 leading-relaxed font-medium">
            Discover our curated selection of premium fashion pieces with up to
            30% off. Elevate your style with timeless designs that last.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex justify-center lg:justify-start"
          >
            <PrimaryBtn
              text="Shop Now - Save 30%"
              href="/shop"
              customClass="px-6 py-3 sm:px-8 sm:py-3 lg:px-10 lg:py-4 rounded-full text-sm sm:text-base lg:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 bg-orange text-orange hover:bg-orange hover:text-white border-2 border-white hover:border-orange"
            />
          </motion.div>
        </motion.div>

        {/* Right Decorative Element */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 order-3 lg:order-3 flex items-center justify-center"
        >
          {/* Fashion Icon */}
          <div className="w-full h-full bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
            <div className="text-white text-xl sm:text-2xl lg:text-3xl font-bold">
              ✨
            </div>
          </div>
          {/* Price Tag */}
          <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-white text-orange px-2 py-1 rounded-lg text-xs font-bold shadow-lg">
            $99
          </div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-3 right-3 sm:top-4 sm:right-4 w-2 h-2 sm:w-3 sm:h-3 bg-white/40 rounded-full"
      />
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 w-1 h-1 sm:w-2 sm:h-2 bg-white/30 rounded-full"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute top-1/2 right-1/4 w-1 h-1 bg-white/20 rounded-full"
      />

      {/* Sale Banner */}
      <motion.div
        initial={{ rotate: -15, scale: 0 }}
        whileInView={{ rotate: -15, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white text-orange px-3 py-1 sm:px-4 sm:py-2 rounded-lg shadow-lg font-bold text-xs sm:text-sm transform -rotate-12 z-10"
      >
        SALE!
      </motion.div>
    </motion.div>
  );
};

export default AdvBar;
