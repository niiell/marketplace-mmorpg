import { useEffect, useState } from "react";
import { messaging } from "../lib/firebase";
import { getToken, onMessage } from "firebase/messaging";

export function useFirebaseMessaging() {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [message, setMessage] = useState<any>(null);

  useEffect(() => {
    async function requestPermission() {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          const msg = await messaging;
          if (msg) {
            const currentToken = await getToken(msg, {
              vapidKey: "YOUR_PUBLIC_VAPID_KEY",
            });
            setToken(currentToken);
            onMessage(msg, (payload) => {
              setMessage(payload);
            });
          }
        } else {
          setError(new Error("Notification permission denied"));
        }
      } catch (err) {
        setError(err as Error);
      }
    }
    requestPermission();
  }, []);

  return { token, error, message };
}
