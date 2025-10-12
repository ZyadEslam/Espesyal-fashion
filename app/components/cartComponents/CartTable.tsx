"use client";
// import { useDispatch } from "react-redux";
import React, {
  // useEffect,
  // useState ,
  // useCallback,
} from "react";
import CartTableRow from "./CartTableRow";
import { ProductCardProps } from "@/app/types/types";
// import { calculateTotals } from "@/app/store/cartSlice";
import { useCart } from "@/app/hooks/useCart";

// interface cartTableProps {
//   cart: ProductCardProps[];
//   setCart: React.Dispatch<React.SetStateAction<ProductCardProps[]>>;
// }

const CartTable = () => {
  const { cart } = useCart();
  // const dispatch = useDispatch();
  // const [isItemRemoved, setIsIsItemRemoved] = useState(false);

  // useEffect(() => {
  //   if (localStorage.getItem("cart")) {
  //     const storageCart = JSON.parse(localStorage.getItem("cart") as string);
  //     setCart(storageCart);

  //     const total = storageCart.reduce(
  //       (acc: number, item: ProductCardProps) =>
  //         acc + item.price * (item.quantityInCart || 1),
  //       0
  //     );

  //     dispatch(calculateTotals(total));
  //   }
  // }, [dispatch, setCart, isItemRemoved]);

  // const removeFromCartHandler = (productId: string) => {
  //   removeFromCart(productId);
  //   // setIsIsItemRemoved((state) => !state);
  // };

  // const updateQuantityInCart = (productId: string, quantity: number) => {
  //   updateQuantity(productId, quantity);
  //   // const updatedCart = cart.map((product: ProductCardProps) => {
  //   //   if (product._id === productId) {
  //   //     return { ...product, quantityInCart: quantity };
  //   //   }
  //   //   return product;
  //   // });

  //   // localStorage.setItem("cart", JSON.stringify(updatedCart));
  //   // setCart(updatedCart);
  // };

  return (
    <table className="w-full flex flex-col sm:px-2 md:px-0 ">
      <thead>
        <tr className="mb-6 pb-2 table-row font-semibold text-gray-500">
          <td>Product Details</td>
          <td>Quantity</td>
          <td>Price</td>
        </tr>
      </thead>
      <tbody>
        {cart.map((product: ProductCardProps) => (
          <CartTableRow
            key={product._id}
            product={product}
            // removeFromCartHandler={removeFromCartHandler}
            // updateQuantityInCart={updateQuantityInCart}
          />
        ))}
      </tbody>
    </table>
  );
};

export default CartTable;
