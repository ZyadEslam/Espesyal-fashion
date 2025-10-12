import { NextResponse } from "next/server";
import { ProductCardProps } from "../types/types";

export function getBaseUrl() {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
}

const API_BASE_URL = `${getBaseUrl()}/api`;

export const api = {
  getProducts: async () => {
    console.log("API_BASE_URL:", API_BASE_URL);

    try {
      const res = await fetch(`${API_BASE_URL}/product`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log("fetche products:", data);

      return data.products || [];
    } catch (error) {
      console.log("Error fetching products:", error);
      return error;
    }
  },
  getProduct: async (id: string) => {
    const response = await fetch(`/api/product/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new NextResponse(`Failed to fetch Products ${response.status}`, {
        status: 500,
      });
    }

    const { product: data } = await response.json();
    return data;
  },
  getUser: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${id}`);
      const user = await response.json();
      return user;
    } catch (err) {
      console.log(err);
      return null;
    }
  },
  getWishlist: async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${userId}/wishlist`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const res = await response.json();
      console.log("Wishlist response:", res);
      return res;
    } catch (err) {
      return NextResponse.json(err, { status: 500 });
    }
  },
  // mergeWishlist: async (
  //   wishlistToAdd: ProductCardProps[],
  //   userId: string | undefined
  // ) => {
  //   try {
  //     const response = await fetch(`${API_BASE_URL}/user/${userId}/wishlist`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         wishlistToAdd,
  //       }),
  //     });
  //     console.log("Wishlist response:", response.json());
  //     return response.json();
  //   } catch (err) {
  //     return NextResponse.json(err, { status: 401 });
  //   }
  // },
  getCart: async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${userId}/cart`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const res = await response.json();
      console.log("Cart response:", res);
      return res;
    } catch (err) {
      return NextResponse.json(err, { status: 500 });
    }
  },
  mergeCart: async (
    cartToAdd: ProductCardProps[],
    userId: string | undefined
  ) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${userId}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartToAdd,
        }),
      });
      const res = await response.json();
      console.log("mergeCart response:", res);
      return response.json();
    } catch (err) {
      return NextResponse.json(err, { status: 401 });
    }
  },
  clearCart: async (userId: string | undefined) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${userId}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartToAdd: [] }),
      });
      return response.json();
    } catch (err) {
      return NextResponse.json(err, { status: 401 });
    }
  },
  getAddresses: async () => {
    try {
      const response = await fetch("/api/order-address");
      const result = await response.json();
      if (result.success) {
        return NextResponse.json(
          { addresses: result.addresses },
          { status: 200 }
        );
      }
    } catch (error) {
      return NextResponse.json(error, { status: 500 });
    }
  },
};
