"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SmokeButton } from "./SmokeButton";

interface BuyButtonProps {
  price: number;
  currency: string;
  onBuy: () => Promise<void>;
  disabled?: boolean;
  className?: string;
}

export default function BuyButton({
  price,
  currency,
  onBuy,
  disabled = false,
  className = "",
}: BuyButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleClick = () => {
    if (!disabled && !isLoading) {
      setShowConfirm(true);
    }
  };

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      setShowConfirm(false);
      await onBuy();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      // Error handling will be managed by the parent component
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SmokeButton
        onClick={handleClick}
        disabled={disabled || isLoading}
        variant={disabled ? "disabled" : "primary"}
        className={`relative ${className}`}
      >
        <span className="flex items-center space-x-2">
          {isLoading ? (
            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <svg
                className="animate-spin h-5 w-5"
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
              <span>Processing...</span>
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span>
                Buy Now • {currency} {price.toLocaleString()}
              </span>
            </>
          )}
        </span>

        {/* Success animation overlay */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-green-500 text-white rounded-lg"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center space-x-2"
              >
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
                <span>Purchase Complete!</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </SmokeButton>

      {/* Confirmation modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowConfirm(false)}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-sm w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Confirm Purchase
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Are you sure you want to purchase this item for{" "}
                {currency} {price.toLocaleString()}?
              </p>
              <div className="flex space-x-3">
                <SmokeButton
                  variant="primary"
                  onClick={handleConfirm}
                  className="flex-1"
                >
                  Confirm
                </SmokeButton>
                <SmokeButton
                  variant="secondary"
                  onClick={() => setShowConfirm(false)}
                  className="flex-1"
                >
                  Cancel
                </SmokeButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}