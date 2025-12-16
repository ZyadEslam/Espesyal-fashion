"use client";
import { useEffect } from "react";

/**
 * Component that adds Stripe preconnects only on checkout page
 * This improves performance by not loading Stripe resources on other pages
 */
export default function StripePreconnects() {
  useEffect(() => {
    // Check if links already exist to avoid duplicates
    const existingLinks = Array.from(
      document.head.querySelectorAll("link[href*='stripe.com']")
    );
    if (existingLinks.length > 0) {
      return; // Links already exist, skip adding
    }

    // Add DNS prefetch for Stripe domains
    const dnsPrefetch1 = document.createElement("link");
    dnsPrefetch1.rel = "dns-prefetch";
    dnsPrefetch1.href = "//js.stripe.com";
    document.head.appendChild(dnsPrefetch1);

    const dnsPrefetch2 = document.createElement("link");
    dnsPrefetch2.rel = "dns-prefetch";
    dnsPrefetch2.href = "//api.stripe.com";
    document.head.appendChild(dnsPrefetch2);

    // Add preconnect for critical Stripe resources
    const preconnect1 = document.createElement("link");
    preconnect1.rel = "preconnect";
    preconnect1.href = "https://js.stripe.com";
    preconnect1.crossOrigin = "anonymous";
    document.head.appendChild(preconnect1);

    const preconnect2 = document.createElement("link");
    preconnect2.rel = "preconnect";
    preconnect2.href = "https://api.stripe.com";
    preconnect2.crossOrigin = "anonymous";
    document.head.appendChild(preconnect2);

    // Cleanup function to remove links when component unmounts
    return () => {
      // Safely remove links if they still exist
      if (dnsPrefetch1.parentNode) {
        document.head.removeChild(dnsPrefetch1);
      }
      if (dnsPrefetch2.parentNode) {
        document.head.removeChild(dnsPrefetch2);
      }
      if (preconnect1.parentNode) {
        document.head.removeChild(preconnect1);
      }
      if (preconnect2.parentNode) {
        document.head.removeChild(preconnect2);
      }
    };
  }, []);

  return null; // This component doesn't render anything
}
