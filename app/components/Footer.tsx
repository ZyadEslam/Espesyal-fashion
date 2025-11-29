"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { Phone, Mail } from "lucide-react";
import { assets } from "@/public/assets/assets";

const Footer = () => {
  const pathname = usePathname();
  const locale = useLocale();
  const isDashboard = pathname?.includes("/dashboard");

  if (isDashboard) return null;

  const getLocalizedPath = (path: string) => {
    return `/${locale}${path}`;
  };

  return (
    <footer className="border-t border-black/20">
      <div className="container mx-auto px-4 py-12">
        {/* First Row: 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-gray-300">
          {/* Column 1: Logo + Contact Info */}
          <div className="space-y-4">
            {/* Logo with Brand Name */}
            <Link
              href={getLocalizedPath("/")}
              className="inline-flex items-center space-x-2 group"
            >
              <Image
                src={assets.espesialLogo}
                alt="Espesyal Shop Logo"
                width={200}
                height={60}
                className="object-contain h-10 sm:h-12 w-auto transition-transform duration-300 group-hover:scale-105"
                priority
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
                href="tel:+201040431147"
                className="text-gray-700 hover:text-orange transition-colors text-sm sm:text-base"
              >
                +201040431147
              </a>
            </div>

            {/* Email */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange/10 rounded-full flex items-center justify-center">
                <Mail className="w-4 h-4 text-orange" />
              </div>
              <a
                href="mailto:zyadelbehiry@gmail.com"
                className="text-gray-700 hover:text-orange transition-colors text-sm sm:text-base break-all"
              >
                zyadelbehiry@gmail.com
              </a>
            </div>
          </div>

          {/* Column 2: Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href={getLocalizedPath("/")}
                  className="text-gray-700 hover:text-orange transition-colors text-sm sm:text-base"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href={getLocalizedPath("/about")}
                  className="text-gray-700 hover:text-orange transition-colors text-sm sm:text-base"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href={getLocalizedPath("/shop")}
                  className="text-gray-700 hover:text-orange transition-colors text-sm sm:text-base"
                >
                  Shop
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Services
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-700 hover:text-orange transition-colors text-sm sm:text-base block"
                >
                  Fast Shipping & Easy Returns
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-700 hover:text-orange transition-colors text-sm sm:text-base block"
                >
                  Personalized Style Advice
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-700 hover:text-orange transition-colors text-sm sm:text-base block"
                >
                  Gift Cards & Vouchers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-700 hover:text-orange transition-colors text-sm sm:text-base block"
                >
                  Comprehensive Size Guide
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-700 hover:text-orange transition-colors text-sm sm:text-base block"
                >
                  Real-Time Order Tracking
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-700 hover:text-orange transition-colors text-sm sm:text-base block"
                >
                  Reward Points & Loyalty Program
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-700 hover:text-orange transition-colors text-sm sm:text-base block"
                >
                  Customer Support
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
            © {new Date().getFullYear()} Espesyal Shop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
