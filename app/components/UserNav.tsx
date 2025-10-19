"use client";
import React, { useState, useEffect, useCallback, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { assets } from "@/public/assets/assets";
import { AuthButtons, ToggleMenuBtn } from "./";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Heart, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/app/hooks/useCart";
import { useWishlist } from "@/app/hooks/useWishlist";

const UserNav = memo(() => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session } = useSession();
  const { getCartItemCount } = useCart();
  const cartItemCount = getCartItemCount();
  const { getWishlistItemCount } = useWishlist();
  const wishlistItemCount = getWishlistItemCount();

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
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200"
          : "bg-white border-b border-gray-200"
      }`}
    >
      <div className={`container mx-auto px-4 max-w-7xl`}>
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
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
                    href="/"
                    className="relative text-gray-700 hover:text-primary transition-colors duration-300 font-medium group"
                  >
                    Home
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                  <Link
                    href="/shop"
                    className="relative text-gray-700 hover:text-primary transition-colors duration-300 font-medium group"
                  >
                    Shop
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                  <Link
                    href="/about"
                    className="relative text-gray-700 hover:text-primary transition-colors duration-300 font-medium group"
                  >
                    About Us
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                  <Link
                    href="/contact"
                    className="relative text-gray-700 hover:text-primary transition-colors duration-300 font-medium group"
                  >
                    Contact
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </div>

                {/* Action Items */}
                <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-gray-200">
                  <Link
                    href="/wishlist"
                    className="relative p-2 text-gray-600 hover:text-primary transition-colors duration-300 group"
                  >
                    <Heart className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full text-xs text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {wishlistItemCount}
                    </span>
                  </Link>
                  <Link
                    href="/cart"
                    className="relative p-2 text-gray-600 hover:text-primary transition-colors duration-300 group"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full text-xs text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {cartItemCount}
                    </span>
                  </Link>

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
                      href="/dashboard"
                      className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white text-sm font-medium rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      Dashboard
                    </Link>
                  )}

                  <AuthButtons screen="desktop" />
                </div>
              </div>

              {/* Mobile/Tablet cart icon*/}
              <div className="flex items-center space-x-3 lg:hidden">
                {/* Cart Icon for Small Screens */}
                <Link
                  href="/cart"
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
                        href="/"
                        className="block text-lg font-medium text-gray-700 hover:text-primary transition-colors duration-300"
                        onClick={closeMenu}
                      >
                        Home
                      </Link>
                      <Link
                        href="/shop"
                        className="block text-lg font-medium text-gray-700 hover:text-primary transition-colors duration-300"
                        onClick={closeMenu}
                      >
                        Shop
                      </Link>
                      <Link
                        href="/about"
                        className="block text-lg font-medium text-gray-700 hover:text-primary transition-colors duration-300"
                        onClick={closeMenu}
                      >
                        About Us
                      </Link>
                      <Link
                        href="/contact"
                        className="block text-lg font-medium text-gray-700 hover:text-primary transition-colors duration-300"
                        onClick={closeMenu}
                      >
                        Contact
                      </Link>

                      {/* Mobile Action Items */}
                      <div className="flex items-center space-x-4 pt-6 border-t border-gray-200">
                        <Link
                          href="/wishlist"
                          className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors duration-300"
                          onClick={closeMenu}
                        >
                          <Heart className="w-5 h-5" />
                          <span>Wishlist</span>
                        </Link>
                        <Link
                          href="/cart"
                          className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors duration-300"
                          onClick={closeMenu}
                        >
                          <ShoppingCart className="w-5 h-5" />
                          <span>Cart</span>
                        </Link>
                      </div>

                      {session?.user?.isAdmin && (
                        <Link
                          href="/dashboard"
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
            <Link
              href="/"
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Exit Admin Mode
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
});

UserNav.displayName = "UserNav";

export default UserNav;
