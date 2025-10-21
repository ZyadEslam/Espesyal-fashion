"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

const MissionSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-12 underlined-header after:mx-auto"
        >
          Our Mission
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-foreground leading-relaxed text-lg font-medium">
              We&apos;re on a{" "}
              <span className="text-orange font-bold">mission</span> to
              revolutionize online shopping by providing a{" "}
              <span className="italic">seamless, personalized experience</span>{" "}
              that connects customers with the products they love.
            </p>
            <p className="text-foreground leading-relaxed text-lg mt-4 font-medium">
              Our commitment to <span className="text-orange">quality</span>,
              <span className="text-orange"> innovation</span>, and
              <span className="text-orange"> customer satisfaction</span>
              drives everything we do.
            </p>
          </motion.div>
          <motion.div
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
          </motion.div>
        </div>
      </div>
    </section>
  );
};
export default MissionSection;
