"use client";
import React from "react";
import Image from "next/image";
import { assets } from "@/public/assets/assets";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

const Footer = () => {
  const pathname = usePathname();
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  return (
    <>
      {pathname !== "/dashboard" && (
        <footer className="bg-gradient-to-b from-secondaryLight to-secondary mt-20">
          <div className="container mx-auto px-4 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {/* Brand Section */}
              <div className="lg:col-span-2 space-y-6">
                <Link href="/" className="inline-block group">
                  <Image
                    src={assets.espesialLogo}
                    alt="Espesyal Shop Logo"
                    width={200}
                    height={60}
                    className="object-contain h-12 lg:h-14 w-auto transition-transform duration-300 group-hover:scale-105 filter brightness-110 contrast-110"
                    priority
                    quality={95}
                  />
                </Link>
                <p className="text-foreground/80 leading-relaxed text-base max-w-md">
                  {t("discoverCurated")}
                </p>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="text-gray-600 hover:text-orange transition-colors duration-300"
                  >
                    <Image
                      src={assets.facebook_icon}
                      alt="Facebook"
                      width={24}
                      height={24}
                    />
                  </a>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-orange transition-colors duration-300"
                  >
                    <Image
                      src={assets.instagram_icon}
                      alt="Instagram"
                      width={24}
                      height={24}
                    />
                  </a>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-orange transition-colors duration-300"
                  >
                    <Image
                      src={assets.twitter_icon}
                      alt="Twitter"
                      width={24}
                      height={24}
                    />
                  </a>
                </div>
              </div>

              {/* Company Links */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-foreground">
                  {t("company")}
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="/"
                      className="text-foreground/70 hover:text-orange transition-colors duration-300"
                    >
                      {tNav("home")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      className="text-foreground/70 hover:text-orange transition-colors duration-300"
                    >
                      {t("aboutUs")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="text-foreground/70 hover:text-orange transition-colors duration-300"
                    >
                      {t("contact")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop"
                      className="text-foreground/70 hover:text-orange transition-colors duration-300"
                    >
                      {tNav("shop")}
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact Info */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-foreground">
                  {t("getInTouch")}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-orange/20 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-orange rounded-full"></div>
                    </div>
                    <span className="text-foreground/70">+201040431147</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-orange/20 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-orange rounded-full"></div>
                    </div>
                    <span className="text-foreground/70">+201144094269</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-orange/20 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-orange rounded-full"></div>
                    </div>
                    <span className="text-foreground/70">
                      zyadelbehiry@gmail.com
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="border-t border-gray-300/50 mt-12 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <p className="text-foreground/60 text-sm">
                  {t("copyright")}
                </p>
                <div className="flex space-x-6 text-sm">
                  <Link
                    href="#"
                    className="text-foreground/60 hover:text-orange transition-colors duration-300"
                  >
                    {t("privacyPolicy")}
                  </Link>
                  <Link
                    href="#"
                    className="text-foreground/60 hover:text-orange transition-colors duration-300"
                  >
                    {t("termsOfService")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}
    </>
  );
};

export default Footer;
