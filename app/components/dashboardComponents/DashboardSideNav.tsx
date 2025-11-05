"use client";
import Link from "next/link";
import React, { memo, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Plus, List, ShoppingBag, Settings, Users, Tag, Menu, X } from "lucide-react";
import { cachedFetch } from "@/app/utils/cachedFetch";

const sideNavLinks = [
  {
    href: "/dashboard",
    icon: Plus,
    label: "Add Product",
  },
  {
    href: "/dashboard/product-list",
    icon: List,
    label: "Products List",
  },
  {
    href: "/dashboard/orders",
    icon: ShoppingBag,
    label: "Orders",
  },
  {
    href: "/dashboard/promo-codes",
    icon: Tag,
    label: "Promo Codes",
  },
  {
    href: "/dashboard/admin-management",
    icon: Users,
    label: "Admin Management",
  },
];

const DashboardSideNav = memo(() => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const prefetchedRef = React.useRef(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    // Reset prefetch flag when route changes
    prefetchedRef.current = false;
  }, [pathname]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const handlePrefetch = React.useCallback(() => {
    // Only prefetch once per session
    if (prefetchedRef.current) return;
    prefetchedRef.current = true;
    
    // Prefetch both products and categories in parallel with caching
    Promise.all([
      cachedFetch("/api/product", { cache: 'default' }).catch(() => {}),
      cachedFetch("/api/categories", { cache: 'default' }).catch(() => {})
    ]);
  }, []);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <X className="w-5 h-5 text-gray-700" />
        ) : (
          <Menu className="w-5 h-5 text-gray-700" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static h-screen w-64 bg-white border-r border-gray-200 shadow-sm z-40 transition-transform duration-300 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="p-4 lg:p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange/10 rounded-lg flex items-center justify-center">
              <Settings className="w-4 h-4 text-orange" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Dashboard</h2>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 overflow-y-auto h-[calc(100vh-140px)]">
          <div className="space-y-2">
            {sideNavLinks.map((link) => {
              const IconComponent = link.icon;
              const isActive = pathname === link.href || pathname.endsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={true}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "bg-orange text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                  onMouseEnter={link.href === "/dashboard/product-list" ? handlePrefetch : undefined}
                >
                  <IconComponent
                    className={`w-5 h-5 transition-colors duration-200 ${
                      isActive
                        ? "text-white"
                        : "text-gray-500 group-hover:text-gray-700"
                    }`}
                  />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50/50">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="w-6 h-6 bg-orange/10 rounded-full flex items-center justify-center">
              <Settings className="w-3 h-3 text-orange" />
            </div>
            <span>Admin Panel</span>
          </div>
        </div>
      </aside>
    </>
  );
});

DashboardSideNav.displayName = "DashboardSideNav";

export default DashboardSideNav;
