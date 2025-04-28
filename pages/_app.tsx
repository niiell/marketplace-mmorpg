import '../src/app/globals.css';
import type { AppProps } from 'next/app';
import { NextIntlProvider } from 'next-intl';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextIntlProvider messages={pageProps.messages} locale={pageProps.locale || 'id'}>
      <Component {...pageProps} />
    </NextIntlProvider>
  );
}