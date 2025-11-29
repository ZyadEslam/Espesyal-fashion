"use client";
import React, { memo } from "react";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { Lock, ArrowRight, Sparkles } from "lucide-react";
import OrderForm from "./OrderForm";
import { useCart } from "@/app/hooks/useCart";

const OrderSummary = memo(() => {
  const { totalPrice, cart } = useCart();
  const { status } = useSession();
  const locale = useLocale();
  const tCart = useTranslations("cart");
  const tCheckout = useTranslations("checkout");
  const tNav = useTranslations("nav");

  const isAuthenticated = status === "authenticated";

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
          <h2 className="text-xl font-bold text-gray-900">
            {tCheckout("orderSummary")}
          </h2>
        </div>

        {/* Login Prompt for Guest Users */}
        {!isAuthenticated && (
          <div className="mb-6 p-4 bg-gradient-to-br from-orange/10 via-orange/5 to-transparent border border-orange/20 rounded-xl relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-orange/5 rounded-full blur-2xl -mr-10 -mt-10" />
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-orange/5 rounded-full blur-xl -ml-8 -mb-8" />
            
            <div className="relative z-10">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-orange/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Lock className="w-5 h-5 text-orange" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                    {tCart("loginToContinue") || "Login to Continue"}
                    <Sparkles className="w-4 h-4 text-orange" />
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {tCart("loginPrompt") || "Sign in to proceed with checkout and track your orders"}
                  </p>
                  <button
                    onClick={() => signIn("google", { callbackUrl: `/${locale}/cart` })}
                    className="w-full flex items-center justify-center gap-2 bg-orange text-white px-4 py-2.5 rounded-lg hover:bg-orange/90 transition-all duration-200 font-medium shadow-sm hover:shadow-md group"
                  >
                    <span>{tNav("signIn") || "Sign In"}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">
              {tCart("subtotalItems", { count: cart.length })}
            </span>
            <span className="font-semibold text-gray-900">
              ${totalPrice.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">{tCheckout("shipping")}</span>
            <span className="font-semibold text-green-600">
              {tCart("freeShipping")}
            </span>
          </div>

          <hr className="border-gray-200" />

          <div className="flex justify-between items-center py-2">
            <span className="text-lg font-bold text-gray-900">
              {tCart("total")}
            </span>
            <span className="text-xl font-bold text-gray-900">
              ${totalPrice.toFixed(2)}
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
