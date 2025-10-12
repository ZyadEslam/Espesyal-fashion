import React from "react";
import Link from "next/link";
import { AddressProps } from "@/app/types/types";

interface dropDownMenuProps {
  addresses: AddressProps[];
  handleAddressSelect(address: AddressProps): void;
  selectedAddress: AddressProps;
  handleDeleteAddress(addressId: string, event: React.MouseEvent): void;
  setIsOpen(value: boolean): void;
}
const DropdownMeu = ({
  addresses,
  handleAddressSelect,
  selectedAddress,
  handleDeleteAddress,
  setIsOpen,
}: dropDownMenuProps) => {
  return (
    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
      {addresses.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          <p>No addresses found.</p>
        </div>
      ) : (
        <div className="py-2">
          {addresses.map((address) => (
            <div key={address._id} className="relative group">
              <button
                type="button"
                onClick={() => handleAddressSelect(address)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                  selectedAddress && selectedAddress._id === address._id
                    ? "bg-orange/10 border-l-4 border-orange"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {address.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {address.address}
                    </div>
                    <div className="text-sm text-gray-600">
                      {address.city}, {address.state} {address.pinCode}
                    </div>
                    <div className="text-sm text-gray-600">
                      Phone: {address.phone}
                    </div>
                  </div>

                  {/* Delete Button */}
                  <p
                    onClick={(e) => handleDeleteAddress(address._id, e)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                    title="Delete address"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </p>
                </div>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add New Address Link */}
      <div className="border-t border-gray-200">
        <Link
          href="/shipping-address"
          className="block px-4 py-3 text-orange hover:bg-orange/10 transition-colors"
          onClick={() => setIsOpen(false)}
        >
          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add New Address
          </div>
        </Link>
      </div>
    </div>
  );
};

export default DropdownMeu;
