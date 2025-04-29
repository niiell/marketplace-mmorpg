'use client';

import dynamic from 'next/dynamic';
import Footer from 'src/components/Footer';

// Dynamic imports for components with client-side dependencies
const Hero = dynamic(() => import('src/components/Hero'), { ssr: false });
const Features = dynamic(() => import('src/components/Features'), { ssr: false });
const Testimonials = dynamic(() => import('src/components/Testimonials'), { ssr: false });

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
