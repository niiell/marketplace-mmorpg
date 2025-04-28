import '../src/app/globals.css';
import type { AppProps } from 'next/app';
import { IntlProvider } from 'next-intl';

// Sentry setup
import * as Sentry from '@sentry/nextjs';
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 1.0,
  });
}

// React Axe for accessibility (development only)
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  import('react-axe').then(axe => {
    axe.default(React, window, 1000);
  });
}

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <IntlProvider messages={pageProps.messages} locale={pageProps.locale || 'id'}>
      <Component {...pageProps} />
    </IntlProvider>
  );
}