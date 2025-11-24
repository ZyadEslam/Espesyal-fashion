"use client";
import React, { useRef, useEffect, useActionState } from "react";
import { motion } from "framer-motion";
import { shippingFormAction } from "@/app/utils/actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SubmitButton from "./SubmitBtn";
import { useSession } from "next-auth/react";
import ActionNotification from "@/app/UI/ActionNotification";
import { ArrowLeft, LocationEdit } from "lucide-react";
import LoadingOverlay from "../LoadingOverlay";
import { useLocale, useTranslations } from "next-intl";

const initialState = {
  success: false,
  message: "",
};

const ShippingFormComponent = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [countdown, setCountdown] = React.useState(3);
  const [formState, formAction] = useActionState(
    shippingFormAction,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);
  const { data: session } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("shipping");
  const tForm = useTranslations("shipping.form");

  useEffect(() => {
    if (formState.success) {
      formRef.current?.reset();

      // Countdown and redirect after 3 seconds
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            router.push(`/${locale}/cart`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearInterval(countdownInterval);
        setCountdown(3);
      };
    }

    setIsLoading(false);
  }, [formState.success, router, locale]);

  const submitHandler = () => {
    setIsLoading(true);
  };

  if (!session) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-400 rounded-md">
        <p className="text-yellow-700">{t("loginRequired")}</p>
      </div>
    );
  }

  return (
    <>
      <LoadingOverlay
        isVisible={isLoading}
        message={t("creatingAddress")}
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
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-green-800 font-medium mb-2">
                ✓ {t("addressCreatedSuccess")}
              </p>
              <p className="text-sm text-green-700">
                {t("redirectingToCart", {
                  countdown,
                  seconds: countdown === 1 ? t("second") : t("seconds"),
                })}
              </p>
              <Link
                href={`/${locale}/cart`}
                className="flex items-center text-orange mt-3 gap-2 hover:text-orange/80 text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" /> {t("goToCartNow")}
              </Link>
            </div>
          )}
          <div>
            <label htmlFor="name" className="address-form-label">
              {tForm("fullNameRequired")}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="address-form-input"
              placeholder={tForm("fullNamePlaceholder")}
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="address-form-label">
              {tForm("phoneNumberRequired")}
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="address-form-input"
              placeholder={tForm("phoneNumberPlaceholder")}
              required
            />
          </div>

          <div>
            <label htmlFor="address" className="address-form-label">
              {tForm("streetAddressRequired")}
            </label>
            <input
              type="text"
              id="address"
              name="address"
              className="address-form-input"
              placeholder={tForm("streetAddressPlaceholder")}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="address-form-label">
                {tForm("cityRequired")}
              </label>
              <input
                type="text"
                id="city"
                name="city"
                className="address-form-input"
                placeholder={tForm("cityPlaceholder")}
                required
              />
            </div>

            <div>
              <label htmlFor="state" className="address-form-label">
                {tForm("stateRequired")}
              </label>
              <input
                type="text"
                id="state"
                name="state"
                className="address-form-input"
                placeholder={tForm("statePlaceholder")}
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
