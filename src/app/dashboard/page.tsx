"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Dialog } from "@headlessui/react";

const SIDEBAR_USER = [
  { key: "overview", label: "Ringkasan" },
  { key: "listings", label: "Produk Dijual" },
  { key: "transactions", label: "Transaksi Aktif" },
  { key: "profile", label: "Edit Profil" },
];
const SIDEBAR_ADMIN = [
  { key: "pending", label: "Transaksi Pending" },
  { key: "users", label: "Manage User" },
  { key: "report", label: "Laporan" },
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
        {isAdmin && sidebar === "report" && <AdminReport />}
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
  const [showReview, setShowReview] = useState<string | null>(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [reviewMsg, setReviewMsg] = useState("");
  const [reviewedTrx, setReviewedTrx] = useState<{ [trxId: string]: boolean }>({});

  useEffect(() => {
    const fetchTrx = async () => {
      const { data } = await supabase
        .from('transactions')
        .select('id, listing_id, amount, status_order, status_payment, created_at, buyer_id, seller_id')
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order('created_at', { ascending: false });
      setTrx(data || []);
      setLoading(false);
      // Fetch reviewed transactions
      const { data: reviews } = await supabase
        .from('reviews')
        .select('transaction_id')
        .eq('reviewer_id', user.id);
      const reviewed: { [trxId: string]: boolean } = {};
      (reviews || []).forEach((r: any) => { reviewed[r.transaction_id] = true; });
      setReviewedTrx(reviewed);
    };
    fetchTrx();
  }, [user.id]);

  const handleReview = (trxId: string) => {
    setShowReview(trxId);
    setReviewForm({ rating: 5, comment: "" });
    setReviewMsg("");
  };

  const submitReview = async (trx: any) => {
    setReviewMsg("");
    // Cek sudah review?
    if (reviewedTrx[trx.id]) {
      setReviewMsg("Anda sudah memberi review untuk transaksi ini.");
      return;
    }
    // Simpan review
    const { error } = await supabase.from('reviews').insert({
      reviewer_id: user.id,
      reviewee_id: user.id === trx.buyer_id ? trx.seller_id : trx.buyer_id,
      transaction_id: trx.id,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
    });
    if (!error) {
      setReviewMsg("Review berhasil disimpan!");
      setReviewedTrx({ ...reviewedTrx, [trx.id]: true });
      setShowReview(null);
    } else {
      setReviewMsg("Gagal menyimpan review.");
    }
  };

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
              <th className="px-3 py-2">Review</th>
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
                <td className="px-3 py-2 text-center"></td>
                  {t.status_order === 'approved' && !reviewedTrx[t.id] && (
                    <button onClick={() => handleReview(t.id)} className="bg-yellow-500 text-white px-3 py-1 rounded text-xs hover:bg-yellow-600">Review</button>
                  )}
                  {reviewedTrx[t.id] && <span className="text-green-600 text-xs">Sudah review</span>}
                  {showReview === t.id && (
                    <div className="absolute left-0 top-0 w-full h-full flex items-center justify-center bg-black/40 z-50">
                      <div className="bg-white rounded shadow p-6 max-w-xs w-full">
                        <h4 className="font-bold mb-2">Beri Review</h4>
                        <div className="flex gap-1 mb-2">
                          {[1,2,3,4,5].map((n) => (
                            <button key={n} type="button" onClick={() => setReviewForm(f => ({...f, rating: n}))}>
                              <span className={reviewForm.rating >= n ? "text-yellow-400 text-2xl" : "text-gray-300 text-2xl"}>★</span>
                            </button>
                          ))}
                        </div>
                        <textarea
                          className="w-full border rounded px-2 py-1 mb-2"
                          rows={2}
                          placeholder="Komentar (opsional)"
                          value={reviewForm.comment}
                          onChange={e => setReviewForm(f => ({...f, comment: e.target.value}))}
                        />
                        <div className="flex gap-2">
                          <button onClick={() => submitReview(t)} className="bg-blue-600 text-white px-3 py-1 rounded text-xs">Kirim</button>
                          <button onClick={() => setShowReview(null)} className="bg-gray-300 px-3 py-1 rounded text-xs">Batal</button>
                        </div>
                        {reviewMsg && <div className="text-xs text-red-600 mt-2">{reviewMsg}</div>}
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {trx.length === 0 && (
              <tr><td colSpan={7} className="text-gray-500 text-center py-4">Tidak ada transaksi aktif.</td></tr>
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
  const [detailTrx, setDetailTrx] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [detailLog, setDetailLog] = useState<any[]>([]);
  const [detailUser, setDetailUser] = useState<any | null>(null);
  const [showUser, setShowUser] = useState(false);

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

  const openDetail = async (trx: any) => {
    setDetailTrx(trx);
    setShowDetail(true);
    // Fetch log aksi dinamis
    const { data: logs } = await supabase
      .from('transaction_logs')
      .select('id, action, note, performed_by, created_at')
      .eq('transaction_id', trx.id)
      .order('created_at', { ascending: true });
    setDetailLog(logs || []);
  };

  const openUser = async (userId: string) => {
    setShowUser(true);
    const { data: user } = await supabase
      .from('profiles')
      .select('user_id, username, role, banned, bio, avatar_url')
      .eq('user_id', userId)
      .single();
    setDetailUser(user);
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
                  <button onClick={() => openDetail(t)} className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700">Detail</button>
                </td>
              </tr>
            ))}
            {trx.length === 0 && (
              <tr><td colSpan={6} className="text-gray-500 text-center py-4">Tidak ada transaksi menunggu persetujuan.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {showDetail && detailTrx && (
        <Dialog open={showDetail} onClose={() => setShowDetail(false)} className="fixed z-50 inset-0 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
          <div className="relative bg-white rounded-lg shadow-lg max-w-lg w-full p-6 z-10"></div>
            <h3 className="text-lg font-bold mb-2">Detail Transaksi</h3>
            <div className="mb-2 text-sm text-gray-700">
              <div><b>ID:</b> {detailTrx.id}</div>
              <div><b>Listing:</b> {detailTrx.listing_id}</div>
              <div><b>Nominal:</b> Rp {detailTrx.amount.toLocaleString()}</div>
              <div><b>Status Order:</b> {detailTrx.status_order}</div>
              <div><b>Status Payment:</b> {detailTrx.status_payment}</div>
              <div><b>Buyer:</b> <button className="underline text-blue-700" onClick={() => openUser(detailTrx.buyer_id)}>{detailTrx.buyer_id}</button></div>
              <div><b>Seller:</b> <button className="underline text-blue-700" onClick={() => openUser(detailTrx.seller_id)}>{detailTrx.seller_id}</button></div>
              <div><b>Tanggal:</b> {new Date(detailTrx.created_at).toLocaleString()}</div>
            </div>
            <div className="mb-2">
              <b>Log Aksi:</b>
              <ul className="text-xs text-gray-600 list-disc ml-5 mt-1">
                {detailLog.length === 0 && <li>Belum ada log aksi.</li>}
                {detailLog.map((log) => (
                  <li key={log.id}></li>
                    <span className="font-semibold">[{log.action}]</span> {log.note} oleh <span className="font-mono">{log.performed_by}</span> <span className="ml-2 text-gray-400">({new Date(log.created_at).toLocaleString()})</span>
                  </li>
                ))}
              </ul>
            </div>
            <button onClick={() => setShowDetail(false)} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Tutup</button>
          </div>
        </Dialog>
      )}
      {showUser && detailUser && (
        <Dialog open={showUser} onClose={() => setShowUser(false)} className="fixed z-50 inset-0 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
          <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full p-6 z-10">
            <h3 className="text-lg font-bold mb-2">Detail User</h3>
            <div className="flex gap-4 items-center mb-4">
              {detailUser.avatar_url && <img src={detailUser.avatar_url} alt="avatar" className="w-16 h-16 rounded-full object-cover" />}
              <div>
                <div className="font-semibold">{detailUser.username}</div>
                <div className="text-xs text-gray-500">ID: {detailUser.user_id}</div>
                <div className="text-xs">Role: {detailUser.role}</div>
                <div className="text-xs">Status: {detailUser.banned ? 'Banned' : 'Aktif'}</div>
              </div>
            </div>
            <div className="mb-2 text-sm text-gray-700">{detailUser.bio}</div>
            <button onClick={() => setShowUser(false)} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Tutup</button>
          </div>
        </Dialog>
      )}
    </div>
  );
}

function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState("");
  const [filter, setFilter] = useState("");

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

  const filteredUsers = users.filter((u: any) =>
    u.username?.toLowerCase().includes(filter.toLowerCase()) ||
    u.role?.toLowerCase().includes(filter.toLowerCase()) ||
    (u.banned ? "banned" : "aktif").includes(filter.toLowerCase())
  );

  if (loading) return <div>Loading user...</div>;
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Manajemen User</h2>
      <input
        type="text"
        placeholder="Cari username, role, status..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
        className="mb-4 border px-3 py-2 rounded w-full max-w-xs"
      />
      {actionMsg && <div className="mb-2 text-green-700">{actionMsg}</div>}
      <div className="overflow-x-auto"></div>
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
            {filteredUsers.map((u) => (
              <tr key={u.user_id} className="border-b"></tr>
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
            {filteredUsers.length === 0 && (
              <tr><td colSpan={5} className="text-gray-500 text-center py-4">Tidak ada user.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminReport() {
  const [stat, setStat] = useState<any>({});
  useEffect(() => {
    const fetchStat = async () => {
      // Query statistik sederhana
      const [trx, user, listing] = await Promise.all([
        supabase.from('transactions').select('id'),
        supabase.from('profiles').select('user_id'),
        supabase.from('listings').select('id'),
      ]);
      setStat({
        transaksi: trx.data?.length || 0,
        user: user.data?.length || 0,
        listing: listing.data?.length || 0,
      });
    };
    fetchStat();
  }, []);
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Panel Laporan</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded shadow p-6">
          <div className="text-gray-700">Total Transaksi</div>
          <div className="text-2xl font-bold text-blue-700">{stat.transaksi}</div>
        </div>
        <div className="bg-white rounded shadow p-6">
          <div className="text-gray-700">Total User</div>
          <div className="text-2xl font-bold text-blue-700">{stat.user}</div>
        </div>
        <div className="bg-white rounded shadow p-6">
          <div className="text-gray-700">Total Listing</div>
          <div className="text-2xl font-bold text-blue-700">{stat.listing}</div>
        </div>
      </div>
      {/* Bisa tambahkan grafik/analitik lain di sini */}
    </div>
  );
}
