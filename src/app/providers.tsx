"use client";

import { IntlProvider } from 'next-intl';

export function Providers({
  children,
  locale = 'id',
  messages = {}
}: {
  children: React.ReactNode;
  locale?: string;
  messages?: any;
}) {
  return (
    <IntlProvider messages={messages} locale={locale}>
      {children}
    </IntlProvider>
  );
}