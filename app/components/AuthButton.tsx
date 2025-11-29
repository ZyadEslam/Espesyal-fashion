"use client";
import { assets } from "@/public/assets/assets";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import { useCart } from "../hooks/useCart";

export default function AuthButtons(screen: { screen: "mobile" | "desktop" }) {
  const { data: session } = useSession();
  const { manualSync: syncCart } = useCart();
  const t = useTranslations("nav");
  const handleSignIn = async () => {
    try {
      console.log("🚀 Starting Google sign in...");
      const result = await signIn("google", {
        callbackUrl: "/",
        redirect: true,
      });
      console.log("✅ SignIn result:", result);
    } catch (error) {
      console.error("❌ SignIn error:", error);
    }
  };
  const handleSignout = async () => {
    console.log("🚪 Sign out button clicked");
    try {
      await syncCart();
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("❌ SignOut error:", error);
    }
  };

  // console.log("🔍 Session status:", status);
  // console.log("👤 Session data:", session);

  if (session?.user) {
    if (screen.screen === "mobile") {
      return (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-gray-700">
            <span className="text-sm font-medium">
              {session.user.name || session.user.email?.split("@")[0]}
            </span>
          </div>
          <span
            className="cursor-pointer text-orange hover:text-orange/80 transition-colors font-medium"
            onClick={() => {
              handleSignout();
            }}
          >
            {t("signOut")}
          </span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-4 cursor-pointer ">
        <span>{session.user.name?.toUpperCase()}</span>
        <span
          className="sm:hidden md:block"
          onClick={() => {
            handleSignout();
          }}
        >
          {t("signOut")}
        </span>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2 cursor-pointer sm:order-2 md:order-auto">
        <Image src={assets.user_icon} alt="User" />
        <p onClick={handleSignIn}>{t("myAccount")}</p>
      </div>
    </>
  );
}
