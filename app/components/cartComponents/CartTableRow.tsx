"use client";
import React, { useCallback, useState, useEffect, memo } from "react";
import { TableRowProps } from "../../types/types";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/hooks/useCart";
import { Minus, Plus, Trash2 } from "lucide-react";

const CartTableRow = memo(({ product }: TableRowProps) => {
  const [productPrice, setProductPrice] = useState(product.price);
  const [quantity, setQuantity] = useState(product.quantityInCart || 1);
  const [imageError, setImageError] = useState(false);
  const { removeFromCart, updateQuantity } = useCart();

  useEffect(() => {
    const newPrice = product.price * quantity;
    setProductPrice(newPrice);
  }, [quantity, product.price]);

  const handleQuantityChange = useCallback(
    (newQuantity: number) => {
      if (newQuantity < 1) return;

      setQuantity(newQuantity);

      if (updateQuantity) {
        updateQuantity(product._id as string, newQuantity);
      }
    },
    [product._id, updateQuantity]
  );

  const incrementQuantity = useCallback(() => {
    handleQuantityChange(quantity + 1);
  }, [quantity, handleQuantityChange]);

  const decrementQuantity = useCallback(() => {
    if (quantity > 1) {
      handleQuantityChange(quantity - 1);
    }
  }, [quantity, handleQuantityChange]);

  const removeFromCartHandler = useCallback(() => {
    removeFromCart(product._id as string);
  }, [product._id, removeFromCart]);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  return (
    <div className="group bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 hover:border-orange/20">
      {/* Mobile Layout */}
      <div className="md:hidden">
        <div className="flex gap-4 mb-4">
          {/* Product Image */}
          <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            <Link href={`/product/${product._id}`}>
              {!imageError ? (
                <Image
                  src={`/api/product/image/${product._id}?index=0`}
                  width={80}
                  height={80}
                  alt={product.name}
                  className="object-cover w-full h-full"
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-xs">No image</span>
                </div>
              )}
            </Link>
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <Link href={`/product/${product._id}`}>
              <h3 className="font-semibold text-gray-900 text-sm leading-tight hover:text-orange transition-colors duration-200 line-clamp-2">
                {product.name}
              </h3>
            </Link>
            <p className="text-lg font-bold text-gray-900 mt-1">
              ${productPrice.toFixed(2)}
            </p>
          </div>

          {/* Remove Button */}
          <button
            onClick={removeFromCartHandler}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Quantity Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Quantity:</span>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-3 py-2 text-sm font-medium min-w-[3rem] text-center">
                {quantity}
              </span>
              <button
                onClick={incrementQuantity}
                className="p-2 hover:bg-gray-100 transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:grid md:grid-cols-12 gap-6 items-center">
        {/* Product Details */}
        <div className="col-span-6 flex items-center gap-4">
          <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            <Link href={`/product/${product._id}`}>
              {!imageError ? (
                <Image
                  src={`/api/product/image/${product._id}?index=0`}
                  width={64}
                  height={64}
                  alt={product.name}
                  className="object-cover w-full h-full"
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-xs">No image</span>
                </div>
              )}
            </Link>
          </div>

          <div className="flex-1 min-w-0">
            <Link href={`/product/${product._id}`}>
              <h3 className="font-semibold text-gray-900 hover:text-orange transition-colors duration-200 line-clamp-2">
                {product.name}
              </h3>
            </Link>
            <p className="text-sm text-gray-500 mt-1">
              ${product.price.toFixed(2)} each
            </p>
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="col-span-2">
          <div className="flex items-center border border-gray-300 rounded-lg w-fit">
            <button
              onClick={decrementQuantity}
              disabled={quantity <= 1}
              className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-3 py-2 text-sm font-medium min-w-[3rem] text-center">
              {quantity}
            </span>
            <button
              onClick={incrementQuantity}
              className="p-2 hover:bg-gray-100 transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Unit Price */}
        <div className="col-span-2">
          <p className="text-gray-600">${product.price.toFixed(2)}</p>
        </div>

        {/* Total Price & Actions */}
        <div className="col-span-2 flex items-center justify-between">
          <p className="text-lg font-bold text-gray-900">
            ${productPrice.toFixed(2)}
          </p>
          <button
            onClick={removeFromCartHandler}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
});

CartTableRow.displayName = "CartTableRow";

export default CartTableRow;
