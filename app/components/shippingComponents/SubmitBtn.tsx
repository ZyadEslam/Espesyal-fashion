"use client";
import { useFormStatus } from "react-dom";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("shipping.submit");

  return (
    <motion.button
      type="submit"
      disabled={pending}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full bg-orange text-white px-6 py-3 rounded-lg font-medium hover:bg-orange/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? t("saving") : t("saveAddress")}
    </motion.button>
  );
}
