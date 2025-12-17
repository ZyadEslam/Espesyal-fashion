"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { AddressProps } from "@/app/types/types";
import GuestAddressForm from "./GuestAddressForm";
import { api } from "@/app/utils/api";
import LoadingSpinner from "@/app/UI/LoadingSpinner";

interface CheckoutAddressSectionProps {
  onAddressChange: (address: AddressProps | null) => void;
  selectedAddress?: AddressProps | null;
}

const CheckoutAddressSection = ({
  onAddressChange,
  selectedAddress,
}: CheckoutAddressSectionProps) => {
  const session = useSession();
  const tCheckout = useTranslations("checkout");
  // const tShipping = useTranslations("shipping");
  const [addresses, setAddresses] = useState<AddressProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [useSavedAddress, setUseSavedAddress] = useState(true);
  const [manualAddress, setManualAddress] = useState<AddressProps | null>(null);
  const [hasUserChosenManual, setHasUserChosenManual] = useState(false);

  const fetchAddresses = useCallback(async () => {
    try {
      setLoading(true);
      const result = await api.getAddresses();
      const { addresses: fetchedAddresses } = await result?.json();
      if (fetchedAddresses && fetchedAddresses.length > 0) {
        setAddresses(fetchedAddresses);
        // Auto-select first address only on initial load (when user hasn't chosen manual entry)
        // Don't override user's choice to enter new address
        if (!selectedAddress && !hasUserChosenManual) {
          onAddressChange(fetchedAddresses[0]);
          setUseSavedAddress(true);
        }
      } else {
        // No saved addresses, use manual entry
        setUseSavedAddress(false);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      setUseSavedAddress(false);
    } finally {
      setLoading(false);
    }
  }, [selectedAddress, onAddressChange, hasUserChosenManual]);

  useEffect(() => {
    if (session.status === "authenticated") {
      fetchAddresses();
    } else {
      // For guests, always use manual entry
      setUseSavedAddress(false);
    }
  }, [session.status, fetchAddresses]);

  const handleSavedAddressSelect = (address: AddressProps) => {
    onAddressChange(address);
  };

  const handleManualAddressChange = (address: AddressProps | null) => {
    setManualAddress(address);
    onAddressChange(address);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner />
        <span className="ml-2 text-gray-600">Loading addresses...</span>
      </div>
    );
  }

  // For guests, only show manual form
  if (session.status === "unauthenticated") {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <GuestAddressForm
          onAddressChange={handleManualAddressChange}
          initialAddress={manualAddress || undefined}
        />
      </div>
    );
  }

  // For logged-in users, show options
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        {tCheckout("addressForOrder")}
      </h2>

      {/* Toggle between saved and manual */}
      {addresses.length > 0 && (
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => {
              setUseSavedAddress(true);
              setHasUserChosenManual(false);
              if (addresses.length > 0 && !selectedAddress) {
                onAddressChange(addresses[0]);
              }
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              useSavedAddress
                ? "bg-orange text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tCheckout("useSavedAddress")}
          </button>
          <button
            onClick={() => {
              setUseSavedAddress(false);
              setHasUserChosenManual(true);
              setManualAddress(null);
              onAddressChange(null);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              !useSavedAddress
                ? "bg-orange text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tCheckout("enterNewAddress")}
          </button>
        </div>
      )}

      {/* Saved Address Selection */}
      {useSavedAddress && addresses.length > 0 && (
        <div className="space-y-3">
          {addresses.map((address: AddressProps) => (
            <div
              key={address._id}
              onClick={() => handleSavedAddressSelect(address)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedAddress?._id === address._id
                  ? "border-orange bg-orange/5"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${
                    selectedAddress?._id === address._id
                      ? "border-orange bg-orange"
                      : "border-gray-300"
                  }`}
                >
                  {selectedAddress?._id === address._id && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{address.name}</p>
                  <p className="text-sm text-gray-600">{address.phone}</p>
                  <p className="text-sm text-gray-600">
                    {address.address}, {address.city}, {address.state}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Manual Address Form */}
      {!useSavedAddress && (
        <GuestAddressForm
          onAddressChange={handleManualAddressChange}
          initialAddress={manualAddress || undefined}
        />
      )}
    </div>
  );
};

export default CheckoutAddressSection;
