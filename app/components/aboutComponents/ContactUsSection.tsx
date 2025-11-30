"use client";
import { motion } from "framer-motion";
import React from "react";
import { useTranslations } from "next-intl";
import { Instagram, Facebook, MessageCircle } from "lucide-react";

const ContactUsSection = () => {
  const t = useTranslations("about.contactUs");

  const socialLinks = [
    {
      name: t("instagram"),
      icon: Instagram,
      href: "https://instagram.com",
      gradient: "from-pink-500 via-purple-500 to-pink-600",
      hoverGradient:
        "hover:from-pink-600 hover:via-purple-600 hover:to-pink-700",
      bgColor: "bg-pink-50",
      iconColor: "text-pink-600",
    },
    {
      name: t("facebook"),
      icon: Facebook,
      href: "https://facebook.com",
      gradient: "from-blue-500 to-blue-600",
      hoverGradient: "hover:from-blue-600 hover:to-blue-700",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },

    {
      name: t("whatsapp"),
      icon: MessageCircle,
      href: "https://wa.me",
      gradient: "from-green-500 to-green-600",
      hoverGradient: "hover:from-green-600 hover:to-green-700",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {t("title")}
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {t("description")}
          </p>
        </motion.div>

        {/* Social Media Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6"
        >
          {socialLinks.map((social, index) => (
            <motion.a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.4,
                delay: 0.3 + index * 0.1,
                type: "spring",
                stiffness: 200,
              }}
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group relative flex flex-col items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-2xl shadow-md hover:shadow-xl border border-gray-100 hover:border-orange/30 transition-all duration-300"
              aria-label={`${t("followUsOn")} ${social.name}`}
            >
              {/* Icon with gradient background on hover */}
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${social.bgColor} flex items-center justify-center group-hover:bg-gradient-to-br ${social.gradient} transition-all duration-300`}
              >
                <social.icon
                  className={`w-6 h-6 sm:w-7 sm:h-7 ${social.iconColor} group-hover:text-white transition-colors duration-300`}
                />
              </div>
              <span className="mt-2 text-xs sm:text-sm font-medium text-gray-700 group-hover:text-orange transition-colors duration-300">
                {social.name}
              </span>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ContactUsSection;
