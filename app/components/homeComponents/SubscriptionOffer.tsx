"use client";
import React from "react";
import { motion } from "framer-motion";
import { Instagram, Facebook, Twitter } from "lucide-react";

const SubscriptionOffer = () => {
  const socialLinks = [
    {
      name: "Instagram",
      icon: Instagram,
      href: "#",
      followers: "25K+",
      description: "Daily Fashion Inspiration",
    },
    {
      name: "Facebook",
      icon: Facebook,
      href: "#",
      followers: "15K+",
      description: "Community & Updates",
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: "#",
      followers: "8K+",
      description: "Latest News & Trends",
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="py-16 px-4"
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Follow Us for <span className="text-orange">Exclusive Offers</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Join our social media community and be the first to discover
            exclusive products, special discounts, and behind-the-scenes
            content.
          </p>
        </motion.div>

        {/* Social Media Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
        >
          {socialLinks.map((social) => (
            <motion.a
              key={social.name}
              href={social.href}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-orange/20"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange/10 transition-colors duration-300">
                  <social.icon className="w-8 h-8 text-gray-600 group-hover:text-orange transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {social.name}
                </h3>
                <div className="text-2xl font-bold text-orange mb-2">
                  {social.followers}
                </div>
                <p className="text-gray-600 text-sm">{social.description}</p>
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="grid sm:grid-cols-1 md:grid-cols-3 gap-8 text-center"
        >
          <div className="text-gray-900">
            <div className="text-2xl font-bold text-orange mb-2">
              Exclusive Access
            </div>
            <div className="text-gray-600 text-sm">
              First access to new collections
            </div>
          </div>
          <div className="text-gray-900">
            <div className="text-2xl font-bold text-orange mb-2">
              Special Discounts
            </div>
            <div className="text-gray-600 text-sm">
              Up to 40% off for followers
            </div>
          </div>
          <div className="text-gray-900">
            <div className="text-2xl font-bold text-orange mb-2">Community</div>
            <div className="text-gray-600 text-sm">
              Join our fashion community
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <p className="text-gray-600 text-sm mb-6">
            Follow us now and never miss an exclusive offer!
          </p>
          <div className="flex justify-center space-x-4">
            {socialLinks.map((social) => (
              <motion.a
                key={social.name}
                href={social.href}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-orange hover:text-white transition-all duration-300"
              >
                <social.icon className="w-5 h-5 text-gray-600 hover:text-white transition-colors duration-300" />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default SubscriptionOffer;
