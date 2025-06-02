"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/CartContext";
import { useCurrency } from "../../context/CurrencyContext";
import { useKeyPress } from "../../hooks/useKeyPress";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { SmokeButton } from "../../components/SmokeButton";
import { useRouter } from "next/navigation";
import Modal from "../../components/Modal";
import Toast from "../../components/Toast";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const { format: formatCurrency } = useCurrency();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [itemLoading, setItemLoading] = useState<string | null>(null);
  const [showClearCartModal, setShowClearCartModal] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [focusedItemIndex, setFocusedItemIndex] = useState(-1);

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    setToast({ message, type });
  };

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      setItemLoading(itemId);
      await updateQuantity(itemId, newQuantity);
      showToast("Quantity updated successfully", "success");
    } catch (error) {
      showToast("Failed to update quantity", "error");
    } finally {
      setItemLoading(null);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      setItemLoading(itemId);
      await removeItem(itemId);
      showToast("Item removed from cart", "success");
    } catch (error) {
      showToast("Failed to remove item", "error");
    }
  };

  const handleClearCart = async () => {
    try {
      setIsLoading(true);
      await clearCart();
      setShowClearCartModal(false);
      showToast("Cart cleared successfully", "success");
    } catch (error) {
      showToast("Failed to clear cart", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  // Keyboard navigation
  useKeyPress("ArrowDown", () => {
    if (focusedItemIndex < items.length - 1) {
      setFocusedItemIndex(prev => prev + 1);
    }
  });

  useKeyPress("ArrowUp", () => {
    if (focusedItemIndex > 0) {
      setFocusedItemIndex(prev => prev - 1);
    }
  });

  useKeyPress("Delete", () => {
    if (focusedItemIndex >= 0 && focusedItemIndex < items.length) {
      handleRemoveItem(items[focusedItemIndex].id);
    }
  });

  useKeyPress("+", () => {
    if (focusedItemIndex >= 0 && focusedItemIndex < items.length) {
      const item = items[focusedItemIndex];
      handleQuantityChange(item.id, (item.quantity || 1) + 1);
    }
  });

  useKeyPress("-", () => {
    if (focusedItemIndex >= 0 && focusedItemIndex < items.length) {
      const item = items[focusedItemIndex];
      if ((item.quantity || 1) > 1) {
        handleQuantityChange(item.id, (item.quantity || 1) - 1);
      }
    }
  });

  useKeyPress("Escape", () => {
    setFocusedItemIndex(-1);
  });

  // Focus management
  useEffect(() => {
    if (focusedItemIndex >= 0) {
      const element = document.querySelector(`[data-item-index="${focusedItemIndex}"]`);
      if (element instanceof HTMLElement) {
        element.focus();
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [focusedItemIndex]);

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Skip link for keyboard users */}
      <a 
        href="#cart-items"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-500 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Skip to cart items
      </a>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Shopping Cart
      </h1>

      <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        <p>Keyboard shortcuts:</p>
        <ul className="list-disc list-inside ml-4 space-y-1">
          <li>Up/Down arrows to navigate items</li>
          <li>+ / - to adjust quantity</li>
          <li>Delete to remove item</li>
          <li>Escape to clear selection</li>
        </ul>
      </div>

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
            Your cart is empty
          </p>
          <Link href="/marketplace">
            <SmokeButton variant="primary">Continue Shopping</SmokeButton>
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div id="cart-items" className="lg:col-span-2">
            <AnimatePresence mode="popLayout">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    scale: focusedItemIndex === index ? 1.02 : 1,
                  }}
                  exit={{ opacity: 0, x: -100 }}
                  data-item-index={index}
                  tabIndex={0}
                  onFocus={() => setFocusedItemIndex(index)}
                  className={`flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow mb-4 relative ${
                    itemLoading === item.id ? "opacity-50" : ""
                  } ${
                    focusedItemIndex === index ? "ring-2 ring-blue-500" : ""
                  } focus:outline-none transition-transform duration-200`}
                >
                  {itemLoading === item.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/5 dark:bg-white/5 rounded-lg">
                      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}

                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>

                  <div className="flex-1">
                    <Link
                      href={`/product/${item.id}`}
                      className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {item.title}
                    </Link>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(item.price)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, (item.quantity || 1) - 1)
                        }
                        className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        disabled={itemLoading === item.id}
                      >
                        -
                      </button>
                      <span className="mx-2 min-w-[2rem] text-center">
                        {item.quantity || 1}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, (item.quantity || 1) + 1)
                        }
                        className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        disabled={itemLoading === item.id}
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                      disabled={itemLoading === item.id}
                      aria-label="Remove item"
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Order Summary
              </h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Items ({items.length})</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
              <div className="space-y-4">
                <SmokeButton
                  variant="primary"
                  className="w-full justify-center"
                  onClick={handleCheckout}
                  disabled={isLoading}
                >
                  Proceed to Checkout
                </SmokeButton>
                <button
                  onClick={() => setShowClearCartModal(true)}
                  className="w-full text-sm text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                  disabled={isLoading}
                >
                  Clear Cart
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Clear Cart Confirmation Modal */}
      <Modal
        isOpen={showClearCartModal}
        onClose={() => setShowClearCartModal(false)}
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Clear Cart</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Are you sure you want to remove all items from your cart?
          </p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setShowClearCartModal(false)}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Cancel
            </button>
            <SmokeButton
              variant="primary"
              onClick={handleClearCart}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Clearing...
                </div>
              ) : (
                "Clear Cart"
              )}
            </SmokeButton>
          </div>
        </div>
      </Modal>

      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}