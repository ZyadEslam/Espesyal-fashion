"use client";
import React, { useCallback, useState, useEffect } from "react";
import { TableRowProps } from "../../types/types";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/hooks/useCart";

const CartTableRow = ({ product }: TableRowProps) => {
  const [productPrice, setProductPrice] = useState(product.price);
  const [quantity, setQuantity] = useState(product.quantityInCart || 1);
  const { removeFromCart, updateQuantity } = useCart();

  // const removeFromCartHandler = (productId: string) => {
  //   removeFromCart(productId);
  // };

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

  return (
    <tr key={product._id} className="table-row">
      <td className="flex sm:flex-col md:flex-row">
        <div className="p-4 bg-gray-200 rounded md:mr-4 sm:mb-2 md:mb-0 w-fit">
          <Link href={`/product/${product._id}`}>
            <Image
              src={`/api/product/image/${product._id}?index=0`}
              width={52}
              height={52}
              alt="Product Image"
            />
          </Link>
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-gray-600 text-wrap">{product.name}</p>
          <p
            className="text-orange/80 text-sm cursor-pointer hover:opacity-85"
            onClick={() => {
              removeFromCart(product._id as string);
            }}
          >
            Remove from Cart
          </p>
        </div>
      </td>
      <td>
        <input
          type="number"
          value={quantity}
          min="1"
          className="border border-gray-400 rounded outline-none p-2 max-w-[60px] text-center"
          onChange={(e) => {
            handleQuantityChange(Number(e.target.value));
          }}
        />
      </td>
      <td className="text-gray-600">
        <p>${productPrice.toFixed(2)}</p>
      </td>
    </tr>
  );
};

export default CartTableRow;
