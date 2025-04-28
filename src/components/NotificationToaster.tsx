"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

function NotificationToaster() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id || null));
  }, []);

  useEffect(() => {
    if (!userId) return;
    // Fetch unread notifications
    const fetchNotif = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("id, content, url_target, is_read, type, created_at")
        .eq("user_id", userId)
        .eq("is_read", false)
        .order("created_at", { ascending: false });
      setNotifications(data || []);
    };
    fetchNotif();
    // Subscribe to realtime notification
    const channel = supabase
      .channel(`user-notif-${userId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  const markAsRead = async (id: number, url?: string) => {
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (url) window.location.href = url;
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-2">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className="bg-white border-l-4 shadow-lg rounded px-4 py-3 cursor-pointer flex items-center gap-2 animate-fade-in-up"
          style={{ borderColor: notif.type === 'chat' ? '#2563eb' : notif.type === 'order' ? '#16a34a' : '#f59e42' }}
          onClick={() => markAsRead(notif.id, notif.url_target)}
        >
          <span className="font-bold text-blue-700">{notif.type === 'chat' ? 'Chat' : notif.type === 'order' ? 'Pesanan' : 'Notifikasi'}</span>
          <span className="flex-1 text-gray-800">{notif.content}</span>
        </div>
      ))}
    </div>
  );
}

export default NotificationToaster;
