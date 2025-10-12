"use client";
import React from "react";
import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

const LoadingSpinner = ({
  size = "md",
  text,
  className = "",
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div className={`flex flex-col justify-center items-center ${className}`}>
      <motion.div
        className={`${sizeClasses[size]} relative`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-2 border-primary/20"></div>

        {/* Animated arc */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-r-primary"></div>

        {/* Inner dot */}
        <motion.div
          className="absolute top-1 left-1/2 w-1 h-1 bg-primary rounded-full transform -translate-x-1/2"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {text && (
        <motion.p
          className={`${textSizeClasses[size]} text-gray-600 mt-3 font-medium`}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingSpinner;
