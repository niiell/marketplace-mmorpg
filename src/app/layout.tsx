import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import { Providers } from "./providers";
import Layout from "../components/Layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Marketplace MMORPG SEA",
  description: "Jual beli item, gold, jasa game MMORPG Asia Tenggara. Aman, cepat, terpercaya.",
  openGraph: {
    title: "Marketplace MMORPG SEA",
    description: "Jual beli item, gold, jasa game MMORPG Asia Tenggara. Aman, cepat, terpercaya.",
    url: "https://yourdomain.com",
    siteName: "Marketplace MMORPG SEA",
    locale: "id_ID",
  },
  twitter: {
    title: "Marketplace MMORPG SEA",
    description: "Jual beli item, gold, jasa game MMORPG Asia Tenggara. Aman, cepat, terpercaya.",
    site: "@yourtwitterhandle",
    creator: "@yourtwitterhandle",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

async function getMessages(locale: string) {
  try {
    return (await import(`../../locales/${locale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    return {};
  }
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const locale = (await params).locale || "id";
  const messages = await getMessages(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={metadata.description ? String(metadata.description) : undefined} />
        <meta name="keywords" content="Marketplace MMORPG SEA" />
        <meta property="og:title" content={metadata.openGraph?.title ? String(metadata.openGraph.title) : undefined} />
        <meta property="og:description" content={metadata.openGraph?.description ? String(metadata.openGraph.description) : undefined} />
        <meta property="og:url" content={metadata.openGraph?.url ? String(metadata.openGraph.url) : undefined} />
        <meta property="og:site_name" content={metadata.openGraph?.siteName ? String(metadata.openGraph.siteName) : undefined} />
        <meta property="og:locale" content={metadata.openGraph?.locale ? String(metadata.openGraph.locale) : undefined} />
        <meta name="twitter:title" content={metadata.twitter?.title ? String(metadata.twitter.title) : undefined} />
        <meta name="twitter:description" content={metadata.twitter?.description ? String(metadata.twitter.description) : undefined} />
        <meta name="twitter:site" content={metadata.twitter?.site ? String(metadata.twitter.site) : undefined} />
        <meta name="twitter:creator" content={metadata.twitter?.creator ? String(metadata.twitter.creator) : undefined} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers messages={messages} locale={locale}>
          <Layout>
            <ClientLayout>{children}</ClientLayout>
          </Layout>
        </Providers>
      </body>
    </html>
  );
}