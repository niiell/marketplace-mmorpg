"use client";

import dynamic from 'next/dynamic';
import Footer from '../../components/Footer';
import Link from 'next/link';

// Dynamic imports for components with client-side dependencies
const Hero = dynamic(() => import('../../components/Hero'), { ssr: false });
const Features = dynamic(() => import('../../components/Features'), { ssr: false });
const Testimonials = dynamic(() => import('../../components/Testimonials'), { ssr: false });

export default function LandingPageWithButton() {
  return (
    <main className="min-h-screen bg-[#1a1833] flex flex-col">
      <Hero />
      <div className="flex justify-center my-6">
        <Link href="/marketplace">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition">
            Lihat Barang Dijual
          </button>
        </Link>
      </div>
      <Features />
      <Testimonials />
      <Footer />
    </main>
  );
}
