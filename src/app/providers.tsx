"use client";

import { IntlProvider } from "next-intl";
import { useFirebaseMessaging } from "../hooks/useFirebaseMessaging";
import { AuthProvider } from "../context/AuthContext";

export function Providers({
  children,
  locale,
  messages,
}: {
  children: React.ReactNode;
  locale: string;
  messages: any;
}) {
  useFirebaseMessaging();

  return (
    <AuthProvider>
      <IntlProvider locale={locale} messages={messages}>
        {children}
      </IntlProvider>
    </AuthProvider>
  );
}
