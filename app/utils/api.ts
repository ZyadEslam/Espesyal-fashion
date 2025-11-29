import { NextResponse } from "next/server";
import { ProductCardProps } from "../types/types";
import { cachedFetchJson, cacheStrategies } from "./cachedFetch";

export function getBaseUrl() {
  if (typeof window !== "undefined") return ""; // browser should use relative url

  // In production, prefer NEXT_PUBLIC_SITE_URL if set
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  // Fallback to VERCEL_URL for Vercel deployments
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Development fallback
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
  getProduct: async (id: string): Promise<ProductCardProps> => {
    try {
      // Use absolute URL for server-side rendering
      const url = `${API_BASE_URL}/product/${id}`;
      console.log("Fetching product from URL:", url);

      const data = await cachedFetchJson<{ product: ProductCardProps }>(
        url,
        cacheStrategies.products()
      );

      if (!data || !data.product) {
        throw new Error("Product not found");
      }

      return data.product;
    } catch (error) {
      console.error("Error fetching product:", error);
      console.error("API_BASE_URL:", API_BASE_URL);
      console.error("Product ID:", id);

      // Provide more detailed error message
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "string"
          ? error
          : "Failed to fetch product. Please check your database connection and API configuration.";

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
