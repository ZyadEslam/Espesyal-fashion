"use client";
import React from "react";
import Image from "next/image";
import { assets } from "@/public/assets/assets";
import { motion } from "framer-motion";
import PrimaryBtn from "../PrimaryBtn";

const HeroSection = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center ">
      {/* Text Content - Left Side */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col justify-center space-y-6 lg:pr-8"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight"
        >
          Elevate Your{" "}
          <span className=" bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Everyday Style
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-gray-600 text-base md:text-lg leading-relaxed max-w-lg"
        >
          Discover our curated collection of timeless fashion pieces, designed
          for sophistication and comfort that lasts.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex items-center space-x-4"
        >
          <PrimaryBtn
            text="Shop Now"
            href="/shop"
            customClass="px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          />
          <button className="text-gray-600 hover:text-primary transition-colors duration-300 font-medium">
            Learn More →
          </button>
        </motion.div>
      </motion.div>

      {/* Image - Right Side */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full h-[300px] lg:h-[550px] order-first lg:order-last"
      >
        <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          <Image
            src={assets.girl6}
            alt="Fashion Collection - Modern Style"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-top"
            priority
            quality={85}
          />
          {/* Overlay gradient for better text readability if needed */}
          {/* <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-gray-50/20" /> */}
        </div>

        {/* Decorative elements */}
        {/* <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
          className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-xl"
        />
        <motion.div
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 1, ease: "easeOut" }}
          className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary/10 rounded-full blur-xl"
        /> */}
      </motion.div>
    </div>
  );
};

export default HeroSection;
