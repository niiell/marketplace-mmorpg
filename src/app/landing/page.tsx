"use client";

import dynamic from 'next/dynamic';

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
      <Features />
      <Testimonials />
    </main>
  );
}