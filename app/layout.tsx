import type { Metadata } from "next";
// import { Outfit } from "next/font/google";
import localFont from "next/font/local";

import "./style/globals.css";
import AuthProvider from "./components/providers/AuthProvider";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../lib/auth";
import { Footer, UserNav } from "./components";
import CtxProviders from "./components/providers/CtxProvider";
import {
  WebSiteSchema,
  OrganizationSchema,
} from "./components/seo/SEOComponents";
import { PerformanceMonitor } from "./components/seo/PerformanceOptimizations";

const outfit = localFont({
  src: "../fonts/Outfit-VariableFont_wght.ttf",
  variable: "--font-outfit400",
  display: "swap",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Espesyal Shop - Premium E-commerce Store",
  description:
    "Discover premium quality products at Espesyal Shop. We offer exceptional customer service and a curated selection of high-quality goods for your lifestyle needs.",
  keywords: [
    "e-commerce",
    "online shopping",
    "premium products",
    "quality goods",
    "lifestyle",
    "shopping",
    "retail",
    "brands",
  ],
  authors: [{ name: "Espesyal Shop" }],
  creator: "Espesyal Shop",
  publisher: "Espesyal Shop",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://espesyal-shop.vercel.app",
    title: "Espesyal Shop - Premium E-commerce Store",
    description:
      "Discover premium quality products at Espesyal Shop. We offer exceptional customer service and a curated selection of high-quality goods for your lifestyle needs.",
    siteName: "Espesyal Shop",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Espesyal Shop - Premium E-commerce Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@espesyalshop",
    creator: "@espesyalshop",
    title: "Espesyal Shop - Premium E-commerce Store",
    description:
      "Discover premium quality products at Espesyal Shop. We offer exceptional customer service and a curated selection of high-quality goods for your lifestyle needs.",
    images: ["/og-image.jpg"],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION,
  },
  alternates: {
    canonical:
      process.env.NEXT_PUBLIC_SITE_URL || "https://espesyal-shop.vercel.app",
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://espesyal-shop.vercel.app"
  ),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://espesyal-shop.vercel.app";

  const organizationData = {
    name: "Espesyal Shop",
    description:
      "Premium e-commerce store offering high-quality products with exceptional customer service.",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    contactPoint: {
      contactType: "customer service",
      email: "support@espesyalshop.com",
    },
    sameAs: [
      "https://facebook.com/espesyalshop",
      "https://twitter.com/espesyalshop",
      "https://instagram.com/espesyalshop",
    ],
  };

  return (
    <html lang="en">
      <head>
        <WebSiteSchema siteUrl={siteUrl} />
        <OrganizationSchema organization={organizationData} />
      </head>
      <body
        className={`${outfit.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider session={session}>
          <CtxProviders>
            <PerformanceMonitor />
            <UserNav />
            <main>{children}</main>
            <Footer />
          </CtxProviders>
        </AuthProvider>
      </body>
    </html>
  );
}
