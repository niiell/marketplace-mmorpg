"use client";

import { IntlProvider } from "next-intl";
import useFirebaseMessaging from "../hooks/useFirebaseMessaging";

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
    <IntlProvider locale={locale} messages={messages}>
      {children}
    </IntlProvider>
  );
}
