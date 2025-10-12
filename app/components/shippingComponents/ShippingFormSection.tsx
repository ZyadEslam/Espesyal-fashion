"use client";
import React, { useRef, useEffect, useActionState } from "react";
import { motion } from "framer-motion";
import { shippingFormAction } from "@/app/utils/actions";
import Link from "next/link";
import SubmitButton from "./SubmitBtn";
import { useSession } from "next-auth/react";
import ActionNotification from "@/app/UI/ActionNotification";
import { ArrowLeft, LocationEdit } from "lucide-react";
import LoadingOverlay from "../LoadingOverlay";

const initialState = {
  success: false,
  message: "",
};

const ShippingFormComponent = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [formState, formAction] = useActionState(
    shippingFormAction,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (formState.success) {
      formRef.current?.reset();
    }

    setIsLoading(false);
  }, [formState.success]);

  const submitHandler = () => {
    setIsLoading(true);
  };

  if (!session) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-400 rounded-md">
        <p className="text-yellow-700">
          Please log in to save your shipping addresses.
        </p>
      </div>
    );
  }

  return (
    <>
      <LoadingOverlay
        isVisible={isLoading}
        message="Creating Your New Address..."
        icon={<LocationEdit />}
      />
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        <form
          ref={formRef}
          action={formAction}
          className="space-y-5 md:w-[80%] sm:mb-5 md:mb-0"
          onSubmit={submitHandler}
        >
          <ActionNotification {...formState} />
          {formState.success && (
            <Link
              href="/cart"
              className="flex items-center text-orange mb-4 gap-2 hover:text-orange/80"
            >
              <ArrowLeft /> Back To Cart
            </Link>
          )}
          <div>
            <label htmlFor="name" className="address-form-label">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="address-form-input"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="address-form-label">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="address-form-input"
              placeholder="1234567890"
              required
            />
          </div>

          <div>
            <label htmlFor="pinCode" className="address-form-label">
              Pin Code *
            </label>
            <input
              type="text"
              id="pinCode"
              name="pinCode"
              className="address-form-input"
              placeholder="12345"
              required
            />
          </div>

          <div>
            <label htmlFor="address" className="address-form-label">
              Street Address *
            </label>
            <input
              type="text"
              id="address"
              name="address"
              className="address-form-input"
              placeholder="123 Main Street, Apartment 4B"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="address-form-label">
                City *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                className="address-form-input"
                placeholder="New York"
                required
              />
            </div>

            <div>
              <label htmlFor="state" className="address-form-label">
                State *
              </label>
              <input
                type="text"
                id="state"
                name="state"
                className="address-form-input"
                placeholder="NY"
                required
              />
            </div>
          </div>

          <SubmitButton />
        </form>
      </motion.div>
    </>
  );
};

export default ShippingFormComponent;
