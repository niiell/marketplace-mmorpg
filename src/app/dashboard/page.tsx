"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function DashboardPage() {
  const [tab, setTab] = useState<'listings' | 'orders' | 'profile'>('listings');
  const [user, setUser] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
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
              {listings.map((l: any) => (
                <li key={l.id} className="mb-2 border-b pb-2">{l.title} - Rp {l.price}</li>
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
              {orders.map((o: any) => (
                <li key={o.id} className="mb-2 border-b pb-2">Order #{o.id} - Status: {o.status_order}</li>
              ))}
            </ul>
          )}
        </div>
      )}
      {tab === 'profile' && profile && (
        <div>
          <h2 className="text-xl font-bold mb-4">Profile</h2>
          <div>Email: {user.email}</div>
          <div>Username: {profile.username}</div>
          <div>Bio: {profile.bio}</div>
        </div>
      )}
    </div>
  );
}
