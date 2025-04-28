"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const SIDEBAR_USER = [
  { key: "overview", label: "Ringkasan" },
  { key: "listings", label: "Produk Dijual" },
  { key: "transactions", label: "Transaksi Aktif" },
  { key: "profile", label: "Edit Profil" },
];
const SIDEBAR_ADMIN = [
  { key: "pending", label: "Transaksi Pending" },
  { key: "users", label: "Manage User" },
];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [sidebar, setSidebar] = useState("overview");
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.replace("/login");
        return;
      }
      if (!data.user.email_confirmed_at) {
        router.replace("/login");
        return;
      }
      setUser(data.user);
      // Fetch profile
      const { data: prof } = await supabase.from("profiles").select("*").eq("user_id", data.user.id).single();
      setProfile(prof);
      setLoading(false);
    };
    getUser();
  }, [router]);

  if (loading) return <div className="text-center py-12">Loading...</div>;

  const isAdmin = profile?.role === "admin" || profile?.role === "superadmin";
  const sidebarMenu = isAdmin ? SIDEBAR_ADMIN : SIDEBAR_USER;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 bg-blue-900 text-white flex flex-col py-8 px-4 min-h-screen">
        <div className="font-bold text-xl mb-8">Dashboard</div>
        <nav className="flex-1 space-y-2">
          {sidebarMenu.map((item) => (
            <button
              key={item.key}
              className={`w-full text-left px-3 py-2 rounded transition font-medium ${sidebar === item.key ? "bg-blue-700" : "hover:bg-blue-800"}`}
              onClick={() => setSidebar(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50 min-h-screen">
        {!isAdmin && sidebar === "overview" && <UserOverview user={user} />}
        {!isAdmin && sidebar === "listings" && <UserListings user={user} />}
        {!isAdmin && sidebar === "transactions" && <UserTransactions user={user} />}
        {!isAdmin && sidebar === "profile" && <UserProfile user={user} profile={profile} />}
        {isAdmin && sidebar === "pending" && <AdminPending />}
        {isAdmin && sidebar === "users" && <AdminUsers />}
      </main>
    </div>
  );
}

function UserOverview({ user }: any) {
  const [saldo, setSaldo] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaldo = async () => {
      // Hitung saldo tertunda: transaksi sebagai seller, status_order = 'confirmed'
      const { data, error } = await supabase
        .from('transactions')
        .select('amount')
        .eq('seller_id', user.id)
        .eq('status_order', 'confirmed');
      if (!error && data) {
        const total = data.reduce((sum: number, trx: any) => sum + (trx.amount || 0), 0);
        setSaldo(total);
      }
      setLoading(false);
    };
    fetchSaldo();
  }, [user.id]);

  if (loading) return <div>Loading saldo...</div>;
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Ringkasan Akun</h2>
      <div className="bg-white rounded shadow p-6 mb-6">
        <div className="text-gray-700 mb-2">Saldo Tertunda (akan cair setelah disetujui admin):</div>
        <div className="text-2xl font-bold text-blue-700">Rp {saldo.toLocaleString()}</div>
      </div>
      {/* Bisa tambahkan ringkasan penjualan/beli terakhir di sini */}
    </div>
  );
}

function UserListings({ user }: any) {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase
      .from('listings')
      .select('id, title, price, stock, status, image_url')
      .eq('seller_id', user.id)
      .then(({ data }) => {
        setListings(data || []);
        setLoading(false);
      });
  }, [user.id]);
  if (loading) return <div>Loading produk...</div>;
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Produk Dijual</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {listings.map((item) => (
          <div key={item.id} className="bg-white rounded shadow p-4 flex gap-4 items-center">
            <img src={item.image_url} alt={item.title} className="w-16 h-16 object-cover rounded" />
            <div className="flex-1">
              <div className="font-semibold">{item.title}</div>
              <div className="text-blue-700 font-bold">Rp {item.price.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Stok: {item.stock} | Status: {item.status}</div>
            </div>
          </div>
        ))}
        {listings.length === 0 && <div className="text-gray-500">Belum ada produk dijual.</div>}
      </div>
    </div>
  );
}

function UserTransactions({ user }: any) {
  const [trx, setTrx] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase
      .from('transactions')
      .select('id, listing_id, amount, status_order, status_payment, created_at, buyer_id, seller_id')
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
      .not('status_order', 'in', '(approved,cancelled)')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setTrx(data || []);
        setLoading(false);
      });
  }, [user.id]);
  if (loading) return <div>Loading transaksi...</div>;
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Transaksi Aktif</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-blue-100 text-blue-900">
              <th className="px-3 py-2 text-left">ID</th>
              <th className="px-3 py-2 text-left">Listing</th>
              <th className="px-3 py-2">Nominal</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Sebagai</th>
              <th className="px-3 py-2">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {trx.map((t) => (
              <tr key={t.id} className="border-b">
                <td className="px-3 py-2">{t.id}</td>
                <td className="px-3 py-2">{t.listing_id}</td>
                <td className="px-3 py-2 text-right">Rp {t.amount.toLocaleString()}</td>
                <td className="px-3 py-2 text-center">{t.status_order}</td>
                <td className="px-3 py-2 text-center">{t.buyer_id === user.id ? 'Pembeli' : 'Penjual'}</td>
                <td className="px-3 py-2 text-xs">{new Date(t.created_at).toLocaleString()}</td>
              </tr>
            ))}
            {trx.length === 0 && (
              <tr><td colSpan={6} className="text-gray-500 text-center py-4">Tidak ada transaksi aktif.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UserProfile({ user, profile }: any) {
  const [form, setForm] = useState({ username: profile?.username || "", bio: profile?.bio || "" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSave = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    const { error } = await supabase.from('profiles').update({ username: form.username, bio: form.bio }).eq('user_id', user.id);
    setSaving(false);
    setMsg(error ? "Gagal update profil" : "Profil berhasil disimpan");
  };
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Edit Profil</h2>
      <form onSubmit={handleSave} className="max-w-md space-y-4">
        <div>
          <label className="block mb-1">Username</label>
          <input name="username" value={form.username} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1">Bio</label>
          <textarea name="bio" value={form.bio} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <button type="submit" disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition">
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
        {msg && <div className="mt-2 text-sm text-green-700">{msg}</div>}
      </form>
    </div>
  );
}

function AdminPending() {
  const [trx, setTrx] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState("");

  useEffect(() => {
    supabase
      .from('transactions')
      .select('id, listing_id, amount, status_order, status_payment, created_at, buyer_id, seller_id')
      .eq('status_order', 'confirmed')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setTrx(data || []);
        setLoading(false);
      });
  }, []);

  const handleApprove = async (id: string) => {
    setActionMsg("");
    const res = await fetch("/api/transaction/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transaction_id: id }),
    });
    if (res.ok) {
      setActionMsg("Transaksi disetujui.");
      setTrx(trx.filter((t: any) => t.id !== id));
    } else {
      setActionMsg("Gagal approve transaksi.");
    }
  };

  const handleRefund = async (id: string) => {
    setActionMsg("");
    // TODO: Implement refund logic (API route if needed)
    setActionMsg("(Simulasi) Refund diproses untuk transaksi " + id);
    setTrx(trx.filter((t: any) => t.id !== id));
  };

  if (loading) return <div>Loading transaksi pending...</div>;
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Transaksi Menunggu Persetujuan</h2>
      {actionMsg && <div className="mb-2 text-green-700">{actionMsg}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-blue-100 text-blue-900">
              <th className="px-3 py-2 text-left">ID</th>
              <th className="px-3 py-2 text-left">Listing</th>
              <th className="px-3 py-2">Nominal</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Tanggal</th>
              <th className="px-3 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {trx.map((t) => (
              <tr key={t.id} className="border-b">
                <td className="px-3 py-2">{t.id}</td>
                <td className="px-3 py-2">{t.listing_id}</td>
                <td className="px-3 py-2 text-right">Rp {t.amount.toLocaleString()}</td>
                <td className="px-3 py-2 text-center">{t.status_order}</td>
                <td className="px-3 py-2 text-xs">{new Date(t.created_at).toLocaleString()}</td>
                <td className="px-3 py-2 flex gap-2">
                  <button onClick={() => handleApprove(t.id)} className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700">Approve</button>
                  <button onClick={() => handleRefund(t.id)} className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700">Refund</button>
                </td>
              </tr>
            ))}
            {trx.length === 0 && (
              <tr><td colSpan={6} className="text-gray-500 text-center py-4">Tidak ada transaksi menunggu persetujuan.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState("");

  useEffect(() => {
    supabase
      .from('profiles')
      .select('user_id, username, role, banned')
      .order('username', { ascending: true })
      .then(({ data }) => {
        setUsers(data || []);
        setLoading(false);
      });
  }, []);

  const handleBan = async (user_id: string) => {
    setActionMsg("");
    const { error } = await supabase.from('profiles').update({ banned: true }).eq('user_id', user_id);
    if (!error) {
      setActionMsg("User dibanned.");
      setUsers(users.map((u: any) => u.user_id === user_id ? { ...u, banned: true } : u));
    } else {
      setActionMsg("Gagal ban user.");
    }
  };

  const handleUnban = async (user_id: string) => {
    setActionMsg("");
    const { error } = await supabase.from('profiles').update({ banned: false }).eq('user_id', user_id);
    if (!error) {
      setActionMsg("User di-unban.");
      setUsers(users.map((u: any) => u.user_id === user_id ? { ...u, banned: false } : u));
    } else {
      setActionMsg("Gagal unban user.");
    }
  };

  if (loading) return <div>Loading user...</div>;
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Manajemen User</h2>
      {actionMsg && <div className="mb-2 text-green-700">{actionMsg}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-blue-100 text-blue-900">
              <th className="px-3 py-2 text-left">User ID</th>
              <th className="px-3 py-2 text-left">Username</th>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.user_id} className="border-b">
                <td className="px-3 py-2">{u.user_id}</td>
                <td className="px-3 py-2">{u.username}</td>
                <td className="px-3 py-2 text-center">{u.role}</td>
                <td className="px-3 py-2 text-center">{u.banned ? 'Banned' : 'Aktif'}</td>
                <td className="px-3 py-2 flex gap-2">
                  {!u.banned ? (
                    <button onClick={() => handleBan(u.user_id)} className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700">Ban</button>
                  ) : (
                    <button onClick={() => handleUnban(u.user_id)} className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700">Unban</button>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={5} className="text-gray-500 text-center py-4">Tidak ada user.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
