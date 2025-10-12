import React from "react";
import { addProduct } from "../../utils/actions";

interface ProductFormProps {
  children: React.ReactNode;
}
const ProductFormComponent: React.FC<ProductFormProps> = ({ children }) => {
  return (
    <form action={addProduct} className="flex flex-col gap-6">
      {children}
    </form>
  );
};

export default ProductFormComponent;
