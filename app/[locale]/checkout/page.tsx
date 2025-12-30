"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { CreditCard, Wallet, ArrowLeft } from "lucide-react";
import LoadingOverlay from "@/app/components/LoadingOverlay";
import ActionNotification from "@/app/UI/ActionNotification";
import StripePaymentForm from "@/app/components/checkoutComponents/StripePaymentForm";
import StripePreconnects from "@/app/components/checkoutComponents/StripePreconnects";
import CheckoutAddressSection from "@/app/components/checkoutComponents/CheckoutAddressSection";
import CheckoutOrderSummary from "@/app/components/checkoutComponents/CheckoutOrderSummary";
import { api } from "@/app/utils/api";
import { useCart } from "@/app/hooks/useCart";
import { AddressProps, CityCategory } from "@/app/types/types";
import { ProductCardProps } from "@/app/types/types";

interface CheckoutData {
  products: ProductCardProps[];
  source: "cart" | "buy_now";
  subtotal: number;
  promoCode?: string | null;
  discountAmount?: number;
  discountPercentage?: number;
  shippingFee?: number;
}

interface OrderData {
  userId?: string;
  address: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
  };
  products: ProductCardProps[];
  totalPrice: number;
  paymentMethod: "cash_on_delivery" | "stripe";
  shippingFee: number;
  promoCode?: string;
  discountAmount?: number;
  discountPercentage?: number;
  stripePaymentIntentId?: string;
}

const CheckoutPage = () => {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const router = useRouter();
  const session = useSession();
  const { clearCart, cart, totalPrice } = useCart();
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<AddressProps | null>(
    null
  );
  const [paymentMethod, setPaymentMethod] = useState<
    "cash_on_delivery" | "stripe"
  >("cash_on_delivery");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderStatus, setOrderStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [finalTotal, setFinalTotal] = useState<number>(0);
  const [cityCategory, setCityCategory] = useState<CityCategory | undefined>(undefined);

  useEffect(() => {
    // Get checkout data from sessionStorage
    if (typeof window !== "undefined") {
      const storedData = sessionStorage.getItem("checkoutData");
      if (storedData) {
        try {
          const parsed = JSON.parse(storedData);
          setCheckoutData(parsed);
          // If from cart, use cart data
          if (parsed.source === "cart") {
            // Use cart from context
            setCheckoutData({
              products: cart,
              source: "cart",
              subtotal: totalPrice,
            });
          }
        } catch (error) {
          console.error("Error parsing checkout data:", error);
        }
      } else {
        // Fallback to cart if no sessionStorage data
        if (cart.length > 0) {
          setCheckoutData({
            products: cart,
            source: "cart",
            subtotal: totalPrice,
          });
        }
      }
    }
  }, [cart, totalPrice]);

  // Handle direct city category change from the form (for immediate shipping fee update)
  const handleCityCategoryChange = useCallback((category: CityCategory) => {
    setCityCategory(category);
  }, []);

  // Update city category when address changes
  useEffect(() => {
    if (selectedAddress?.cityCategory) {
      setCityCategory(selectedAddress.cityCategory);
    }
  }, [selectedAddress]);

  // Handle shipping fee change from order summary
  const handleShippingFeeChange = useCallback((fee: number) => {
    setShippingFee(fee);
  }, []);

  // Calculate final total
  useEffect(() => {
    if (checkoutData) {
      const subtotal = checkoutData.subtotal;
      const discountedPrice = Math.max(subtotal - discountAmount, 0);
      const total = discountedPrice + shippingFee;
      setFinalTotal(total);
    }
  }, [checkoutData, discountAmount, shippingFee]);

  const handlePromoCodeChange = (
    code: string | null,
    amount: number,
    percentage: number
  ) => {
    setPromoCode(code);
    setDiscountAmount(amount);
    setDiscountPercentage(percentage);
  };

  const validateStock = async (products: ProductCardProps[]): Promise<{ valid: boolean; message?: string }> => {
    try {
      for (const product of products) {
        // Fetch current product data to get latest stock
        const response = await fetch(`/api/product/${product._id}`, {
          cache: "no-store",
        });
        const result = await response.json();
        
        if (!result.success || !result.product) {
          return {
            valid: false,
            message: `Product "${product.name}" is no longer available`,
          };
        }

        const currentProduct = result.product;
        const requestedQuantity = product.quantityInCart || product.quantity || 1;

        // Check stock for variants
        if (currentProduct.variants && currentProduct.variants.length > 0) {
          const variantId = product.selectedVariantId;
          const variantColor = product.selectedColor;
          const variantSize = product.selectedSize;

          let variant = null;
          if (variantId) {
            variant = currentProduct.variants.find(
              (v: { _id?: string }) => v._id === variantId
            );
          } else if (variantColor || variantSize) {
            variant = currentProduct.variants.find(
              (v: { color?: string; size?: string }) => {
                const colorMatch = variantColor ? v.color === variantColor : true;
                const sizeMatch = variantSize ? v.size === variantSize : true;
                return colorMatch && sizeMatch;
              }
            );
          }

          if (!variant) {
            return {
              valid: false,
              message: `Selected combination for "${product.name}" is no longer available`,
            };
          }

          if (variant.quantity < requestedQuantity) {
            return {
              valid: false,
              message: `Insufficient stock for ${product.name} (${variant.color || ""} ${variant.size || ""}). Available: ${variant.quantity}, Requested: ${requestedQuantity}`,
            };
          }
        } else {
          // Check stock for products without variants
          const availableStock = currentProduct.totalStock || 0;
          if (availableStock < requestedQuantity) {
            return {
              valid: false,
              message: `Insufficient stock for "${product.name}". Available: ${availableStock}, Requested: ${requestedQuantity}`,
            };
          }
        }
      }
      return { valid: true };
    } catch (error) {
      console.error("Error validating stock:", error);
      return {
        valid: false,
        message: "Error checking stock availability. Please try again.",
      };
    }
  };

  const handlePlaceOrder = async () => {
    if (!checkoutData || !selectedAddress) {
      setOrderStatus({
        success: false,
        message: "Please fill in all required information",
      });
      return;
    }

    setIsProcessing(true);
    setOrderStatus(null);

    // Validate stock before proceeding
    const stockValidation = await validateStock(checkoutData.products);
    if (!stockValidation.valid) {
      setIsProcessing(false);
      setOrderStatus({
        success: false,
        message: stockValidation.message || "Stock validation failed",
      });
      return;
    }

    try {
      const orderData: OrderData = {
        // Include userId only if user is authenticated
        ...(session.status === "authenticated" &&
          session.data?.user?.id && {
            userId: session.data.user.id,
          }),
        // Always send address data directly (no saved addresses)
        address: {
          name: selectedAddress.name,
          phone: selectedAddress.phone,
          address: selectedAddress.address,
          city: selectedAddress.city,
          state: selectedAddress.state,
        },
        products: checkoutData.products,
        totalPrice: finalTotal,
        paymentMethod: paymentMethod,
        shippingFee: shippingFee,
        ...(promoCode && { promoCode }),
        ...(discountAmount > 0 && {
          discountAmount: discountAmount,
          discountPercentage: discountPercentage,
        }),
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
        // Clear server cart FIRST (only if authenticated)
        if (session.status === "authenticated" && session.data?.user?.id) {
          await api.clearCart(session.data.user.id);
        }
        // Then clear cart from context
        clearCart();
        // Redirect to order confirmation page
        setTimeout(() => {
          router.push(`/${locale}/order-confirmation/${result.orderId}`);
        }, 1500);
      } else {
        setOrderStatus({
          success: false,
          message: result.message || t("paymentFailed"),
        });
      }
    } catch (error) {
      console.error("Error placing order:", error);
      setOrderStatus({ success: false, message: t("paymentFailed") });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStripePaymentSuccess = async (paymentIntentId: string) => {
    if (!checkoutData || !selectedAddress) return;

    setIsProcessing(true);
    setOrderStatus(null);

    // Validate stock before proceeding
    const stockValidation = await validateStock(checkoutData.products);
    if (!stockValidation.valid) {
      setIsProcessing(false);
      setOrderStatus({
        success: false,
        message: stockValidation.message || "Stock validation failed",
      });
      return;
    }

    // Clear cart immediately when payment succeeds
    clearCart();

    try {
      const orderData: OrderData = {
        // Include userId only if user is authenticated
        ...(session.status === "authenticated" &&
          session.data?.user?.id && {
            userId: session.data.user.id,
          }),
        // Always send address data directly (no saved addresses)
        address: {
          name: selectedAddress.name,
          phone: selectedAddress.phone,
          address: selectedAddress.address,
          city: selectedAddress.city,
          state: selectedAddress.state,
        },
        products: checkoutData.products,
        totalPrice: finalTotal,
        paymentMethod: "stripe",
        stripePaymentIntentId: paymentIntentId,
        shippingFee: shippingFee,
        ...(promoCode && { promoCode }),
        ...(discountAmount > 0 && {
          discountAmount: discountAmount,
          discountPercentage: discountPercentage,
        }),
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
        // Clear server cart (only if authenticated)
        if (session.status === "authenticated" && session.data?.user?.id) {
          await api.clearCart(session.data.user.id);
        }
        clearCart();
        setTimeout(() => {
          router.push(`/${locale}/order-confirmation/${result.orderId}`);
        }, 1500);
      } else {
        setOrderStatus({
          success: false,
          message: result.message || t("paymentFailed"),
        });
      }
    } catch (error) {
      console.error("Error placing order:", error);
      setOrderStatus({ success: false, message: t("paymentFailed") });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!checkoutData || checkoutData.products.length === 0) {
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

  const canPlaceOrder = selectedAddress !== null;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <StripePreconnects />
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
          {/* Left Column: Address and Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Address Section */}
            <CheckoutAddressSection
              onAddressChange={setSelectedAddress}
              onCityCategoryChange={handleCityCategoryChange}
              selectedAddress={selectedAddress}
            />

            {/* Payment Method Selection */}
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
                      amount={finalTotal}
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
                    disabled={isProcessing || !canPlaceOrder}
                    className="mt-6 w-full bg-orange py-3 text-white rounded-lg hover:bg-orange/90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {t("placeOrder")}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <CheckoutOrderSummary
              products={checkoutData.products}
              subtotal={checkoutData.subtotal}
              cityCategory={cityCategory}
              onPromoCodeChange={handlePromoCodeChange}
              onShippingFeeChange={handleShippingFeeChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
