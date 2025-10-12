import React from "react";

const ToggleMenuBtn = ({
  isMenuOpen,
  toggleMenu,
}: {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}) => {
  return (
    <button
      className="md:hidden sm:order-3 md:order-auto flex flex-col justify-center items-center w-8 h-8 space-y-1.5 z-50"
      onClick={toggleMenu}
      suppressHydrationWarning
    >
      <span
        className={`block w-6 h-0.5 bg-gray-600 transition-transform duration-300 ${
          isMenuOpen ? "rotate-45 translate-y-2" : ""
        }`}
      ></span>
      <span
        className={`block w-6 h-0.5 bg-gray-600 transition-opacity duration-300 ${
          isMenuOpen ? "opacity-0" : "opacity-100"
        }`}
      ></span>
      <span
        className={`block w-6 h-0.5 bg-gray-600 transition-transform duration-300 ${
          isMenuOpen ? "-rotate-45 -translate-y-2" : ""
        }`}
      ></span>
    </button>
  );
};

export default ToggleMenuBtn;
