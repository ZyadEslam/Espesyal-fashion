import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "../style/globals.css";
import AuthProvider from "../components/providers/AuthProvider";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/auth";
import { Footer, UserNav, TopNav } from "../components";
import CtxProviders from "../components/providers/CtxProvider";
import { PerformanceMonitor } from "../components/seo/PerformanceOptimizations";
import { routing } from "../../routing";

const outfit = localFont({
  src: "../../fonts/Tajawal/Tajawal-Regular.ttf",
  variable: "--font-tajawal400",
  display: "swap",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Espesyal Shop - Premium E-commerce Store",
  description:
    "Discover premium quality products at Espesyal Shop. We offer exceptional customer service and a curated selection of high-quality goods for your lifestyle needs.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as "en" | "ar")) {
    notFound();
  }

  // Enable static rendering for the locale
  setRequestLocale(locale);

  // Load messages for the current locale
  const messages = await getMessages();
  const session = await getServerSession(authOptions);

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${outfit.variable} antialiased`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages}>
          <AuthProvider session={session}>
            <CtxProviders>
              <PerformanceMonitor />
              <TopNav />
              <UserNav />
              <main>{children}</main>
              <Footer />
            </CtxProviders>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
