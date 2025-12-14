"use client";
import Link from "next/link";
import React, { memo, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Plus,
  List,
  ShoppingBag,
  Settings,
  Users,
  Tag,
  FolderTree,
  Home,
  Truck,
} from "lucide-react";
import { cachedFetch } from "@/app/utils/cachedFetch";
import { useLocale, useTranslations } from "next-intl";
import { useDashboardMenu } from "@/app/context/dashboardMenuCtx";

const sideNavLinks = [
  {
    href: "/dashboard",
    icon: Plus,
    translationKey: "addProduct",
  },
  {
    href: "/dashboard/product-list",
    icon: List,
    translationKey: "productList",
  },
  {
    href: "/dashboard/categories",
    icon: FolderTree,
    translationKey: "categories",
  },
  {
    href: "/dashboard/orders",
    icon: ShoppingBag,
    translationKey: "orders",
  },
  {
    href: "/dashboard/promo-codes",
    icon: Tag,
    translationKey: "promoCodes",
  },
  {
    href: "/dashboard/admin-management",
    icon: Users,
    translationKey: "adminManagement",
  },
  {
    href: "/dashboard/hero-section",
    icon: Home,
    translationKey: "offerSection",
  },
  {
    href: "/dashboard/shipping-settings",
    icon: Truck,
    translationKey: "shippingSettings",
  },
];

const DashboardSideNav = memo(() => {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("dashboard.nav.links");
  const isArabic = locale.startsWith("ar");
  const { isDashboardMenuOpen, setIsDashboardMenuOpen } = useDashboardMenu();
  const prefetchedRef = React.useRef(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsDashboardMenuOpen(false);
    // Reset prefetch flag when route changes
    prefetchedRef.current = false;
  }, [pathname, setIsDashboardMenuOpen]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsDashboardMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [setIsDashboardMenuOpen]);

  const handlePrefetch = React.useCallback(() => {
    // Only prefetch once per session
    if (prefetchedRef.current) return;
    prefetchedRef.current = true;

    // Prefetch both products and categories in parallel with caching
    Promise.all([
      cachedFetch("/api/product", { cache: "default" }).catch(() => {}),
      cachedFetch("/api/categories", { cache: "default" }).catch(() => {}),
    ]);
  }, []);

  return (
    <>
      {/* Mobile Overlay */}
      {isDashboardMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsDashboardMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 h-screen w-64 bg-white/95 backdrop-blur-md border-r border-gray-200 shadow-xl z-50 transition-transform duration-300 ${
          isDashboardMenuOpen
            ? "translate-x-0"
            : isArabic
            ? "translate-x-full lg:translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        } ${isArabic ? "right-0" : "left-0"}`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-orange/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange to-orange/80 rounded-xl flex items-center justify-center shadow-md">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {isArabic ? "لوحة التحكم" : "Dashboard"}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {isArabic ? "لوحة الإدارة" : "Admin Panel"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 overflow-y-auto h-[calc(100vh-180px)]">
          <div className="space-y-1.5">
            {sideNavLinks.map((link) => {
              const IconComponent = link.icon;
              const localizedHref = `/${locale}${link.href}`;
              const isRootLink = link.href === "/dashboard";
              const isActive = isRootLink
                ? pathname === localizedHref || pathname === `${localizedHref}/`
                : pathname === localizedHref ||
                  pathname.startsWith(`${localizedHref}/`);
              const displayLabel = t(link.translationKey);

              return (
                <Link
                  key={link.href}
                  href={localizedHref}
                  prefetch={true}
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                    isActive
                      ? "bg-gradient-to-r from-orange to-orange/90 text-white shadow-md shadow-orange/20"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  onMouseEnter={
                    link.href === "/dashboard/product-list"
                      ? handlePrefetch
                      : undefined
                  }
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                  )}
                  <IconComponent
                    className={`w-5 h-5 transition-all duration-300 ${
                      isActive
                        ? "text-white scale-110"
                        : "text-gray-500 group-hover:text-orange group-hover:scale-110"
                    }`}
                  />
                  <span className="font-medium text-sm">{displayLabel}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50/50 to-transparent backdrop-blur-sm">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 bg-gradient-to-br from-orange/10 to-orange/5 rounded-lg flex items-center justify-center border border-orange/20">
              <Settings className="w-4 h-4 text-orange" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Admin Access</p>
              <p className="text-xs text-gray-500">
                {isArabic ? "لوحة آمنة" : "Secure Panel"}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
});

DashboardSideNav.displayName = "DashboardSideNav";

export default DashboardSideNav;
