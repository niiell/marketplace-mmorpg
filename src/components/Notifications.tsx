import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface NotificationsProps {
  currentUserId: string;
}

export default function Notifications({ currentUserId }: NotificationsProps) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentUserId) return;
    // Fetch unread notifications
    const fetchNotif = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', currentUserId)
        .eq('is_read', false)
        .order('created_at', { ascending: false });
      setNotifications(data || []);
      setUnread((data || []).length);
    };
    fetchNotif();
    // Subscribe to realtime notification
    const channel = supabase
      .channel(`user-notif-${currentUserId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${currentUserId}` },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev]);
          setUnread((u) => u + 1);
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [currentUserId]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const handleNotifClick = async (notif: any) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', notif.id);
    setNotifications((prev) => prev.filter((n) => n.id !== notif.id));
    setUnread((u) => Math.max(0, u - 1));
    if (notif.url_target) window.location.href = notif.url_target;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setOpen((o) => !o)} className="relative">
        <span className="material-icons">notifications</span>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-2 font-bold border-b">Notifikasi</div>
          {notifications.length === 0 ? (
            <div className="p-4 text-gray-500 text-center">Tidak ada notifikasi baru.</div>
          ) : (
            <ul>
              {notifications.map((notif) => (
                <li
                  key={notif.id}
                  className="px-4 py-3 border-b hover:bg-blue-50 cursor-pointer"
                  onClick={() => handleNotifClick(notif)}
                >
                  <div className="font-semibold text-blue-700 mb-1">{notif.type || 'Notifikasi'}</div>
                  <div>{notif.content}</div>
                  <div className="text-xs text-gray-400 mt-1">{new Date(notif.created_at).toLocaleString()}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
