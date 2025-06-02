"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SkeletonLoader from "./SkeletonLoader";

interface NextButtonGroupProps {
  onLoadMore: () => Promise<void>;
  hasMore: boolean;
  isLoading: boolean;
  loadMoreRef?: (node?: Element | null) => void;
  enableInfiniteScroll?: boolean;
  className?: string;
}

export default function NextButtonGroup({
  onLoadMore,
  hasMore,
  isLoading,
  loadMoreRef,
  enableInfiniteScroll = true,
  className = "",
}: NextButtonGroupProps) {
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [inViewRef, inView] = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  const setRefs = (node: Element | null) => {
    // Combine the refs
    if (loadMoreRef) loadMoreRef(node);
    inViewRef(node);
  };

  const handleLoadMore = async () => {
    try {
      setError(null);
      await onLoadMore();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error loading more items"
      );
      setRetryCount((prev) => prev + 1);
    }
  };

  // Handle infinite scroll
  useEffect(() => {
    if (enableInfiniteScroll && inView && hasMore && !isLoading) {
      handleLoadMore();
    }
  }, [inView, hasMore, isLoading, enableInfiniteScroll]);

  // Reset retry count after successful load
  useEffect(() => {
    if (!isLoading && !error) {
      setRetryCount(0);
    }
  }, [isLoading, error]);

  return (
    <div
      ref={setRefs}
      className={`flex flex-col items-center gap-4 py-8 ${className}`}
    >
      {isLoading && (
        <div className="w-full max-w-sm">
          <SkeletonLoader count={1} height="2.5rem" />
        </div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                {error}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className={`
                w-full rounded-lg px-4 py-2 text-sm font-medium shadow-sm
                ${
                  retryCount >= 3
                    ? "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                    : "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-300 dark:hover:bg-red-900/60"
                }
              `}
            >
              {retryCount >= 3 ? "Try again later" : "Retry"}
            </button>
          </div>
        </motion.div>
      )}

      {hasMore && !enableInfiniteScroll && !isLoading && !error && (
        <motion.button
          onClick={handleLoadMore}
          disabled={isLoading}
          className="group relative inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-700 dark:hover:bg-gray-700"
          whileHover={{ y: -1 }}
          whileTap={{ y: 1 }}
        >
          Load more
          <div className="absolute -bottom-px left-1/2 h-px w-14 -translate-x-1/2 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </motion.button>
      )}

      {!hasMore && !isLoading && !error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-gray-500 dark:text-gray-400"
        >
          No more items to load
        </motion.p>
      )}
    </div>
  );
}