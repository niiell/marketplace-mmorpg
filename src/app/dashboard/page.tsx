"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

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
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex gap-4 mb-6">
        <button onClick={() => setTab('listings')} className={tab === 'listings' ? 'font-bold underline' : ''}>Listings</button>
        <button onClick={() => setTab('orders')} className={tab === 'orders' ? 'font-bold underline' : ''}>Orders</button>
        <button onClick={() => setTab('profile')} className={tab === 'profile' ? 'font-bold underline' : ''}>Profile</button>
      </div>
      {tab === 'listings' && (
        <div>
          <h2 className="text-xl font-bold mb-4">Your Listings</h2>
          {listings.length === 0 ? <div>No listings found.</div> : (
            <ul>
              {listings.map((listing: Listing) => (
                <li key={listing.id} className="mb-2 border-b pb-2">{listing.title} - Rp {listing.price}</li>
              ))}
            </ul>
          )}
        </div>
      )}
      {tab === 'orders' && (
        <div>
          <h2 className="text-xl font-bold mb-4">Your Orders</h2>
          {orders.length === 0 ? <div>No orders found.</div> : (
            <ul>
              {orders.map((order: Order) => (
                <li key={order.id} className="mb-2 border-b pb-2">Order #{order.id} - Status: {order.status_order}</li>
              ))}
            </ul>
          )}
        </div>
      )}
      {tab === 'profile' && profile && (
        <div>
          <h2 className="text-xl font-bold mb-4">Profile</h2>
          <div>Email: {user?.email}</div>
          <div>Username: {profile.username}</div>
          <div>Bio: {profile.bio}</div>
        </div>
      )}
    </div>
  );
}