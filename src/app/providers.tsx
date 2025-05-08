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
  messages: Record<string, string>;
}) {
  useFirebaseMessaging();

  return (
    <AuthProvider>
      <IntlProvider locale={locale} messages={messages} defaultLocale="en">
        {children}
      </IntlProvider>
    </AuthProvider>
  );
}