"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";

interface WishlistButtonProps {
  listingId: number;
}

export default function WishlistButton({ listingId }: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [saveCount, setSaveCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchWishlistStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsWishlisted(false);
          setLoading(false);
          return;
        }

        // Fetch wishlist status
        const res = await fetch(`/api/wishlist?user_id=${user.id}`);
        if (!res.ok) throw new Error(`Failed to fetch wishlist: ${res.statusText}`);
        const json = await res.json();
        if (json.wishlist) {
          setIsWishlisted(json.wishlist.some((item: any) => item.listing_id === listingId));
        }

        // Fetch save count
        const { data: stats } = await supabase
          .from('wishlist_stats')
          .select('save_count')
          .eq('listing_id', listingId)
          .single();
        
        if (stats) {
          setSaveCount(stats.save_count);
        }
      } catch (error: any) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistStatus();
  }, [listingId]);

  const toggleWishlist = async () => {
    setIsAnimating(true);
    setLoading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Please login to manage your wishlist.");
      setLoading(false);
      setIsAnimating(false);
      return;
    }

    try {
      if (isWishlisted) {
        await fetch(`/api/wishlist?user_id=${user.id}&listing_id=${listingId}`, {
          method: "DELETE",
        });
        setIsWishlisted(false);
        if (saveCount !== null) setSaveCount(saveCount - 1);
      } else {
        await fetch(`/api/wishlist`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user.id, listing_id: listingId }),
        });
        setIsWishlisted(true);
        if (saveCount !== null) setSaveCount(saveCount + 1);
      }

      // Update save count in stats table
      await supabase
        .from('wishlist_stats')
        .upsert({ 
          listing_id: listingId,
          save_count: saveCount === null ? 1 : (isWishlisted ? saveCount - 1 : saveCount + 1)
        });

    } catch (error: any) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
      // Keep animation running slightly longer than loading state
      setTimeout(() => setIsAnimating(false), 1000);
    }
  };

  return (
    <motion.button
      onClick={toggleWishlist}
      disabled={loading}
      aria-pressed={isWishlisted}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
      className="relative group"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {/* Heart icon with animation */}
      <AnimatePresence mode="wait">
        {isWishlisted ? (
          <motion.div
            key="filled"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors duration-200"
          >
            <svg
              className="w-6 h-6 text-red-500"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </motion.div>
        ) : (
          <motion.div
            key="outline"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <svg
              className="w-6 h-6 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save count badge */}
      {saveCount !== null && saveCount > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 min-w-[1.25rem] h-5 flex items-center justify-center rounded-full bg-blue-500 text-white text-xs px-1"
        >
          {saveCount > 99 ? "99+" : saveCount}
        </motion.div>
      )}

      {/* Heart burst animation */}
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 pointer-events-none flex items-center justify-center"
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  rotate: [0, (360 / 6) * i],
                  x: [0, Math.cos((2 * Math.PI * i) / 6) * 20],
                  y: [0, Math.sin((2 * Math.PI * i) / 6) * 20],
                }}
                transition={{ duration: 0.5 }}
                className="absolute w-1 h-1 bg-red-500 rounded-full"
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading spinner */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-[2px] rounded-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.svg
              className="w-4 h-4 text-gray-500"
              viewBox="0 0 24 24"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear"
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && !loading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 px-2 py-1 mb-2
              bg-gray-900 text-white text-xs rounded whitespace-nowrap z-50"
            role="tooltip"
          >
            {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 
              border-4 border-transparent border-t-gray-900" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Tooltip */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 px-2 py-1 mb-2
              bg-red-500 text-white text-xs rounded whitespace-nowrap z-50"
            role="alert"
          >
            {error}
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 
              border-4 border-transparent border-t-red-500" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}