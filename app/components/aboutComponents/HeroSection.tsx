"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="relative h-[60vh] flex items-center justify-center bg-gradient-to-r from-gray-50 to-gray-100 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 text-center relative z-10"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
          <motion.span className="text-orange">Our</motion.span> Story
        </h1>
        <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto">
          Crafting exceptional shopping experiences since 2025
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute inset-0"
      >
        <Image
          src="/downloaded/d5.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
