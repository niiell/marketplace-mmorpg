import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';
import { NextSeo } from 'next-seo';
import Head from 'next/head';
import { allPosts } from 'contentlayer/generated';

export default function Home() {
  // Fetch latest 3 blog posts (if Contentlayer is set up)
  const posts = allPosts ? allPosts.slice(0, 3) : [];

  // JSON-LD Organization schema
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Marketplace MMORPG SEA',
    url: 'https://yourdomain.com',
    logo: 'https://yourdomain.com/logo.png',
    sameAs: [
      'https://facebook.com/',
      'https://twitter.com/',
      'https://instagram.com/'
    ]
  };

  return (
    <>
      <NextSeo
        title="Marketplace MMORPG SEA"
        description="Jual beli item, gold, dan jasa game MMORPG teraman & terpercaya di Asia Tenggara. Transaksi mudah, chat real-time, dan sistem escrow."
        openGraph={{
          title: 'Marketplace MMORPG SEA',
          description: 'Jual beli item, gold, dan jasa game MMORPG teraman & terpercaya di Asia Tenggara. Transaksi mudah, chat real-time, dan sistem escrow.',
          url: 'https://yourdomain.com',
          siteName: 'Marketplace MMORPG SEA',
        }}
        twitter={{ cardType: 'summary_large_image' }}
      />
      <Head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </Head>
      <main className="min-h-screen bg-[#1a1833] flex flex-col">
        <Hero />
        <Features />
        <Testimonials />
        {/* Blog posts section */}
        {posts.length > 0 && (
          <section className="py-16 bg-[#232046] text-white">
            <div className="max-w-5xl mx-auto px-4">
              <h2 className="text-3xl font-bold mb-10 text-center">Blog & Edukasi</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <a
                    key={post._id}
                    href={post.url || `/blog/${post.slug}`}
                    className="block bg-[#29235c] rounded-xl p-6 shadow-lg hover:scale-105 transition"
                  >
                    <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                    <p className="text-base opacity-80 mb-2">{post.description}</p>
                    <span className="text-xs opacity-60">{post.date}</span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}
        <Footer />
      </main>
    </>
  );
}