"use client";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { assets } from "@/public/assets/assets";
import { usePathname } from "next/navigation";
const sideNavLinks = [
  {
    href: "/dashboard",
    icon: assets.add_icon,
    label: "Add Product",
  },
  {
    href: "/dashboard/product-list",
    icon: assets.product_list_icon,
    label: "Products List",
  },
  {
    href: "/dashboard/orders",
    icon: assets.order_icon,
    label: "Orders",
  },
];
const DashboardSideNav = () => {
  const pathname = usePathname();
  return (
    <aside className="h-screen md:w-[15%] sm:w-[30%] border-r border-gray-200">
      <div className="flex flex-col py-2 ">
        {sideNavLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`side-nav-link ${
              pathname === link.href && "side-nav-link-active"
            } hover:bg-gray-100`}
          >
            <Image src={link.icon} alt="Logo" width={28} height={28} />
            <span className="sm:hidden md:block">{link.label}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
};

export default DashboardSideNav;
