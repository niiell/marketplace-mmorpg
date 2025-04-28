'use client';

import dynamic from 'next/dynamic';
import Footer from '@/components/Footer';

// Dynamic imports for components with client-side dependencies
const Hero = dynamic(() => import('@/components/Hero'), { ssr: false });
const Features = dynamic(() => import('@/components/Features'), { ssr: false });
const Testimonials = dynamic(() => import('@/components/Testimonials'), { ssr: false });

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#1a1833] flex flex-col">
      <Hero />
      <Features />
      <Testimonials />
      <Footer />
    </main>
  );
}
