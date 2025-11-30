"use client";
import React, { useState, useEffect } from "react";
import { Loader2, Truck } from "lucide-react";
import MessageBanner from "./MessageBanner";
import { useTranslations } from "next-intl";

const ShippingSettings = React.memo(() => {
  const t = useTranslations("dashboard.shippingSettings");
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch current shipping fee
  useEffect(() => {
    const fetchShippingFee = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/settings");
        const result = await response.json();

        if (result.success) {
          setShippingFee(result.shippingFee || 0);
        } else {
          setError(result.error || "Failed to fetch shipping fee");
        }
      } catch (err) {
        console.error("Error fetching shipping fee:", err);
        setError("Failed to fetch shipping fee");
      } finally {
        setLoading(false);
      }
    };

    fetchShippingFee();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ shippingFee }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(result.message || t("updateSuccess"));
      } else {
        setError(result.error || t("updateError"));
      }
    } catch (err) {
      console.error("Error updating shipping fee:", err);
      setError(t("updateError"));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-orange" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange/10 rounded-lg flex items-center justify-center">
            <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-orange" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              {t("title")}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              {t("subtitle")}
            </p>
          </div>
        </div>
      </div>

      <MessageBanner type="error" message={error || ""} />
      <MessageBanner type="success" message={success || ""} />

      {/* Settings Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="shippingFee"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("currentShippingFee")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="shippingFee"
                  min="0"
                  step="0.01"
                  value={shippingFee}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    setShippingFee(value >= 0 ? value : 0);
                  }}
                  className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-orange sm:text-sm"
                  placeholder="0.00"
                  required
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                {t("shippingFeeHint")}
              </p>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center justify-center gap-2 bg-orange text-white px-6 py-2.5 rounded-lg hover:bg-orange/90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t("updating")}</span>
                  </>
                ) : (
                  <span>{t("updateButton")}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});

ShippingSettings.displayName = "ShippingSettings";

export default ShippingSettings;
