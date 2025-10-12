import React from "react";

import FormInput from "./FormInput";
const PriceInputs = React.memo(() => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <FormInput
        id="price"
        name="price"
        label="Product Price"
        type="number"
        placeholder="0.00"
        min="0"
        step="0.01"
        required
      />
      <FormInput
        id="oldPrice"
        name="oldPrice"
        label="Old Price"
        type="number"
        placeholder="0.00"
        min="0"
        step="0.01"
      />
      <FormInput
        id="discount"
        name="discount"
        label="Discount"
        type="number"
        placeholder="0.00"
        min="0"
        step="0.01"
      />
      <FormInput
        id="rating"
        name="rating"
        label="Rating"
        type="number"
        placeholder="0.00"
        min="0"
        step="0.01"
        required
      />
    </div>
  );
});

PriceInputs.displayName = "PriceInputs";
export default PriceInputs;
