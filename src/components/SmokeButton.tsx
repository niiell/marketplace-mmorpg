"use client";

import { motion } from "framer-motion";

export default function SmokeButton({
  children,
  onClick,
  className = "",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.05, boxShadow: "0 0 8px rgba(255, 69, 0, 0.8)" }}
      whileTap={{ scale: 0.95 }}
      disabled={disabled}
      className={`bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 text-white font-bold py-2 px-4 rounded ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      {children}
    </motion.button>
  );
}