"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Loader2, CreditCard } from "lucide-react";
import { useTranslations } from "next-intl";

interface PaymobPaymentFormProps {
  amount: number;
  billingData: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    state: string;
  };
  orderId?: string;
  onPaymentSuccess: (transactionId: string, paymobOrderId: string) => void;
  onPaymentError: (error: string) => void;
}

const PaymobPaymentForm = ({
  amount,
  billingData,
  orderId,
  onPaymentSuccess,
  onPaymentError,
}: PaymobPaymentFormProps) => {
  const t = useTranslations("checkout");
  const tCommon = useTranslations("common");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Check URL params for payment callback (when user returns from Paymob)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const success = urlParams.get("success");
      const transactionId = urlParams.get("id");
      const paymobOrderId = sessionStorage.getItem("pendingPaymobOrderId");

      if (success === "true" && transactionId) {
        onPaymentSuccess(transactionId, paymobOrderId || "");
        sessionStorage.removeItem("pendingPaymobOrderId");
      } else if (success === "false") {
        onPaymentError("Payment was not completed");
      }
    }
  }, [onPaymentSuccess, onPaymentError]);

  // Initialize and redirect to Paymob payment page
  const handlePayment = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/paymob/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          billingData: {
            name: billingData.name,
            firstName: billingData.name.split(" ")[0],
            lastName: billingData.name.split(" ").slice(1).join(" ") || "N/A",
            phone: billingData.phone,
            email: billingData.email,
            address: billingData.address,
            street: billingData.address,
            city: billingData.city,
            state: billingData.state,
          },
          merchantOrderId: orderId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to initialize payment");
      }

      // Store paymobOrderId for when user returns
      if (typeof window !== "undefined") {
        sessionStorage.setItem("pendingPaymobOrderId", String(data.orderId));
      }

      // Redirect to Paymob payment page
      window.location.href = data.iframeUrl;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Payment initialization failed";
      setError(errorMessage);
      onPaymentError(errorMessage);
      setIsLoading(false);
    }
  }, [amount, billingData, orderId, onPaymentError]);

  return (
    <div className="space-y-4">
      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Pay Button */}
      <button
        type="button"
        onClick={handlePayment}
        disabled={isLoading}
        className="w-full bg-orange py-3 text-white rounded-lg hover:bg-orange/90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {t("processingPayment")}
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            {t("pay")} {amount.toFixed(2)} {tCommon("currency")}
          </>
        )}
      </button>
    </div>
  );
};

export default PaymobPaymentForm;
