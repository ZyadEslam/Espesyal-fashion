"use client";
import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import { AddressProps } from "@/app/types/types";
import LoadingSpinner from "@/app/UI/LoadingSpinner";
import { api } from "@/app/utils/api";
import { useSession } from "next-auth/react";
const ErrorBox = lazy(() => import("@/app/UI/ErrorBox"));
const DropdownBtn = lazy(() => import("./DropdownBtn"));
const DropdownMenu = lazy(() => import("./DropdownMenu"));

export interface AddressSelectionProps {
  setSelectedAddress: (addrees: AddressProps) => void;
  selectedAddress: AddressProps;
  //   onAddressSelect?: (address: Address | null) => void;
  setSelectedAddressId?: (addreesId: string) => void;
}

const AddressSelection = ({
  //   onAddressSelect,
  setSelectedAddress,
  selectedAddress,
}: AddressSelectionProps) => {
  const [addresses, setAddresses] = useState<AddressProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const session = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true);
        const result = await api.getAddresses();
        const { addresses: fetchedAddresses } = await result?.json();
        if (fetchedAddresses) {
          setAddresses(fetchedAddresses);
        }
      } catch (error) {
        setError("Failed to fetch addresses");
        console.error("Error fetching addresses:", error);
      } finally {
        setLoading(false);
      }
    };
    if (session.status === "authenticated") {
      fetchAddresses();
    } else {
      setLoading(false);
      setError("Please login to select address");
    }
  }, [session.status]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddressSelect = (address: AddressProps) => {
    setSelectedAddress(address);
    // onAddressSelect?.(address);
    setIsOpen(false);
  };

  const handleDeleteAddress = async (
    addressId: string,
    event: React.MouseEvent
  ) => {
    // Prevent dropdown from closing
    event.stopPropagation();

    if (!confirm("Are you sure you want to delete this address?")) {
      return;
    }

    try {
      const response = await fetch(`/api/order-address?id=${addressId}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (result.success) {
        // Remove from local state
        setAddresses((prev) => prev.filter((addr) => addr._id !== addressId));

        // If deleted address was selected, clear selection
        if (selectedAddress && selectedAddress._id === addressId) {
          setSelectedAddress({} as AddressProps);
        }
      } else {
        alert(result.message || "Failed to delete address");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      alert("Failed to delete address");
    }
  };

  const handleDropdownToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleRetry = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Re-fetch addresses
    const fetchAddresses = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/order-address");
        const result = await response.json();

        if (result.success) {
          setAddresses(result.addresses);
        } else {
          setError(result.message || "Failed to fetch addresses");
        }
      } catch (error) {
        setError("Failed to fetch addresses");
        console.error("Error fetching addresses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <LoadingSpinner />
        <span className="ml-2 text-orange">Loading addresses...</span>
      </div>
    );
  }

  if (error) {
    console.log(error);
    return (
      <Suspense>
        {session.status === "unauthenticated" ? (
          <ErrorBox errorMessage={error} />
        ) : (
          <ErrorBox
            errorMessage="Failed to load addresses, please try again."
            tryAgainHandler={handleRetry}
          />
        )}
      </Suspense>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        Shipping Address
      </h3>

      {/* Dropdown Button */}
      <Suspense>
        <DropdownBtn
          isOpen={isOpen}
          handleDropdownToggle={handleDropdownToggle}
          selectedAddress={selectedAddress}
        />
      </Suspense>

      {/* Dropdown Menu */}
      {isOpen && (
        <Suspense>
          <DropdownMenu
            addresses={addresses}
            handleAddressSelect={handleAddressSelect}
            selectedAddress={selectedAddress}
            handleDeleteAddress={handleDeleteAddress}
            setIsOpen={setIsOpen}
          />
        </Suspense>
      )}
    </div>
  );
};

export default AddressSelection;
