import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Hero() {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      gsap.fromTo(
        textRef.current.children,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, stagger: 0.15, duration: 1, ease: 'power2.out' }
      );
    }
  }, []);

  return (
    <section className="relative flex flex-col items-center justify-center min-h-[60vh] py-16 text-center bg-gradient-to-b from-[#1a1833] to-[#232046] text-white">
      <div ref={textRef}>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
          Marketplace MMORPG SEA
        </h1>
        <p className="text-lg md:text-2xl mb-8 max-w-2xl mx-auto">
          Jual beli item, gold, dan jasa game MMORPG teraman & terpercaya di Asia Tenggara. Transaksi mudah, chat real-time, dan sistem escrow.
        </p>
        <a href="/register" className="inline-block px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-full font-semibold text-lg shadow-lg transition">
          Daftar Sekarang
        </a>
      </div>
    </section>
  );
}
