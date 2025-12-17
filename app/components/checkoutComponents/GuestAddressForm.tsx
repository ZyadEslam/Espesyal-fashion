"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { AddressProps } from "@/app/types/types";

interface GuestAddressFormProps {
  onAddressChange: (address: AddressProps | null) => void;
  initialAddress?: AddressProps | null;
}

const GuestAddressForm = ({
  onAddressChange,
  initialAddress,
}: GuestAddressFormProps) => {
  const tShipping = useTranslations("shipping");
  const tCheckout = useTranslations("checkout");
  const [formData, setFormData] = useState({
    name: initialAddress?.name || "",
    phone: initialAddress?.phone || "",
    address: initialAddress?.address || "",
    city: initialAddress?.city || "",
    state: initialAddress?.state || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    // Validate and update parent
    validateAndUpdate({ ...formData, [name]: value });
  };

  const validateAndUpdate = (data = formData) => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (!data.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }
    if (!data.phone.trim()) {
      newErrors.phone = "Phone is required";
      isValid = false;
    }
    if (!data.address.trim()) {
      newErrors.address = "Address is required";
      isValid = false;
    }
    if (!data.city.trim()) {
      newErrors.city = "City is required";
      isValid = false;
    }
    if (!data.state.trim()) {
      newErrors.state = "State is required";
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      // Create address object (without _id since it's temporary)
      const address: AddressProps = {
        _id: `temp-${Date.now()}`,
        name: data.name,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
      };
      onAddressChange(address);
    } else {
      onAddressChange(null);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {tCheckout("addressForOrder")}
      </h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {tShipping("form.fullNameRequired")}
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder={tShipping("form.fullNamePlaceholder")}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {tShipping("form.phoneNumberRequired")}
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder={tShipping("form.phoneNumberPlaceholder")}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange ${
            errors.phone ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.phone && (
          <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {tShipping("form.streetAddressRequired")}
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder={tShipping("form.streetAddressPlaceholder")}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange ${
            errors.address ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.address && (
          <p className="text-red-500 text-xs mt-1">{errors.address}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {tShipping("form.cityRequired")}
        </label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder={tShipping("form.cityPlaceholder")}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange ${
            errors.city ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.city && (
          <p className="text-red-500 text-xs mt-1">{errors.city}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {tShipping("form.stateRequired")}
        </label>
        <input
          type="text"
          name="state"
          value={formData.state}
          onChange={handleChange}
          placeholder={tShipping("form.statePlaceholder")}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange ${
            errors.state ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.state && (
          <p className="text-red-500 text-xs mt-1">{errors.state}</p>
        )}
      </div>
    </div>
  );
};

export default GuestAddressForm;
