import { NextResponse } from "next/server";
import { ProductCardProps } from "../types/types";
import { cachedFetchJson, cacheStrategies } from "./cachedFetch";

export function getBaseUrl() {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  // Check for Vercel deployment URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  // Check for custom domain or production URL
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  // Fallback to localhost for development
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

const API_BASE_URL = `${getBaseUrl()}/api`;

export const api = {
  getProducts: async (): Promise<ProductCardProps[]> => {
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
      // Return empty array on error instead of the error object
      return [];
    }
  },
  getProduct: async (id: string) => {
    const url = `${API_BASE_URL}/product/${id}`;
    console.log("Fetching product from URL:", url);
    try {
      const data = await cachedFetchJson<{ product: ProductCardProps; success: boolean }>(
        url,
        cacheStrategies.products()
      );
      
      console.log("Product API response:", { success: data.success, hasProduct: !!data.product });
      
      if (!data.success || !data.product) {
        throw new Error("Product not found");
      }
      
      return data.product;
    } catch (error) {
      console.error("Error fetching product:", error);
      console.error("Failed URL:", url);
      console.error("API_BASE_URL:", API_BASE_URL);
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch product data";
      throw new Error(errorMessage);
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
  getCart: async (userId: string): Promise<{ cart: ProductCardProps[] }> => {
    try {
      const res = await cachedFetchJson<{ cart: ProductCardProps[] }>(
        `${API_BASE_URL}/user/${userId}/cart`,
        cacheStrategies.userData()
      );
      console.log("Cart response:", res);
      return res;
    } catch (err) {
      console.error("Error fetching cart:", err);
      // Return empty cart on error instead of NextResponse
      return { cart: [] };
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
