"use client";

import { motion } from "framer-motion";

interface LoadingOverlayProps {
  isLoading: boolean;
  blur?: boolean;
  message?: string;
  className?: string;
}

export default function LoadingOverlay({
  isLoading,
  blur = true,
  message = "Loading...",
  className = "",
}: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`absolute inset-0 flex items-center justify-center z-50 ${
        blur ? "backdrop-blur-[2px]" : ""
      } bg-white/50 dark:bg-gray-900/50 ${className}`}
      role="alert"
      aria-busy="true"
      aria-label={message}
    >
      <div className="flex flex-col items-center space-y-3">
        <div className="relative w-12 h-12">
          {/* Outer spinning ring */}
          <motion.div
            className="absolute inset-0 border-4 border-blue-500/30 dark:border-blue-400/30 rounded-full"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          {/* Inner spinning ring */}
          <motion.div
            className="absolute inset-2 border-4 border-t-blue-600 dark:border-t-blue-400 border-transparent rounded-full"
            animate={{ rotate: -360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>
        {message && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-medium text-gray-600 dark:text-gray-300"
          >
            {message}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}