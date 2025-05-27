"use client";

import dynamic from 'next/dynamic';
import Link from 'next/link';

const Hero = dynamic(() => import('../../components/Hero'), { 
  ssr: true,
  loading: () => <div>Loading hero section...</div>
});

const Features = dynamic(() => import('../../components/Features'), {
  ssr: true, 
  loading: () => <div>Loading features...</div>
});

const Testimonials = dynamic(() => import('../../components/Testimonials'), {
  ssr: true,
  loading: () => <div>Loading testimonials...</div>
});

export default function LandingPageWithButton() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <Hero />
      <div className="flex flex-col items-center my-6 space-y-4">
        <Link href="/marketplace">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition duration-300 ease-in-out"
            aria-label="Lihat Barang Dijual"
          >
            Lihat Barang Dijual
          </button>
        </Link>
        <p className="text-gray-700 dark:text-gray-300 max-w-xl text-center md:text-lg" id="welcome-message">
          Selamat datang di Marketplace MMORPG SEA! Temukan berbagai item, gold, dan jasa game dari penjual terpercaya di Asia Tenggara.
        </p>
      </div>
      <Features />
      <Testimonials />
    </main>
  );
}