"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

interface WishlistButtonProps {
  listingId: number;
}

export default function WishlistButton({ listingId }: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsWishlisted(false);
          setLoading(false);
          return;
        }

        const res = await fetch(`/api/wishlist?user_id=${user.id}`);
        if (!res.ok) throw new Error('Failed to fetch wishlist');
        const json = await res.json();
        if (json.wishlist) {
          setIsWishlisted(json.wishlist.some((item: any) => item.listing_id === listingId));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistStatus();
  }, [listingId]);

  const toggleWishlist = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Please login to manage your wishlist.");
      setLoading(false);
      return;
    }

    if (isWishlisted) {
      // Remove from wishlist
      await fetch(`/api/wishlist?user_id=${user.id}&listing_id=${listingId}`, {
        method: "DELETE",
      });
      setIsWishlisted(false);
    } else {
      // Add to wishlist
      await fetch(`/api/wishlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, listing_id: listingId }),
      });
      setIsWishlisted(true);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={toggleWishlist}
      disabled={loading}
      aria-pressed={isWishlisted}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      tabIndex={0}
      className={`px-3 py-1 rounded ${
        isWishlisted ? "bg-red-500 text-white" : "bg-gray-200 text-gray-800"
      }`}
    >
      {isWishlisted ? "♥" : "♡"} Wishlist
    </button>
  );
}
