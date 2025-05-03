import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import { Providers } from "./providers";

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
  viewport: "width=device-width, initial-scale=1",
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
  params: { locale: string };
}) {
  const locale = params?.locale || "id";
  const messages = await getMessages(locale);

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers messages={messages} locale={locale}>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
