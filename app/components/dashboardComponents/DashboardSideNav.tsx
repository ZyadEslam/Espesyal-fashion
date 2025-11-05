"use client";
import Link from "next/link";
import React, { memo } from "react";
import { usePathname } from "next/navigation";
import { Plus, List, ShoppingBag, Settings, Users } from "lucide-react";

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
    href: "/dashboard/admin-management",
    icon: Users,
    label: "Admin Management",
  },
];

const DashboardSideNav = memo(() => {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-64 relative bg-white border-r border-gray-200 shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange/10 rounded-lg flex items-center justify-center">
            <Settings className="w-4 h-4 text-orange" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Dashboard</h2>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="p-4">
        <div className="space-y-2">
          {sideNavLinks.map((link) => {
            const IconComponent = link.icon;
            const isActive = pathname === link.href || pathname.endsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-orange text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
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
  );
});

DashboardSideNav.displayName = "DashboardSideNav";

export default DashboardSideNav;
