"use client";

import { IntlProvider } from "next-intl";
import { useFirebaseMessaging } from "../hooks/useFirebaseMessaging";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import { CurrencyProvider } from "../context/CurrencyContext";

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
      <CartProvider>
        <CurrencyProvider>
          <IntlProvider locale={locale} messages={messages}>
            {children}
          </IntlProvider>
        </CurrencyProvider>
      </CartProvider>
    </AuthProvider>
  );
}