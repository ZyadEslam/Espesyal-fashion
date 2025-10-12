"use client";
import React
// , { useEffect, useState }
 from "react";

import { ProductCardProps } from "@/app/types/types";
import WishlistTableRow from "./WishlistTableRow";
import { useWishlist } from "@/app/hooks/useWishlist";

const WishlistTable = () => {
  const { wishlist } = useWishlist();
  // const [wishlist, setWishlist] = useState<ProductCardProps[]>([]);
  // useEffect(() => {
  //   if (localStorage.getItem("wishlist")) {
  //     const storageWishlist = JSON.parse(
  //       localStorage.getItem("wishlist") as string
  //     );
  //     setWishlist(storageWishlist);
  //   }
  // }, []);
  return (
    <table className="w-full flex flex-col ">
      <thead className="sm:hidden md:block">
        <tr className="mb-6 pb-2 table-row font-semibold text-gray-500">
          <td>Product Details</td>
          <td>Price</td>
          <td className="md:text-center">Add To Cart</td>
        </tr>
      </thead>
      <tbody>
        {wishlist.map((product: ProductCardProps) => (
          <WishlistTableRow
            key={product._id}
            product={product}
            // setWishlist={setWishlist}
          />
        ))}
      </tbody>
    </table>
  );
};

export default WishlistTable;
