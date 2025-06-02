"use client";

import { motion } from "framer-motion";

interface SkeletonLoaderProps {
  count?: number;
  height?: string;
  className?: string;
  type?: "simple" | "listing" | "chat" | "profile" | "detail";
}

export default function SkeletonLoader({
  count = 6,
  height,
  className,
  type = "simple",
}: SkeletonLoaderProps) {
  const containerClass =
    type === "listing"
      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      : "space-y-4";

  // Shimmer effect animation
  const shimmerVariants = {
    initial: { x: "-100%" },
    animate: { x: "100%" },
  };

  return (
    <div
      className={containerClass}
      role="status"
      aria-label="Loading content"
      aria-busy="true"
    >
      {[...Array(count)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: index * 0.1,
            ease: "easeOut",
          }}
          className={`relative overflow-hidden ${className}`}
        >
          {type === "listing" ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 space-y-4">
              {/* Image placeholder with shimmer */}
              <div className="relative h-48 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  variants={shimmerVariants}
                  animate="animate"
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </div>

              {/* Content placeholders */}
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-1/2" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-24" />
                  </div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md w-20" />
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded-md w-28" />
                  <div className="flex space-x-2">
                    <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          ) : type === "detail" ? (
            <div className="space-y-6">
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  variants={shimmerVariants}
                  animate="animate"
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-full" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-2/3" />
                </div>
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-md w-1/3" />
              </div>
            </div>
          ) : type === "chat" ? (
            <div className="flex items-start space-x-4">
              <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                </div>
                <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4" />
              </div>
            </div>
          ) : type === "profile" ? (
            <div className="space-y-4">
              <div className="h-24 w-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto" />
              <div className="space-y-2">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-2/3 mx-auto" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div
              className="h-4 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden"
              style={{ height: height || "1rem" }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                variants={shimmerVariants}
                animate="animate"
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </div>
          )}
        </motion.div>
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
}