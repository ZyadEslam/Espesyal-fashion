"use client";
import { assets } from "@/public/assets/assets";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import PrimaryBtn from "../PrimaryBtn";
import { motion } from "framer-motion";

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
      <div className="relative w-full h-[300px] lg:h-[350px] overflow-hidden rounded-2xl bg-gradient-to-r from-secondary/20 to-primary/20 animate-pulse">
        <div className="w-full h-full flex flex-col lg:flex-row justify-between items-center gap-8 p-8">
          <div className="w-32 h-32 lg:w-48 lg:h-48 bg-gray-200 rounded-2xl"></div>
          <div className="text-center lg:text-left">
            <div className="h-8 bg-gray-200 rounded mb-4 w-64"></div>
            <div className="h-4 bg-gray-200 rounded mb-6 w-80"></div>
            <div className="h-12 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="w-32 h-32 lg:w-48 lg:h-48 bg-gray-200 rounded-2xl"></div>
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
      className="relative w-full h-[300px] lg:h-[350px] overflow-hidden rounded-2xl bg-gradient-to-r from-secondary via-secondary/90 to-primary shadow-2xl"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-white/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full h-full flex flex-col lg:flex-row justify-between items-center gap-8 p-8 lg:p-12">
        {/* Left Image */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative w-32 h-32 lg:w-48 lg:h-48"
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
          className="text-center lg:text-left flex-1 max-w-md"
        >
          <h1 className="font-bold text-2xl lg:text-4xl text-white mb-4 leading-tight">
            Level Up Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-yellow-200">
              Gaming Experience
            </span>
          </h1>
          <p className="text-white/90 text-sm lg:text-base mb-6 leading-relaxed">
            From immersive sound to precise controls—everything you need to
            dominate the competition and win
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <PrimaryBtn
              text="Shop Gaming Gear"
              href="/shop"
              customClass="px-8 py-3 rounded-full text-sm lg:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            />
          </motion.div>
        </motion.div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="relative w-32 h-32 lg:w-48 lg:h-48"
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
        className="absolute top-4 right-4 w-3 h-3 bg-white/30 rounded-full"
      />
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-4 left-4 w-2 h-2 bg-white/20 rounded-full"
      />
    </motion.div>
  );
};

export default AdvBar;
