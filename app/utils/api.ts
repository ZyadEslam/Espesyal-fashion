import { NextResponse } from "next/server";
import { ProductCardProps } from "../types/types";
import { cachedFetchJson, cacheStrategies } from "./cachedFetch";

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
      const data = await cachedFetchJson<{ products: ProductCardProps[] }>(
        `${API_BASE_URL}/product`,
        cacheStrategies.products()
      );
      console.log("fetched products:", data);

      return data.products || [];
    } catch (error) {
      console.log("Error fetching products:", error);
      return error;
    }
  },
  getProduct: async (id: string) => {
    try {
      const data = await cachedFetchJson<{ product: ProductCardProps }>(
        `/api/product/${id}`,
        cacheStrategies.products()
      );
      return data.product;
    } catch (error) {
      throw new NextResponse(`Failed to fetch Products`, {
        status: 500,
      });
    }
  },
  getUser: async (id: string) => {
    try {
      const user = await cachedFetchJson(
        `${API_BASE_URL}/user/${id}`,
        cacheStrategies.userData()
      );
      return user;
    } catch (err) {
      console.log(err);
      return null;
    }
  },
  getWishlist: async (userId: string) => {
    try {
      const res = await cachedFetchJson(
        `${API_BASE_URL}/user/${userId}/wishlist`,
        cacheStrategies.userData()
      );
      console.log("Wishlist response:", res);
      return res;
    } catch (err) {
      return NextResponse.json(err, { status: 500 });
    }
  },
  mergeWishlist: async (
    wishlistToAdd: ProductCardProps[],
    userId: string | undefined
  ) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${userId}/wishlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wishlistToAdd,
        }),
      });
      const res = await response.json();
      console.log("Wishlist response:", res);
      return res;
    } catch (err) {
      return NextResponse.json(err, { status: 401 });
    }
  },
  getCart: async (userId: string) => {
    try {
      const res = await cachedFetchJson(
        `${API_BASE_URL}/user/${userId}/cart`,
        cacheStrategies.userData()
      );
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
