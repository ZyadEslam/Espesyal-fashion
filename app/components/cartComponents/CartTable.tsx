"use client";
import React, { memo } from "react";
import CartTableRow from "./CartTableRow";
import { ProductCardProps } from "@/app/types/types";
import { useCart } from "@/app/hooks/useCart";

const CartTable = memo(() => {
  const { cart } = useCart();

  return (
    <div className="p-6">
      {/* Desktop Header */}
      <div className="hidden md:grid md:grid-cols-12 gap-6 mb-6 pb-4 border-b border-gray-200">
        <div className="col-span-6">
          <h3 className="font-semibold text-gray-700">Product Details</h3>
        </div>
        <div className="col-span-2">
          <h3 className="font-semibold text-gray-700">Quantity</h3>
        </div>
        <div className="col-span-2">
          <h3 className="font-semibold text-gray-700">Price</h3>
        </div>
        <div className="col-span-2">
          <h3 className="font-semibold text-gray-700">Total</h3>
        </div>
      </div>

      {/* Cart Items */}
      <div className="space-y-4">
        {cart.map((product: ProductCardProps) => (
          <CartTableRow key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
});

CartTable.displayName = "CartTable";

export default CartTable;
