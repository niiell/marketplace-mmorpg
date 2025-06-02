"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useCurrency } from "../context/CurrencyContext";

export default function CartIcon() {
  const { items, total } = useCart();
  const { format: formatCurrency } = useCurrency();
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [prevCount, setPrevCount] = useState(items.length);
  const itemCount = items.length;

  useEffect(() => {
    if (itemCount > prevCount) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
    }
    setPrevCount(itemCount);
  }, [itemCount, prevCount]);

  return (
    <div className="relative">
      <Link href="/cart">
        <motion.button
          className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label={`Shopping cart with ${itemCount} items`}
        >
          <motion.div
            animate={isAnimating ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <svg
              className="w-6 h-6 text-gray-700 dark:text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>

            {/* Cart item count badge */}
            <AnimatePresence>
              {itemCount > 0 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    backgroundColor: isAnimating ? "#4C1D95" : "#2563EB",
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute -top-2 -right-2 min-w-[20px] h-5 flex items-center justify-center rounded-full text-white text-xs font-medium px-1"
                >
                  {itemCount > 99 ? "99+" : itemCount}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.button>
      </Link>

      {/* Enhanced tooltip with total */}
      <AnimatePresence>
        {isHovered && itemCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
            className="absolute left-1/2 transform -translate-x-1/2 -bottom-16 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 z-50 w-max"
          >
            <div className="flex flex-col items-center gap-1">
              <span>
                {itemCount} {itemCount === 1 ? "item" : "items"} in cart
              </span>
              <span className="font-semibold">{formatCurrency(total)}</span>
            </div>
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-900" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}