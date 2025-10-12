import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";

const ContactUsSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="container mx-auto px-4 text-center"
      >
        <h2 className="text-3xl font-bold mb-6">Join Our Journey</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          We&apos;re always looking for passionate individuals to join our team
          and help shape the future of e-commerce.
        </p>
        <Link
          className="bg-orange text-white px-8 py-3 rounded-lg hover:bg-orange/90 transition-colors"
          href="/contact"
        >
          Contact Us
        </Link>
      </motion.div>
    </section>
  );
};

export default ContactUsSection;
