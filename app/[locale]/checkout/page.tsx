"use client";
import React, { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { CreditCard, Wallet, ArrowLeft, CheckCircle } from "lucide-react";
import LoadingOverlay from "@/app/components/LoadingOverlay";
import ActionNotification from "@/app/UI/ActionNotification";
import StripePaymentForm from "@/app/components/checkoutComponents/StripePaymentForm";
import { api } from "@/app/utils/api";

interface CheckoutData {
  addressId: string;
  products: any[];
  totalPrice: number;
  promoCode: string | null;
  discountAmount: number;
  discountPercentage: number;
  taxes: number;
  subtotal: number;
}

const CheckoutPage = () => {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const router = useRouter();
  const session = useSession();
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cash_on_delivery" | "stripe">("cash_on_delivery");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderStatus, setOrderStatus] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    // Get checkout data from sessionStorage
    if (typeof window !== "undefined") {
      const storedData = sessionStorage.getItem("checkoutData");
      if (storedData) {
        try {
          setCheckoutData(JSON.parse(storedData));
        } catch (error) {
          console.error("Error parsing checkout data:", error);
        }
      }
    }
  }, []);

  const handlePlaceOrder = async () => {
    if (!checkoutData || !session.data?.user?.id) return;

    setIsProcessing(true);
    setOrderStatus(null);

    try {
      const orderData = {
        addressId: checkoutData.addressId,
        userId: session.data.user.id,
        products: checkoutData.products,
        totalPrice: checkoutData.totalPrice,
        paymentMethod: paymentMethod,
        ...(checkoutData.promoCode && { promoCode: checkoutData.promoCode }),
        ...(checkoutData.discountAmount && { discountAmount: checkoutData.discountAmount }),
        ...(checkoutData.discountPercentage && { discountPercentage: checkoutData.discountPercentage }),
      };

      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (result.success) {
        setOrderStatus({ success: true, message: t("orderPlaced") });
        // Clear checkout data
        sessionStorage.removeItem("checkoutData");
        // Clear cart
        if (typeof window !== "undefined") {
          localStorage.setItem("cart", JSON.stringify([]));
        }
        // Clear server cart
        if (session.data?.user?.id) {
          await api.clearCart(session.data.user.id);
        }
        // Redirect to order confirmation page
        setTimeout(() => {
          router.push(`/${locale}/order-confirmation/${result.orderId}`);
        }, 1500);
      } else {
        setOrderStatus({ success: false, message: result.message || t("paymentFailed") });
      }
    } catch (error) {
      console.error("Error placing order:", error);
      setOrderStatus({ success: false, message: t("paymentFailed") });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStripePaymentSuccess = async (paymentIntentId: string) => {
    if (!checkoutData || !session.data?.user?.id) return;

    setIsProcessing(true);
    setOrderStatus(null);

    try {
      const orderData = {
        addressId: checkoutData.addressId,
        userId: session.data.user.id,
        products: checkoutData.products,
        totalPrice: checkoutData.totalPrice,
        paymentMethod: "stripe",
        stripePaymentIntentId: paymentIntentId,
        ...(checkoutData.promoCode && { promoCode: checkoutData.promoCode }),
        ...(checkoutData.discountAmount && { discountAmount: checkoutData.discountAmount }),
        ...(checkoutData.discountPercentage && { discountPercentage: checkoutData.discountPercentage }),
      };

      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (result.success) {
        setOrderStatus({ success: true, message: t("orderPlaced") });
        sessionStorage.removeItem("checkoutData");
        if (typeof window !== "undefined") {
          localStorage.setItem("cart", JSON.stringify([]));
        }
        // Clear server cart
        if (session.data?.user?.id) {
          await api.clearCart(session.data.user.id);
        }
        // Redirect to order confirmation page
        setTimeout(() => {
          router.push(`/${locale}/order-confirmation/${result.orderId}`);
        }, 1500);
      } else {
        setOrderStatus({ success: false, message: result.message || t("paymentFailed") });
      }
    } catch (error) {
      console.error("Error placing order:", error);
      setOrderStatus({ success: false, message: t("paymentFailed") });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!checkoutData) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full mx-4 text-center">
          <p className="text-gray-600 mb-4">{t("noCheckoutData")}</p>
          <Link
            href={`/${locale}/cart`}
            className="inline-flex items-center gap-2 text-orange hover:text-orange/80 transition-colors duration-200 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("backToCart")}
          </Link>
        </div>
      </div>
    );
  }

  const totalItems = checkoutData.products.reduce(
    (total, item) => total + (item.quantityInCart || 1),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      <LoadingOverlay
        isVisible={isProcessing}
        message={t("processingPayment")}
        icon={<CreditCard />}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/${locale}/cart`}
            className="inline-flex items-center gap-2 text-orange hover:text-orange/80 transition-colors duration-200 font-medium mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("backToCart")}
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{t("title")}</h1>
        </div>

        {orderStatus && (
          <div className="mb-6">
            <ActionNotification {...orderStatus} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Method Selection */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  {t("selectPaymentMethod")}
                </h2>

                <div className="space-y-4">
                  {/* Cash on Delivery */}
                  <div
                    onClick={() => setPaymentMethod("cash_on_delivery")}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === "cash_on_delivery"
                        ? "border-orange bg-orange/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                          paymentMethod === "cash_on_delivery"
                            ? "border-orange bg-orange"
                            : "border-gray-300"
                        }`}
                      >
                        {paymentMethod === "cash_on_delivery" && (
                          <div className="w-3 h-3 rounded-full bg-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Wallet className="w-5 h-5 text-gray-600" />
                          <h3 className="font-semibold text-gray-900">
                            {t("cashOnDelivery")}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600">
                          {t("cashOnDeliveryDesc")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Stripe Payment */}
                  <div
                    onClick={() => setPaymentMethod("stripe")}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === "stripe"
                        ? "border-orange bg-orange/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                          paymentMethod === "stripe"
                            ? "border-orange bg-orange"
                            : "border-gray-300"
                        }`}
                      >
                        {paymentMethod === "stripe" && (
                          <div className="w-3 h-3 rounded-full bg-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CreditCard className="w-5 h-5 text-gray-600" />
                          <h3 className="font-semibold text-gray-900">
                            {t("cardPayment")}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600">
                          {t("cardPaymentDesc")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stripe Payment Form */}
                {paymentMethod === "stripe" && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <StripePaymentForm
                      amount={checkoutData.totalPrice}
                      onPaymentSuccess={handleStripePaymentSuccess}
                      onPaymentError={(error) => {
                        setOrderStatus({ success: false, message: error });
                        setIsProcessing(false);
                      }}
                    />
                  </div>
                )}

                {/* Place Order Button for Cash on Delivery */}
                {paymentMethod === "cash_on_delivery" && (
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="mt-6 w-full bg-orange py-3 text-white rounded-lg hover:bg-orange/90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {t("placeOrder")}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-8">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  {t("orderSummary")}
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {t("items")} ({totalItems})
                    </span>
                    <span className="font-semibold text-gray-900">
                      ${checkoutData.subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">{t("shipping")}</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">{t("tax")}</span>
                    <span className="font-semibold text-gray-900">
                      ${checkoutData.taxes.toFixed(2)}
                    </span>
                  </div>

                  {checkoutData.promoCode && checkoutData.discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span className="text-gray-600">
                        {t("discount")} ({checkoutData.promoCode})
                      </span>
                      <span className="font-semibold">
                        -${checkoutData.discountAmount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <hr className="border-gray-200" />

                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">
                      {t("total")}
                    </span>
                    <span className="text-xl font-bold text-gray-900">
                      ${checkoutData.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

