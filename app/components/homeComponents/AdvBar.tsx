"use client";
import { assets } from "@/public/assets/assets";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import PrimaryBtn from "../PrimaryBtn";
import { motion } from "framer-motion";
import LoadingSpinner from "../../UI/LoadingSpinner";

const AdvBar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    setIsMounted(true);
    handleResize();

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  if (!isMounted) {
    return (
      <div className="relative w-full h-[250px] sm:h-[300px] lg:h-[350px] overflow-hidden rounded-2xl bg-gradient-to-r from-secondary/20 to-primary/20">
        <div className="w-full h-full flex flex-col lg:flex-row justify-center items-center gap-6 p-6 lg:p-8">
          <LoadingSpinner
            size="lg"
            text="Loading Gaming Experience..."
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
      className="relative w-full h-[250px] sm:h-[300px] lg:h-[350px] overflow-hidden rounded-2xl bg-gradient-to-r from-secondary via-secondary/90 to-primary shadow-2xl"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-white/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full h-full flex flex-col lg:flex-row justify-between items-center gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8 xl:p-12">
        {/* Left Image */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 order-1 lg:order-1"
        >
          <Image
            className="w-full h-full object-contain drop-shadow-2xl"
            src={assets.jbl_soundbox_image}
            alt="Premium Sound System"
            priority
          />
        </motion.div>

        {/* Center Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center lg:text-left flex-1 max-w-sm lg:max-w-md xl:max-w-lg order-2 lg:order-2 px-2"
        >
          <h1 className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-white mb-2 sm:mb-3 lg:mb-4 leading-tight">
            Level Up Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-yellow-200">
              Gaming Experience
            </span>
          </h1>
          <p className="text-white/90 text-xs sm:text-sm md:text-base lg:text-base mb-3 sm:mb-4 lg:mb-6 leading-relaxed">
            From immersive sound to precise controls—everything you need to
            dominate the competition and win
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex justify-center lg:justify-start"
          >
            <PrimaryBtn
              text="Shop Gaming Gear"
              href="/shop"
              customClass="px-4 py-2 sm:px-6 sm:py-2 lg:px-8 lg:py-3 rounded-full text-xs sm:text-sm lg:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            />
          </motion.div>
        </motion.div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="relative w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 order-3 lg:order-3"
        >
          <Image
            src={
              isMobile ? assets.sm_controller_image : assets.md_controller_image
            }
            className="w-full h-full object-contain drop-shadow-2xl"
            alt="Gaming Controller"
            priority
          />
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-2 right-2 sm:top-4 sm:right-4 w-2 h-2 sm:w-3 sm:h-3 bg-white/30 rounded-full"
      />
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 w-1 h-1 sm:w-2 sm:h-2 bg-white/20 rounded-full"
      />
    </motion.div>
  );
};

export default AdvBar;
