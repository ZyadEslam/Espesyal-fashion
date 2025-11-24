"use client";
import React, { useState, useEffect, useCallback, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { assets } from "@/public/assets/assets";
import { AuthButtons, ToggleMenuBtn } from "./";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Heart, ShoppingCart, User, Package } from "lucide-react";
import { useCart } from "@/app/hooks/useCart";
import { useTranslations } from "next-intl";
import { useWishlist } from "@/app/hooks/useWishlist";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLocale } from "next-intl";

const UserNav = memo(() => {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("nav");
  const tOrders = useTranslations("orders");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session } = useSession();
  const { getCartItemCount } = useCart();
  const cartItemCount = getCartItemCount();
  const { getWishlistItemCount } = useWishlist();
  const wishlistItemCount = getWishlistItemCount();

  // Helper to add locale to paths
  const getLocalizedPath = (path: string) => {
    return `/${locale}${path}`;
  };

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen && !(event.target as Element).closest(".mobile-menu")) {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isMenuOpen, closeMenu]);

  const isDashboard = pathname.includes("/dashboard");

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isDashboard
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200"
          : isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200"
          : "bg-white border-b border-gray-200"
      }`}
    >
      <div className={`container mx-auto px-4 max-w-7xl`}>
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            href={getLocalizedPath("/")}
            className="flex items-center space-x-2 group"
          >
            <div className="relative">
              <Image
                src={assets.espesialLogo}
                alt="Espesyal Shop Logo"
                width={200}
                height={60}
                className="object-contain h-12 lg:h-14 w-auto transition-transform duration-300 group-hover:scale-105 filter brightness-110 contrast-110"
                priority
                quality={95}
              />
            </div>
          </Link>

          {!isDashboard ? (
            <>
              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-8">
                <div className="flex items-center space-x-8">
                  <Link
                    href={getLocalizedPath("/")}
                    className="relative text-gray-700 hover:text-primary transition-colors duration-300 font-medium group"
                  >
                    {t("home")}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                  <Link
                    href={getLocalizedPath("/shop")}
                    className="relative text-gray-700 hover:text-primary transition-colors duration-300 font-medium group"
                  >
                    {t("shop")}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                  <Link
                    href={getLocalizedPath("/about")}
                    className="relative text-gray-700 hover:text-primary transition-colors duration-300 font-medium group"
                  >
                    {t("about")}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                  <Link
                    href={getLocalizedPath("/contact")}
                    className="relative text-gray-700 hover:text-primary transition-colors duration-300 font-medium group"
                  >
                    {t("contact")}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </div>

                {/* Action Items */}
                <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-gray-200">
                  <LanguageSwitcher />
                  <Link
                    href={getLocalizedPath("/wishlist")}
                    className="relative p-2 text-gray-600 hover:text-primary transition-colors duration-300 group"
                  >
                    <Heart className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full text-xs text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {wishlistItemCount}
                    </span>
                  </Link>
                  <Link
                    href={getLocalizedPath("/cart")}
                    className="relative p-2 text-gray-600 hover:text-primary transition-colors duration-300 group"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full text-xs text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {cartItemCount}
                    </span>
                  </Link>

                  {session?.user && (
                    <Link
                      href={getLocalizedPath("/my-orders")}
                      className="p-2 text-gray-600 hover:text-primary transition-colors duration-300"
                      title={tOrders("myOrders")}
                    >
                      <Package className="w-5 h-5" />
                    </Link>
                  )}

                  {session?.user && (
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {session.user.name || session.user.email}
                      </span>
                    </div>
                  )}

                  {session?.user?.isAdmin && (
                    <Link
                      href={getLocalizedPath("/dashboard")}
                      className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white text-sm font-medium rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      {t("dashboard")}
                    </Link>
                  )}

                  <AuthButtons screen="desktop" />
                </div>
              </div>

              {/* Mobile/Tablet cart icon*/}
              <div className="flex items-center space-x-3 lg:hidden">
                {/* Language Switcher for Mobile */}
                <LanguageSwitcher />
                {/* Cart Icon for Small Screens */}
                <Link
                  href={getLocalizedPath("/cart")}
                  className="relative p-2 text-gray-600 hover:text-primary transition-colors duration-300 group"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full text-xs text-white flex items-center justify-center">
                    {cartItemCount}
                  </span>
                </Link>

                {/* Mobile Menu Button */}
                <ToggleMenuBtn
                  isMenuOpen={isMenuOpen}
                  toggleMenu={toggleMenu}
                />
              </div>

              {/* Mobile Menu */}
              <div
                className={`lg:hidden mobile-menu fixed inset-0 z-40 transition-all duration-300 ${
                  isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
              >
                {/* Backdrop */}
                <div
                  className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                  onClick={closeMenu}
                />

                {/* Menu Panel */}
                <div
                  className={`absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ${
                    isMenuOpen ? "translate-x-0" : "translate-x-full"
                  }`}
                >
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                      <span className="text-lg font-semibold text-gray-900">
                        Menu
                      </span>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex-1 px-6 py-8 space-y-6">
                      <Link
                        href={getLocalizedPath("/")}
                        className="block text-lg font-medium text-gray-700 hover:text-primary transition-colors duration-300"
                        onClick={closeMenu}
                      >
                        {t("home")}
                      </Link>
                      <Link
                        href={getLocalizedPath("/shop")}
                        className="block text-lg font-medium text-gray-700 hover:text-primary transition-colors duration-300"
                        onClick={closeMenu}
                      >
                        {t("shop")}
                      </Link>
                      <Link
                        href={getLocalizedPath("/about")}
                        className="block text-lg font-medium text-gray-700 hover:text-primary transition-colors duration-300"
                        onClick={closeMenu}
                      >
                        {t("about")}
                      </Link>
                      <Link
                        href={getLocalizedPath("/contact")}
                        className="block text-lg font-medium text-gray-700 hover:text-primary transition-colors duration-300"
                        onClick={closeMenu}
                      >
                        {t("contact")}
                      </Link>

                      {/* Mobile Action Items */}
                      <div className="flex items-center space-x-4 pt-6 border-t border-gray-200">
                        <Link
                          href={getLocalizedPath("/wishlist")}
                          className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors duration-300"
                          onClick={closeMenu}
                        >
                          <Heart className="w-5 h-5" />
                          <span>Wishlist</span>
                        </Link>
                        <Link
                          href={getLocalizedPath("/cart")}
                          className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors duration-300"
                          onClick={closeMenu}
                        >
                          <ShoppingCart className="w-5 h-5" />
                          <span>{t("cart")}</span>
                        </Link>
                        {session?.user && (
                          <Link
                            href={getLocalizedPath("/my-orders")}
                            className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors duration-300"
                            onClick={closeMenu}
                          >
                            <Package className="w-5 h-5" />
                            <span>{tOrders("myOrders")}</span>
                          </Link>
                        )}
                      </div>

                      {session?.user?.isAdmin && (
                        <Link
                          href={getLocalizedPath("/dashboard")}
                          className="block w-full px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white text-center font-medium rounded-lg hover:shadow-lg transition-all duration-300"
                          onClick={closeMenu}
                        >
                          Dashboard
                        </Link>
                      )}

                      <div className="pt-6 border-t border-gray-200">
                        <AuthButtons screen="mobile" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              {/* Dashboard Badge */}
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange/10 to-orange/5 border border-orange/20 rounded-xl">
                <div className="w-2 h-2 bg-orange rounded-full animate-pulse" />
                <span className="text-sm font-medium text-gray-700">
                  Admin Mode
                </span>
              </div>

              <LanguageSwitcher />

              {/* User Info */}
              {session?.user && (
                <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange to-orange/80 rounded-full flex items-center justify-center shadow-md">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-900 leading-tight">
                      {session.user.name || session.user.email?.split("@")[0]}
                    </span>
                    <span className="text-xs text-gray-500">Admin</span>
                  </div>
                </div>
              )}

              {/* Exit Button */}
              <Link
                href={getLocalizedPath("/")}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-50 hover:from-gray-200 hover:to-gray-100 text-gray-700 text-sm font-medium rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300 group"
              >
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span className="hidden sm:inline">Exit Dashboard</span>
                <span className="sm:hidden">Exit</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
});

UserNav.displayName = "UserNav";

export default UserNav;
