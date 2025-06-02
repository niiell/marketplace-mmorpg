"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SmokeButton } from "./SmokeButton";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";
import { useCurrency } from "../context/CurrencyContext";

interface BuyButtonProps {
  item: {
    id: string;
    title: string;
    price: number;
    image_url: string;
    stock?: number; // Optional stock count
    max_per_order?: number; // Optional max items per order
  };
  variant?: "primary" | "secondary";
  disabled?: boolean;
  className?: string;
}

export default function BuyButton({
  item,
  variant = "primary",
  disabled = false,
  className = "",
}: BuyButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isQuantityOpen, setIsQuantityOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addItem, items, total } = useCart();
  const { format: formatCurrency } = useCurrency();
  const router = useRouter();

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;

    // Don't go below 1
    if (newQuantity < 1) return;

    // Check stock limit
    if (item.stock && newQuantity > item.stock) {
      setError(`Only ${item.stock} items available`);
      return;
    }

    // Check max per order limit
    if (item.max_per_order && newQuantity > item.max_per_order) {
      setError(`Maximum ${item.max_per_order} items per order`);
      return;
    }

    setQuantity(newQuantity);
    setError(null);
  };

  const handleAddToCart = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if this would exceed stock
      if (item.stock) {
        const existingItem = items.find((i) => i.id === item.id);
        const existingQty = existingItem?.quantity || 0;
        if (existingQty + quantity > item.stock) {
          setError(
            `Cannot add ${quantity} more items. Only ${
              item.stock - existingQty
            } available`
          );
          return;
        }
      }

      // Check if this would exceed max per order
      if (item.max_per_order) {
        const existingItem = items.find((i) => i.id === item.id);
        const existingQty = existingItem?.quantity || 0;
        if (existingQty + quantity > item.max_per_order) {
          setError(
            `Cannot add ${quantity} more items. Maximum ${item.max_per_order} per order`
          );
          return;
        }
      }

      await addItem({ ...item, quantity });
      setShowSuccess(true);
      setShowPreview(true);
      setIsQuantityOpen(false);
      setQuantity(1); // Reset quantity after successful add

      // Hide success message after 1.5s
      setTimeout(() => {
        setShowSuccess(false);
      }, 1500);

      // Hide preview after 3s
      setTimeout(() => {
        setShowPreview(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      setError("Failed to add to cart");
    } finally {
      setIsLoading(false);
    }
  };

  const goToCart = () => {
    router.push("/cart");
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <motion.div
          animate={{
            width: isQuantityOpen ? "auto" : 0,
            opacity: isQuantityOpen ? 1 : 0,
          }}
          initial={false}
          className="overflow-hidden"
        >
          <div className="flex items-center bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleQuantityChange(-1)}
              className="px-2 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              -
            </motion.button>
            <motion.span
              key={quantity}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="w-8 text-center font-medium"
            >
              {quantity}
            </motion.span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleQuantityChange(1)}
              className="px-2 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              +
            </motion.button>
          </div>

          {/* Stock/max order info */}
          {(item.stock || item.max_per_order) && (
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {item.stock && (
                <span className="mr-2">In stock: {item.stock}</span>
              )}
              {item.max_per_order && (
                <span>Max per order: {item.max_per_order}</span>
              )}
            </div>
          )}
        </motion.div>

        <SmokeButton
          onClick={
            isQuantityOpen ? handleAddToCart : () => setIsQuantityOpen(true)
          }
          disabled={disabled || isLoading || (item.stock !== undefined && item.stock === 0)}
          variant={variant}
          className={`relative ${className}`}
        >
          <span className="flex items-center space-x-2">
            {isLoading ? (
              <motion.div
                className="flex items-center space-x-2"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Adding to Cart...</span>
              </motion.div>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      isQuantityOpen
                        ? "M5 13l4 4L19 7" // Checkmark
                        : "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" // Cart
                    }
                  />
                </svg>
                <span>
                  {item.stock === 0 ? "Out of Stock" : (isQuantityOpen ? "Add to Cart" : "Select Quantity")}
                </span>
              </>
            )}
          </span>
        </SmokeButton>
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute left-0 right-0 mt-2 px-3 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-md"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success animation */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute inset-0 flex items-center justify-center bg-green-500 text-white rounded-md"
          >
            <motion.div className="flex items-center space-x-2">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Added to Cart!</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mini Cart Preview */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Cart ({items.length} items)
                </span>
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {formatCurrency(total)}
                </span>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-t border-gray-200 dark:border-gray-700 pt-3"
              >
                <button
                  onClick={goToCart}
                  className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                >
                  View Cart
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}