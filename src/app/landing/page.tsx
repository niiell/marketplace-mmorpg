import { allDocuments } from 'contentlayer/generated';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Link from 'next/link';

export default function LandingPage() {
  const content = allDocuments.find((doc) => doc._raw.sourceFileName === 'landing.md');
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.children,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, stagger: 0.15, duration: 1, ease: 'power3.out' }
      );
    }
  }, []);

  if (!content) return <div>Konten tidak ditemukan.</div>;

  return (
    <main className="min-h-screen bg-white flex flex-col">
      {/* Hero Section */}
      <section ref={heroRef} className="flex flex-col items-center justify-center text-center py-16 px-4 bg-gradient-to-b from-blue-50 to-white">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 text-blue-900">{content.hero.heading}</h1>
        <p className="text-lg md:text-2xl text-blue-700 mb-8">{content.hero.subheading}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition">{content.hero.cta_daftar}</Link>
          <Link href="/marketplace" className="px-6 py-3 bg-white border border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition">{content.hero.cta_market}</Link>
        </div>
      </section>

      {/* Keunggulan Section */}
      <section className="py-12 px-4 bg-white">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-blue-900">Keunggulan Platform</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {content.keunggulan.map((item, idx) => (
            <div
              key={idx}
              className="group bg-blue-50 rounded-xl p-6 shadow hover:scale-105 hover:bg-blue-100 transition-transform duration-300 cursor-pointer"
            >
              <h3 className="text-xl font-semibold text-blue-800 mb-2">{item.title}</h3>
              <p className="text-blue-700">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimoni Section */}
      <section className="py-12 px-4 bg-blue-50">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-blue-900">Testimoni Pengguna</h2>
        <div className="flex flex-col md:flex-row gap-6 max-w-4xl mx-auto">
          {content.testimoni.map((t, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow p-6 flex-1">
              <p className="text-blue-800 italic mb-4">"{t.text}"</p>
              <div className="text-right text-blue-600 font-semibold">- {t.user}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-6 bg-white border-t text-center text-sm text-blue-700 flex flex-col md:flex-row justify-center gap-4">
        <Link href="/faq" className="hover:underline">FAQ</Link>
        <span className="hidden md:inline">|</span>
        <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>
      </footer>
    </main>
  );
}
