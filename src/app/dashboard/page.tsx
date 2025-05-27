"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import { SmokeButton } from "../../components/SmokeButton";
import Link from "next/link";
import { motion } from "framer-motion";
import ListingCard from "../../components/ListingCard";

interface ListingData {
  id: number;
  title: string;
  price: number;
  image_url: string | null;
  category: string | null;
  rarity: string | null;
  level: number | null;
  status: string;
  seller_id: string;
  profiles: {
    username: string | null;
    seller_rating: number | null;
    avatar_url: string | null;
  } | null;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchListings();
    }
  }, [user]);

  async function fetchListings() {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          profiles (
            username,
            seller_rating,
            avatar_url
          )
        `)
        .eq('seller_id', user?.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedListings = (data as ListingData[]).map(listing => ({
        id: listing.id.toString(),
        title: listing.title,
        price: listing.price,
        image: listing.image_url || '/placeholder-image.jpg',
        category: listing.category || 'Uncategorized',
        rarity: listing.rarity || 'Common',
        level: listing.level || 1,
        seller: {
          name: listing.profiles?.username || 'Unknown Seller',
          rating: listing.profiles?.seller_rating || 0,
          avatarUrl: listing.profiles?.avatar_url || undefined
        }
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
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Link href="/listing/new">
          <SmokeButton variant="primary" className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>Jual Barang</span>
          </SmokeButton>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-64" />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Listing Aktif</h2>
            {listings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <motion.div
                    key={listing.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ListingCard {...listing} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">
                  Anda belum memiliki listing aktif. Klik tombol "Jual Barang" di atas untuk mulai berjualan.
                </p>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}