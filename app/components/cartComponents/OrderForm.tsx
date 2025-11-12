"use client";
import { AddressProps } from "@/app/types/types";
import { useSession } from "next-auth/react";
import React, { useEffect, useMemo, useState } from "react";
import AddressSelection from "./AddressSelection";
import { useCart } from "@/app/hooks/useCart";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

const OrderForm = () => {
  const [taxes, setTaxes] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState<AddressProps>();
  const session = useSession();
  const router = useRouter();
  const locale = useLocale();
  const { cart, totalPrice } = useCart();

  // Promo code state
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [validatingPromo, setValidatingPromo] = useState(false);

  const isOrderValidToPlace =
    selectedAddress && cart.length > 0 && session.status === "authenticated";

  const totalItems = useMemo(() => {
    return cart.reduce((total, item) => {
      return total + (item.quantityInCart || 1);
    }, 0);
  }, [cart]);

  // Calculate final price with discount
  const finalPrice = useMemo(() => {
    const subtotal = totalPrice;
    const tax = (subtotal * 2) / 100;
    const discount = discountAmount;
    return subtotal + tax - discount;
  }, [totalPrice, discountAmount]);

  useEffect(() => {
    setTaxes((totalPrice * 2) / 100);
    // Recalculate discount when total price changes
    if (discountPercentage > 0) {
      const subtotal = totalPrice;
      const tax = (subtotal * 2) / 100;
      const newDiscount = ((subtotal + tax) * discountPercentage) / 100;
      setDiscountAmount(newDiscount);
    }
  }, [totalPrice, discountPercentage]);


  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) {
      setPromoError("Please enter a promo code");
      return;
    }

    setValidatingPromo(true);
    setPromoError("");

    try {
      const response = await fetch("/api/promo-code/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: promoCode.trim() }),
      });

      const result = await response.json();

      if (result.valid) {
        setAppliedPromoCode(promoCode.toUpperCase().trim());
        setDiscountPercentage(result.discountPercentage);
        const subtotal = totalPrice;
        const tax = (subtotal * 2) / 100;
        const discount = ((subtotal + tax) * result.discountPercentage) / 100;
        setDiscountAmount(discount);
        setPromoError("");
      } else {
        setPromoError(result.error || "Invalid promo code");
        setAppliedPromoCode(null);
        setDiscountPercentage(0);
        setDiscountAmount(0);
      }
    } catch (error) {
      console.error("Error validating promo code:", error);
      setPromoError("Failed to validate promo code. Please try again.");
      setAppliedPromoCode(null);
      setDiscountPercentage(0);
      setDiscountAmount(0);
    } finally {
      setValidatingPromo(false);
    }
  };

  const handleRemovePromoCode = () => {
    setPromoCode("");
    setAppliedPromoCode(null);
    setDiscountPercentage(0);
    setDiscountAmount(0);
    setPromoError("");
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isOrderValidToPlace) {
      return;
    }

    // Store order data in sessionStorage to pass to checkout page
    const orderData = {
      addressId: selectedAddress?._id,
      products: cart,
      totalPrice: finalPrice,
      promoCode: appliedPromoCode || null,
      discountAmount: discountAmount,
      discountPercentage: discountPercentage,
      taxes: taxes,
      subtotal: totalPrice,
    };

    sessionStorage.setItem("checkoutData", JSON.stringify(orderData));
    
    // Redirect to checkout page
    router.push(`/${locale}/checkout`);
  };

  return (
    <form
      onSubmit={submitHandler}
      className="flex flex-col gap-4"
    >
      <div className="order-summary-pair">
        <label className="font-medium text-gray-600">SELECT ADDRESS</label>
          <AddressSelection
            setSelectedAddress={setSelectedAddress}
            selectedAddress={selectedAddress as AddressProps}
          />
        </div>
        <div className="order-summary-pair">
          <label className="font-medium text-gray-600">PROMO CODE</label>
          {appliedPromoCode ? (
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-green-50 border border-green-200 rounded px-3 py-2 flex items-center justify-between">
                <span className="text-green-700 font-medium">
                  {appliedPromoCode} - {discountPercentage}% OFF
                </span>
                <button
                  type="button"
                  onClick={handleRemovePromoCode}
                  className="text-green-700 hover:text-green-900 ml-2"
                >
                  ✕
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => {
                  setPromoCode(e.target.value);
                  setPromoError("");
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleApplyPromoCode();
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange"
              />
              <button
                type="button"
                onClick={handleApplyPromoCode}
                disabled={validatingPromo}
                className="bg-orange text-white w-fit py-2 px-10 rounded hover:bg-orange/90 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {validatingPromo ? "..." : "Apply"}
              </button>
            </div>
          )}
          {promoError && (
            <p className="text-red-600 text-sm mt-1">{promoError}</p>
          )}
        </div>
        <hr />
        <div className="order-summary-pair font-medium">
          <div className="flex justify-between">
            <p className="text-gray-500">ITEMS {totalItems}</p>
            <p>${totalPrice.toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-500">Shipping Fee</p>
            <p>Free</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-500">Tax (2%)</p>
            <p>${taxes.toFixed(2)}</p>
          </div>
          {appliedPromoCode && discountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <p className="text-gray-500">Discount ({appliedPromoCode})</p>
              <p>-${discountAmount.toFixed(2)}</p>
            </div>
          )}
        </div>
        <hr />
        <div className="flex justify-between font-medium text-xl">
          <p>Total</p>
          <p>${finalPrice.toFixed(2)}</p>
        </div>

      <button
        type="submit"
        className="bg-orange py-3 text-white cursor-pointer hover:bg-orange/90 disabled:cursor-not-allowed disabled:bg-gray-400"
        disabled={!isOrderValidToPlace}
      >
        {session.status === "unauthenticated"
          ? "Please Login to add orders "
          : cart.length === 0
          ? "Cart is empty"
          : "Proceed to Checkout"}
      </button>
    </form>
  );
};

export default OrderForm;
