import type { Metadata } from "next";
// import { Outfit } from "next/font/google";
import localFont from "next/font/local";

import "./style/globals.css";
import AuthProvider from "./components/providers/AuthProvider";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../lib/auth";
import { Footer, UserNav } from "./components";
import CtxProviders from "./components/providers/CtxProvider";

const outfit = localFont({
  src: "../fonts/Outfit-VariableFont_wght.ttf",
  variable: "--font-outfit400",
  display: "swap",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "QuickCart",
  description: "QuickCart",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body
        className={`${outfit.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider session={session}>
          <CtxProviders>
            <UserNav />
            <main>{children}</main>
            <Footer />
          </CtxProviders>
        </AuthProvider>
      </body>
    </html>
  );
}
