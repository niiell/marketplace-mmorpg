"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ListingCard from "../../components/ListingCard";
import { supabase } from "../../lib/supabase";
import { SmokeButton } from "../../components/SmokeButton";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";

interface Listing {
  id: string;
  title: string;
  price: number;
  image_url: string;
  category: string;
  rarity?: string;
  level?: number;
  seller: {
    username: string;
    seller_rating: number;
    avatar_url?: string;
  };
  status: string;
  created_at: string;
}

export default function MarketplacePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchListings();
  }, []);

  async function fetchListings() {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          profiles:seller_id (
            username,
            seller_rating,
            avatar_url
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedListings: Listing[] = (data || []).map(item => ({
        id: item.id.toString(),
        title: item.title,
        price: item.price,
        image_url: item.image_url || '/placeholder-image.jpg',
        category: item.category || 'Uncategorized',
        rarity: item.rarity,
        level: item.level,
        seller: {
          username: item.profiles?.username || 'Unknown Seller',
          seller_rating: item.profiles?.seller_rating || 0,
          avatar_url: item.profiles?.avatar_url
        },
        status: item.status,
        created_at: item.created_at
      }));

      setListings(formattedListings);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Marketplace</h1>
        {user && (
          <Link href="/listing/new">
            <SmokeButton variant="primary" className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              <span>Jual Barang</span>
            </SmokeButton>
          </Link>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-64" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ListingCard 
                {...listing}
                image={listing.image_url}
                seller={{
                  name: listing.seller.username,
                  rating: listing.seller.seller_rating,
                  avatarUrl: listing.seller.avatar_url
                }}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}