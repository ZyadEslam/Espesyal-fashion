"use client";

import React, { memo } from "react";
import LanguageSwitcher from "./LanguageSwitcher";

const TopNav = memo(() => {

  return (
    // <nav className="py-1 border-b border-black/20 bg-gradient-to-br from-primary-400 to-primary-500">
    <nav className="py-1 border-b border-black/20">
      <div className="w-[95%] mx-auto sm:container sm:mx-auto sm:px-6 lg:px-8">
        <div className="flex items-center w-full justify-end">
          <div>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
});

TopNav.displayName = "TopNav";

export default TopNav;
