"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { SmokeButton } from "./SmokeButton";

interface ChatButtonProps {
  listingId: number;
  unreadCount?: number;
  onClick?: () => void;
  className?: string;
}

export default function ChatButton({
  listingId,
  unreadCount = 0,
  onClick,
  className = "",
}: ChatButtonProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (onClick) {
      onClick();
      return;
    }

    setIsLoading(true);
    try {
      await router.push(`/chat/${listingId}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger animation when unread count changes
  useEffect(() => {
    if (unreadCount > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [unreadCount]);

  return (
    <motion.div
      className={`relative inline-block ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <SmokeButton
        onClick={handleClick}
        variant="secondary"
        disabled={isLoading}
        aria-label={`Open chat${
          unreadCount > 0 ? ` (${unreadCount} unread messages)` : ""
        }`}
        className="relative flex items-center space-x-2 min-w-[90px] justify-center"
      >
        <div className="relative">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>

          {/* Animated ripple effect */}
          <AnimatePresence>
            {isHovered && !isLoading && (
              <>
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 rounded-full border-2 border-current opacity-50"
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{
                      scale: 1.5 + i * 0.2,
                      opacity: 0,
                    }}
                    exit={{ scale: 2, opacity: 0 }}
                    transition={{
                      duration: 1,
                      delay: i * 0.2,
                      repeat: Infinity,
                      repeatDelay: 0.5,
                    }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>
        </div>

        <span>Chat</span>

        {/* Loading spinner */}
        <AnimatePresence>
          {isLoading && (
            <motion.svg
              className="absolute inset-0 m-auto w-5 h-5 text-current"
              viewBox="0 0 24 24"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, rotate: 360 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </motion.svg>
          )}
        </AnimatePresence>

        {/* Unread count badge */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: isAnimating ? [1, 1.2, 1] : 1,
                opacity: 1,
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                duration: 0.3,
                scale: {
                  duration: 0.2,
                  times: isAnimating ? [0, 0.5, 1] : undefined,
                },
              }}
              className="absolute -top-2 -right-2 min-w-[20px] h-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-medium px-1"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </motion.div>
          )}
        </AnimatePresence>
      </SmokeButton>

      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && unreadCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
            className="absolute left-1/2 transform -translate-x-1/2 -bottom-8 whitespace-nowrap bg-gray-900 text-white text-xs rounded px-2 py-1"
            role="tooltip"
          >
            {unreadCount} unread {unreadCount === 1 ? "message" : "messages"}
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-900" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
