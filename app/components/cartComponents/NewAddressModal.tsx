"use client";

import React, { useEffect, useState } from "react";
import { AddressProps } from "@/app/types/types";
import { useLocale, useTranslations } from "next-intl";
import { createPortal } from "react-dom";
import NewAddressModalForm from "./NewAddressModalForm";
import useNewAddressForm from "./useNewAddressForm";

interface NewAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (address: AddressProps) => void;
}

const NewAddressModal = ({
  isOpen,
  onClose,
  onSuccess,
}: NewAddressModalProps) => {
  const t = useTranslations("shipping");
  const tForm = useTranslations("shipping.form");
  const tSubmit = useTranslations("shipping.submit");
  const locale = useLocale();
  const isArabic = locale?.startsWith("ar");
  const labelClassName = `address-form-label ${isArabic ? "text-base" : ""}`;

  const [isMounted, setIsMounted] = useState(false);
  const {
    error,
    formValues,
    handleChange,
    handleSubmit,
    isSubmitDisabled,
    resetForm,
    submitting,
  } = useNewAddressForm({
    onClose,
    onSuccess,
  });

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  if (!isMounted || !isOpen) {
    return null;
  }

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[1500] flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-16"
      onMouseDown={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <NewAddressModalForm
        error={error}
        formValues={formValues}
        isSubmitDisabled={isSubmitDisabled}
        labelClassName={labelClassName}
        onChange={handleChange}
        onClose={onClose}
        onContentMouseDown={(event) => event.stopPropagation()}
        onSubmit={handleSubmit}
        submitting={submitting}
        t={t}
        tForm={tForm}
        tSubmit={tSubmit}
      />
    </div>,
    document.body
  );
};

export default NewAddressModal;
