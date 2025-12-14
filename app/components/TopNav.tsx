"use client";

import React, { memo } from "react";
import { useLocale } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";

const TopNav = memo(() => {
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <nav className="py-1 border-b border-black/20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center w-full">
          <div className={`${isRTL ? "ml-auto" : ""}`}>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
});

TopNav.displayName = "TopNav";

export default TopNav;
