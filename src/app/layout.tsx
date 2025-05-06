import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import { Providers } from "./providers";
import Layout from "../components/Layout";
import DarkModeToggle from "../components/DarkModeToggle";

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
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
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
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers messages={messages} locale={locale}>
          <Layout>
            <header className="p-4 flex justify-end">
              <DarkModeToggle />
            </header>
            <ClientLayout>{children}</ClientLayout>
          </Layout>
        </Providers>
      </body>
    </html>
  );
}
