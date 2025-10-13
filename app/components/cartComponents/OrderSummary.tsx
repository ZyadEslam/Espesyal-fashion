"use client";
import React, { memo } from "react";
import OrderForm from "./OrderForm";
import { useCart } from "@/app/hooks/useCart";

const OrderSummary = memo(() => {
  const { totalPrice, cart } = useCart();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-8">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-orange/10 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-orange"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">
              Subtotal ({cart.length} items)
            </span>
            <span className="font-semibold text-gray-900">
              ${totalPrice.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">Shipping</span>
            <span className="font-semibold text-green-600">Free</span>
          </div>

          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">Tax</span>
            <span className="font-semibold text-gray-900">
              ${(totalPrice * 0.08).toFixed(2)}
            </span>
          </div>

          <hr className="border-gray-200" />

          <div className="flex justify-between items-center py-2">
            <span className="text-lg font-bold text-gray-900">Total</span>
            <span className="text-xl font-bold text-gray-900">
              ${(totalPrice * 1.08).toFixed(2)}
            </span>
          </div>
        </div>

        <OrderForm />
      </div>
    </div>
  );
});

OrderSummary.displayName = "OrderSummary";

export default OrderSummary;
