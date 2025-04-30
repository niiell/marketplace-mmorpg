import { useEffect, useState } from "react";
import { messaging } from "../lib/firebase";
import { onMessage, getToken } from "firebase/messaging";
import toast from "react-hot-toast";

export default function useFirebaseMessaging() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    async function initMessaging() {
      const msg = await messaging;
      if (!msg) {
        console.log("Firebase messaging is not supported.");
        return;
      }

      try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          console.log("Notification permission not granted.");
          return;
        }

        const currentToken = await getToken(msg, { vapidKey: "YOUR_VAPID_KEY" });
        if (currentToken) {
          setToken(currentToken);
          console.log("FCM Token:", currentToken);
          // TODO: Send token to backend for push notifications
        } else {
          console.log("No registration token available.");
        }

        onMessage(msg, (payload) => {
          console.log("Message received. ", payload);
          if (payload.notification?.title && payload.notification?.body) {
            toast(payload.notification.title + ": " + payload.notification.body, {
              duration: 5000,
              position: "top-right",
            });
          }
        });
      } catch (err) {
        console.error("An error occurred while retrieving token. ", err);
      }
    }

    initMessaging();
  }, []);

  return token;
}
