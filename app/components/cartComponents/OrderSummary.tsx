"use client";
import React from "react";
import OrderForm from "./OrderForm";

const OrderSummary = () => {
  return (
    <section className="bg-gray-50 p-4 ">
      <h1 className="text-2xl font-medium pb-4 ">OrderSummary</h1>
      <hr className="text-gray-300 mb-4" />
      <OrderForm  />
    </section>
  );
};

export default OrderSummary;
