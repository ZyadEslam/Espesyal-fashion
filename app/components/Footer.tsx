"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Phone, Mail } from "lucide-react";
import { assets } from "@/public/assets/assets";

const Footer = () => {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const isDashboard = pathname?.includes("/dashboard");

  if (isDashboard) return null;

  const getLocalizedPath = (path: string) => {
    return `/${locale}${path}`;
  };

  return (
    <footer className="border-t border-black/20">
      <div className="layout-shell py-12">
        {/* First Row: 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-gray-300">
          {/* Column 1: Logo + Contact Info */}
          <div className="space-y-4">
            {/* Logo with Brand Name */}
            <Link
              href={getLocalizedPath("/")}
              className="inline-flex flex-row items-center space-x-2 group"
              dir="ltr"
            >
              <Image
                src={assets.espesialLogo}
                alt="Espesyal Shop Logo"
                width={120}
                height={45}
                className="object-contain h-10 sm:h-12 w-auto transition-transform duration-300 group-hover:scale-105"
                priority
                quality={85}
                sizes="(max-width: 640px) 80px, 120px"
              />
              <span className="brand-name text-xl sm:text-2xl font-semibold text-gray-900">
                Espesyal
              </span>
            </Link>

            {/* Phone */}
            <div className="flex items-center space-x-3 pt-2">
              <div className="w-8 h-8 bg-orange/10 rounded-full flex items-center justify-center">
                <Phone className="w-4 h-4 text-orange" />
              </div>
              <a
                href="tel:+201080972324"
                className="text-gray-700 hover:text-orange transition-colors text-sm sm:text-base"
              >
                +201080972324
              </a>
            </div>

            {/* Email */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange/10 rounded-full flex items-center justify-center">
                <Mail className="w-4 h-4 text-orange" />
              </div>
              <a
                href="mailto:espesyaleg@gmail.com"
                className="text-gray-700 hover:text-orange transition-colors text-sm sm:text-base break-all"
              >
                espesyaleg@gmail.com
              </a>
            </div>
          </div>

          {/* Column 2: Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t("links")}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href={getLocalizedPath("/")}
                  className="text-gray-700 hover:text-orange transition-colors text-sm sm:text-base"
                >
                  {tNav("home")}
                </Link>
              </li>
              <li>
                <Link
                  href={getLocalizedPath("/about")}
                  className="text-gray-700 hover:text-orange transition-colors text-sm sm:text-base"
                >
                  {tNav("about")}
                </Link>
              </li>
              <li>
                <Link
                  href={getLocalizedPath("/shop")}
                  className="text-gray-700 hover:text-orange transition-colors text-sm sm:text-base"
                >
                  {tNav("shop")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t("services")}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-700 hover:text-orange transition-colors text-sm sm:text-base block"
                >
                  {t("fastShipping")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-700 hover:text-orange transition-colors text-sm sm:text-base block"
                >
                  {t("styleAdvice")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-700 hover:text-orange transition-colors text-sm sm:text-base block"
                >
                  {t("giftCards")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-700 hover:text-orange transition-colors text-sm sm:text-base block"
                >
                  {t("sizeGuide")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-700 hover:text-orange transition-colors text-sm sm:text-base block"
                >
                  {t("orderTracking")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-700 hover:text-orange transition-colors text-sm sm:text-base block"
                >
                  {t("loyaltyProgram")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-700 hover:text-orange transition-colors text-sm sm:text-base block"
                >
                  {t("customerSupport")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Second Row: Payment Logos */}
        <div className="py-8 border-b border-gray-300">
          <div className="flex flex-wrap items-center justify-center gap-6">
            {/* Visa Logo */}
            <div className="flex items-center justify-center w-16 h-10 bg-white border border-black/20 rounded px-2">
              <span className="text-2xl font-bold text-[#1A1F71]">VISA</span>
            </div>

            {/* Cash on Delivery */}
            <div className="flex items-center justify-center w-20 h-10 bg-white border border-black/20 rounded px-2">
              <span className="text-xs font-semibold text-gray-700">CASH</span>
            </div>
          </div>
        </div>

        {/* Third Row: Copyright */}
        <div className="pt-8">
          <p className="text-center text-sm text-gray-600">
            © {new Date().getFullYear()} Espesyal Shop. {t("allRightsReserved")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
