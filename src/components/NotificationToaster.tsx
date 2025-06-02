"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFirebaseMessaging } from "../hooks/useFirebaseMessaging";
import { supabase } from "../lib/supabase";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
  url?: string;
}

interface NotificationToasterProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

export default function NotificationToaster({
  notifications: initialNotifications,
  onDismiss,
}: NotificationToasterProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>(
    initialNotifications
  );
  const { message: fcmMessage } = useFirebaseMessaging();

  // Handle Firebase Cloud Messages
  useEffect(() => {
    if (fcmMessage?.notification) {
      const newNotification: Notification = {
        id: `fcm-${Date.now()}`,
        title: fcmMessage.notification.title || "New Notification",
        message: fcmMessage.notification.body || "",
        type: fcmMessage.data?.type as any || "info",
        duration: 5000,
        url: fcmMessage.data?.url,
      };
      setNotifications((prev) => [...prev, newNotification]);
    }
  }, [fcmMessage]);

  // Listen for realtime notifications from Supabase
  useEffect(() => {
    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        (payload) => {
          const newNotification: Notification = {
            id: payload.new.id,
            title: payload.new.title || "New Notification",
            message: payload.new.content,
            type: payload.new.type || "info",
            duration: 5000,
            url: payload.new.url_target,
          };
          setNotifications((prev) => [...prev, newNotification]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const icons = {
    success: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
    error: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ),
    info: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    warning: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
  };

  const colors = {
    success: {
      bg: "bg-green-50 dark:bg-green-900/20",
      border: "border-green-400 dark:border-green-500",
      text: "text-green-800 dark:text-green-200",
      icon: "text-green-400 dark:text-green-300",
      progress: "bg-green-400 dark:bg-green-500",
    },
    error: {
      bg: "bg-red-50 dark:bg-red-900/20",
      border: "border-red-400 dark:border-red-500",
      text: "text-red-800 dark:text-red-200",
      icon: "text-red-400 dark:text-red-300",
      progress: "bg-red-400 dark:bg-red-500",
    },
    info: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-400 dark:border-blue-500",
      text: "text-blue-800 dark:text-blue-200",
      icon: "text-blue-400 dark:text-blue-300",
      progress: "bg-blue-400 dark:bg-blue-500",
    },
    warning: {
      bg: "bg-yellow-50 dark:bg-yellow-900/20",
      border: "border-yellow-400 dark:border-yellow-500",
      text: "text-yellow-800 dark:text-yellow-200",
      icon: "text-yellow-400 dark:text-yellow-300",
      progress: "bg-yellow-400 dark:bg-yellow-500",
    },
  };

  const handleNotificationClick = (notification: Notification) => {
    if (notification.url) {
      window.location.assign(notification.url);
    }
    onDismiss(notification.id);
  };

  return (
    <div
      className="fixed top-4 right-4 z-50 space-y-4 min-w-[320px] max-w-md"
      role="alert"
      aria-live="polite"
    >
      <AnimatePresence mode="sync">
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{
              opacity: 0,
              x: 50,
              scale: 0.9,
              transition: { duration: 0.2 },
            }}
            className={`
              relative overflow-hidden rounded-lg border shadow-lg backdrop-blur-sm
              ${colors[notification.type].bg}
              ${colors[notification.type].border}
              ${notification.url ? "cursor-pointer" : ""}
            `}
            onMouseEnter={() => setHoveredId(notification.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() =>
              notification.url && handleNotificationClick(notification)
            }
          >
            <div className="p-4">
              <div className="flex items-start space-x-3">
                <div className={colors[notification.type].icon}>
                  {icons[notification.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-medium ${colors[notification.type].text}`}
                    role="heading"
                  >
                    {notification.title}
                  </p>
                  <p
                    className={`mt-1 text-sm ${colors[notification.type].text} opacity-90`}
                  >
                    {notification.message}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDismiss(notification.id);
                  }}
                  className={`
                    ${colors[notification.type].text} opacity-70
                    hover:opacity-100 focus:outline-none
                    focus:ring-2 focus:ring-offset-2 focus:ring-current
                    rounded-full p-1
                  `}
                  aria-label="Dismiss notification"
                >
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {notification.duration && notification.duration > 0 && (
              <motion.div
                className={`h-1 ${colors[notification.type].progress}`}
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{
                  duration: notification.duration / 1000,
                  ease: "linear",
                }}
                onAnimationComplete={() => {
                  if (hoveredId !== notification.id) {
                    onDismiss(notification.id);
                  }
                }}
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
