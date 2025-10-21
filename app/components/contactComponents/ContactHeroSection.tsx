"use client";
import { motion } from "framer-motion";
import React from "react";

const ContactHeroSection = () => {
  return (
    <section className="relative h-[40vh] flex items-center justify-center bg-gradient-to-r from-gray-50 to-gray-100 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 text-center relative z-10"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          <motion.span className="text-orange">Contact</motion.span> Us
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          We&apos;d love to hear from you. Send us a message and we&apos;ll
          respond as soon as possible.
        </p>
      </motion.div>
    </section>
  );
};
export default ContactHeroSection;
