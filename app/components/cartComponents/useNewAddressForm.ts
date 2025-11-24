"use client";

import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useMemo,
  useState,
} from "react";
import { AddressProps } from "@/app/types/types";

export interface AddressFormValues {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
}

export const initialFormValues: AddressFormValues = {
  name: "",
  phone: "",
  address: "",
  city: "",
  state: "",
};

interface UseNewAddressFormParams {
  onClose: () => void;
  onSuccess: (address: AddressProps) => void;
}

const useNewAddressForm = ({
  onClose,
  onSuccess,
}: UseNewAddressFormParams) => {
  const [formValues, setFormValues] =
    useState<AddressFormValues>(initialFormValues);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSubmitDisabled = useMemo(() => {
    return (
      submitting || Object.values(formValues).some((value) => !value.trim())
    );
  }, [formValues, submitting]);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setFormValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      event.stopPropagation();
      if (isSubmitDisabled) {
        return;
      }

      setSubmitting(true);
      setError(null);

      let shouldCloseModal = false;

      try {
        const response = await fetch("/api/order-address", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formValues),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to create address");
        }

        const createdAddress: AddressProps = {
          _id: result.address._id,
          name: result.address.name,
          phone: result.address.phone,
          address: result.address.address,
          city: result.address.city,
          state: result.address.state,
        };

        onSuccess(createdAddress);
        shouldCloseModal = true;
      } catch (submissionError) {
        const message =
          submissionError instanceof Error
            ? submissionError.message
            : "Failed to create address. Please try again.";
        setError(message);
      } finally {
        setSubmitting(false);
        if (shouldCloseModal) {
          onClose();
        }
      }
    },
    [formValues, isSubmitDisabled, onClose, onSuccess]
  );

  const resetForm = useCallback(() => {
    setFormValues(initialFormValues);
    setError(null);
    setSubmitting(false);
  }, []);

  return {
    error,
    formValues,
    handleChange,
    handleSubmit,
    isSubmitDisabled,
    resetForm,
    submitting,
  };
};

export default useNewAddressForm;

