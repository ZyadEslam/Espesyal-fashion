"use client";
import { team } from "@/app/utils/staticData";
import { motion } from "framer-motion";
import Image from "next/image";
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

const TeamSection = () => {
  const t = useTranslations("about.team");

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
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid md:grid-cols-4 gap-8"
        >
          {team.map((member, index) => (
            <motion.div key={index} variants={fadeIn} className="text-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden"
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                {member.name}
              </h3>
              <p className="text-orange mb-2">{member.role}</p>
              <p className="text-gray-600 text-sm">{member.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TeamSection;
