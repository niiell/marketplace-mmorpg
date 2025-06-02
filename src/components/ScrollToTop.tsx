"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUpIcon } from "@heroicons/react/24/outline";

interface ScrollToTopProps {
  threshold?: number;
  behavior?: ScrollBehavior;
  className?: string;
}

export default function ScrollToTop({
  threshold = 400,
  behavior = "smooth",
  className = "",
}: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior,
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={scrollToTop}
          className={`
            fixed right-4 bottom-4 z-50 flex h-10 w-10 items-center justify-center rounded-full
            bg-gray-900 text-white shadow-lg transition-colors hover:bg-gray-800
            dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100
            ${className}
          `}
          aria-label="Scroll to top"
        >
          <ChevronUpIcon className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// Additional hook for component-level scroll position management
export function useScrollPosition(options = { threshold: 0 }) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isAboveThreshold, setIsAboveThreshold] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
      setIsAboveThreshold(position > options.threshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [options.threshold]);

  return { scrollPosition, isAboveThreshold };
}