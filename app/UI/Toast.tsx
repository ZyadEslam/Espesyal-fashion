"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";

interface toastProps {
  state: string;
  message: string;
}
const Toast = ({ state, message }: toastProps) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 100 }}
        animate={{ x: 0 }}
        exit={{ x: 100 }}
        transition={{ duration: 0.2 }}
        className={`${
          state === "success" ? "bg-green-400" : "bg-red-500"
        } toast`}
      >
        {message}
      </motion.div>
    </AnimatePresence>
  );
};

export default Toast;
