"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { SmokeButton } from "../../components/SmokeButton";
import { motion } from "framer-motion";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Listing {
  id: number;
  title: string;
  price: number;
  seller_id: number;
}

interface Order {
  id: number;
  status_order: string;
  buyer_id: number;
  seller_id: number;
}

interface Profile {
  id: number;
  username: string;
  bio: string;
  user_id: number;
}

interface User {
  id: string;
  email?: string;
}

export default function DashboardPage() {
  const [tab, setTab] = useState<'listings' | 'orders' | 'profile'>('listings');
  const [user, setUser] = useState<User | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      setUser(user);
      const [{ data: listings }, { data: orders }, { data: profile }] = await Promise.all([
        supabase.from('listings').select('*').eq('seller_id', user.id),
        supabase.from('transactions').select('*').or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`),
        supabase.from('profiles').select('*').eq('user_id', user.id).single(),
      ]);
      setListings(listings || []);
      setOrders(orders || []);
      setProfile(profile || null);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
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
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Active Listings Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Listing Aktif</h2>
            {listings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <motion.div
                    key={listing.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-2 border-b pb-2">{listing.title} - Rp {listing.price}</div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400 mb-4">Anda belum memiliki listing aktif</p>
                <Link href="/listing/new">
                  <SmokeButton variant="primary">Buat Listing Baru</SmokeButton>
                </Link>
              </div>
            )}
          </section>

          {/* Recent Transactions Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Transaksi Terbaru</h2>
            {orders.length > 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <ul>
                  {orders.map((order: Order) => (
                    <li key={order.id} className="mb-2 border-b pb-2">Order #{order.id} - Status: {order.status_order}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-center py-8 text-gray-600 dark:text-gray-400">
                Belum ada transaksi
              </p>
            )}
          </section>

          {/* Profile Section */}
          {tab === 'profile' && profile && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">Profile</h2>
              <div>Email: {user?.email}</div>
              <div>Username: {profile.username}</div>
              <div>Bio: {profile.bio}</div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}