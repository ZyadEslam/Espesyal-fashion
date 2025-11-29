import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { ProductCardProps } from "../types/types";
import { cachedFetchJson, cacheStrategies } from "./cachedFetch";

export async function getBaseUrl(): Promise<string> {
  // Browser should use relative URL
  if (typeof window !== "undefined") {
    return "";
  }

  // For server-side, try to get the host from headers
  // This works correctly even with Vercel deployment protection
  try {
    const headersList = await headers();
    const host = headersList.get("host");
    const protocol = headersList.get("x-forwarded-proto") || "https";

    if (host) {
      return `${protocol}://${host}`;
    }
  } catch (error) {
    // If headers() fails (e.g., in static generation), fall back to env vars
    console.warn("Could not get headers for base URL:", error);
  }

  // Fallback to environment variables
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  // For Vercel preview deployments, avoid using VERCEL_URL to prevent auth issues
  // Use relative URLs which Next.js will resolve correctly
  return "";
}

export const api = {
  getProducts: async (): Promise<ProductCardProps[]> => {
    const baseUrl = await getBaseUrl();
    const apiBaseUrl = baseUrl ? `${baseUrl}/api` : "/api";
    console.log("API_BASE_URL:", apiBaseUrl);

    try {
      const data = await cachedFetchJson<{ products: ProductCardProps[] }>(
        `${apiBaseUrl}/product`,
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
      const baseUrl = await getBaseUrl();
      const apiBaseUrl = baseUrl ? `${baseUrl}/api` : "/api";
      const url = `${apiBaseUrl}/product/${id}`;
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
      const baseUrl = await getBaseUrl();
      const apiBaseUrl = baseUrl ? `${baseUrl}/api` : "/api";
      const user = await cachedFetchJson(
        `${apiBaseUrl}/user/${id}`,
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
      const baseUrl = await getBaseUrl();
      const apiBaseUrl = baseUrl ? `${baseUrl}/api` : "/api";
      const res = await cachedFetchJson<{ cart: ProductCardProps[] }>(
        `${apiBaseUrl}/user/${userId}/cart`,
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
      const baseUrl = await getBaseUrl();
      const apiBaseUrl = baseUrl ? `${baseUrl}/api` : "/api";
      const response = await fetch(`${apiBaseUrl}/user/${userId}/cart`, {
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
      const baseUrl = await getBaseUrl();
      const apiBaseUrl = baseUrl ? `${baseUrl}/api` : "/api";
      const response = await fetch(`${apiBaseUrl}/user/${userId}/cart`, {
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
