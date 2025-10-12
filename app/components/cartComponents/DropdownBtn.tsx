import { AddressProps } from "@/app/types/types";
import React from "react";

interface dropDownProps {
  handleDropdownToggle(e: React.MouseEvent): void;
  selectedAddress: AddressProps;
  isOpen: boolean;
}

const DropdownBtn = ({
  handleDropdownToggle,
  selectedAddress,
  isOpen,
}: dropDownProps) => {
  return (
    <button
      type="button"
      onClick={handleDropdownToggle}
      className="w-full p-3 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between hover:border-orange/30 focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
    >
      <div className="flex-1">
        {selectedAddress && selectedAddress._id ? (
          <div>
            <div className="font-medium text-gray-900">
              {selectedAddress.name}
            </div>
            <div className="text-sm text-gray-600">
              {selectedAddress.address}, {selectedAddress.city},{" "}
              {selectedAddress.state} {selectedAddress.pinCode}
            </div>
          </div>
        ) : (
          <span className="text-gray-500">Select a shipping address</span>
        )}
      </div>
      <svg
        className={`w-5 h-5 text-gray-400 transition-transform ${
          isOpen ? "rotate-180" : ""
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>
  );
};

export default DropdownBtn;
