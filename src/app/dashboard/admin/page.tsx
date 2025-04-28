"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AdminDashboardPage() {
  const [tab, setTab] = useState<'pending' | 'users'>('pending');
  const [pending, setPending] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: pending }, { data: users }] = await Promise.all([
        supabase.from('transactions').select('*').eq('status_order', 'pending'),
        supabase.from('profiles').select('user_id, username, banned'),
      ]);
      setPending(pending || []);
      setUsers(users || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleApprove = async (id: number) => {
    setActionMsg('');
    const { error } = await supabase.from('transactions').update({ status_order: 'APPROVED' }).eq('id', id);
    if (!error) {
      setActionMsg('Transaction approved.');
      setPending(pending.filter((t) => t.id !== id));
    } else {
      setActionMsg('Failed to approve transaction.');
    }
  };

  const handleBan = async (user_id: string) => {
    setActionMsg('');
    const { error } = await supabase.from('profiles').update({ banned: true }).eq('user_id', user_id);
    if (!error) {
      setActionMsg('User banned.');
      setUsers(users.map((u) => u.user_id === user_id ? { ...u, banned: true } : u));
    } else {
      setActionMsg('Failed to ban user.');
    }
  };

  const handleUnban = async (user_id: string) => {
    setActionMsg('');
    const { error } = await supabase.from('profiles').update({ banned: false }).eq('user_id', user_id);
    if (!error) {
      setActionMsg('User unbanned.');
      setUsers(users.map((u) => u.user_id === user_id ? { ...u, banned: false } : u));
    } else {
      setActionMsg('Failed to unban user.');
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex gap-4 mb-6">
        <button onClick={() => setTab('pending')} className={tab === 'pending' ? 'font-bold underline' : ''}>Pending Transactions</button>
        <button onClick={() => setTab('users')} className={tab === 'users' ? 'font-bold underline' : ''}>Users</button>
      </div>
      {actionMsg && <div className="mb-4 text-green-700">{actionMsg}</div>}
      {tab === 'pending' && (
        <div>
          <h2 className="text-xl font-bold mb-4">Pending Transactions</h2>
          {pending.length === 0 ? <div>No pending transactions.</div> : (
            <ul>
              {pending.map((t) => (
                <li key={t.id} className="mb-2 border-b pb-2 flex justify-between items-center">
                  <span>Order #{t.id} - Rp {t.amount} - Status: {t.status_order}</span>
                  <button onClick={() => handleApprove(t.id)} className="bg-green-600 text-white px-3 py-1 rounded text-xs">Approve</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {tab === 'users' && (
        <div>
          <h2 className="text-xl font-bold mb-4">User Management</h2>
          {users.length === 0 ? <div>No users found.</div> : (
            <ul>
              {users.map((u) => (
                <li key={u.user_id} className="mb-2 border-b pb-2 flex justify-between items-center">
                  <span>{u.username || u.user_id} - {u.banned ? 'Banned' : 'Active'}</span>
                  {u.banned ? (
                    <button onClick={() => handleUnban(u.user_id)} className="bg-blue-600 text-white px-3 py-1 rounded text-xs">Unban</button>
                  ) : (
                    <button onClick={() => handleBan(u.user_id)} className="bg-red-600 text-white px-3 py-1 rounded text-xs">Ban</button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
