import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import { Providers } from "./providers";
import Layout from "../components/Layout";
import { headers } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const DEFAULT_LOCALE = "en";

async function getMessages(locale: string = DEFAULT_LOCALE) {
  const finalLocale = locale || DEFAULT_LOCALE;
  try {
    return (await import(`../../locales/${finalLocale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${finalLocale}`, error);
    // Try to load default locale as fallback
    if (finalLocale !== DEFAULT_LOCALE) {
      try {
        return (await import(`../../locales/${DEFAULT_LOCALE}.json`)).default;
      } catch (fallbackError) {
        console.error(`Failed to load default locale messages`, fallbackError);
      }
    }
    return {};
  }
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const messages = await getMessages(params.locale);
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';

  return {
    title: {
      template: `%s | ${messages.siteTitle || 'MMORPG Marketplace'}`,
      default: messages.siteTitle || 'MMORPG Marketplace'
    },
    description: messages.siteDescription || 'Buy and sell MMORPG items securely',
    metadataBase: new URL(`${protocol}://${host}`),
    alternates: {
      canonical: '/',
      languages: {
        'en': '/en',
        'id': '/id',
        'th': '/th'
      },
    },
    openGraph: {
      title: messages.siteTitle || 'MMORPG Marketplace',
      description: messages.siteDescription || 'Buy and sell MMORPG items securely',
      url: `${protocol}://${host}`,
      siteName: messages.siteTitle || 'MMORPG Marketplace',
      locale: params.locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: messages.siteTitle || 'MMORPG Marketplace',
      description: messages.siteDescription || 'Buy and sell MMORPG items securely',
      site: '@yourtwitterhandle',
      creator: '@yourtwitterhandle',
    },
    viewport: {
      width: 'device-width',
      initialScale: 1,
      maximumScale: 1,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
  }
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages(params.locale);

  return (
    <html lang={params.locale} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="alternate"
          href="/en"
          hrefLang="en"
        />
        <link
          rel="alternate"
          href="/id"
          hrefLang="id"
        />
        <link
          rel="alternate"
          href="/th"
          hrefLang="th"
        />
        <link
          rel="alternate"
          href="/"
          hrefLang="x-default"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers messages={messages} locale={params.locale}>
          <Layout>
            <ClientLayout>{children}</ClientLayout>
          </Layout>
        </Providers>
      </body>
    </html>
  );
}