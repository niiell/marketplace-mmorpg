import { useState, useEffect } from 'react';
import { supabase } from '../../src/lib/supabase';

interface Notification {
  id: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setNotifications(data || []);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, is_read: true } : n
      ));
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, id: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      markAsRead(id);
    }
  };

  if (isLoading) {
    return <div>Loading notifications...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        notifications.map(notification => (
          <button
            key={notification.id}
            onClick={() => markAsRead(notification.id)}
            onKeyDown={(e) => handleKeyDown(e, notification.id)}
            className={`block w-full text-left p-4 rounded-lg shadow ${
              notification.is_read ? 'bg-gray-50' : 'bg-white border-l-4 border-blue-500'
            }`}
            aria-label={`${notification.message}${notification.is_read ? ' (read)' : ' (unread)'}`}
          >
            <p className="text-gray-800">{notification.message}</p>
            <time className="text-sm text-gray-500">
              {new Date(notification.created_at).toLocaleDateString()}
            </time>
          </button>
        ))
      )}
    </div>
  );
}
