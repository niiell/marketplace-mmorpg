"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from '../../../lib/supabase';
import gsap from "gsap";
import { Card, CardBody, CardFooter, Button as NextUIButton } from "@nextui-org/react";
import ChatButton from '../../../components/ChatButton';
import ReviewForm from '../../../components/ReviewForm';
import DisputeForm from '../../../components/DisputeForm';
import { NextSeo } from 'next-seo';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Modal from '../../../components/Modal';

export default function ProductDetailPage() {
  // ... existing code ...

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);

  // ... existing code ...

  return (
    <>
      <NextSeo
        title={product.title + ' | Marketplace MMORPG SEA'}
        description={product.description?.slice(0, 160) || 'Jual beli item, gold, jasa game MMORPG SEA'}
        openGraph={{
          title: product.title,
          description: product.description?.slice(0, 160) || '',
          images: [
            { url: (product.images?.[0] || product.image_url) ?? '', width: 800, height: 600, alt: product.title }
          ],
        }}
      />
      <motion.div
        className="max-w-4xl mx-auto py-12 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        {/* Breadcrumbs */}
        <nav className="text-sm mb-4" aria-label="Breadcrumb">
          <ol className="list-reset flex text-gray-600 dark:text-gray-400">
            <li>
              <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</Link>
              <span className="mx-2">/</span>
            </li>
            <li>
              <Link href={`/category/${product.category?.id || ''}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                {product.category?.name || 'Kategori'}
              </Link>
              <span className="mx-2">/</span>
            </li>
            <li className="text-gray-900 dark:text-gray-100 font-semibold" aria-current="page">
              {product.title}
            </li>
          </ol>
        </nav>
        <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image Gallery */}
          <div className="space-y-4 product-gallery">
            {Array.isArray(product.images) && product.images.length > 0 ? (
              <Swiper spaceBetween={16} slidesPerView={1} className="rounded-lg shadow">
                {product.images.map((img: string, idx: number) => (
                  <SwiperSlide key={idx}>
                    <img src={img} alt={product.title + ' ' + (idx + 1)} className="w-full h-64 object-cover rounded-lg" />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <Card shadow="sm">
                <CardBody className="overflow-visible p-0">
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-full h-64 object-cover rounded-lg shadow"
                  />
                </CardBody>
              </Card>
            )}
          </div>

          {/* Product Details */}
          <div>
            <p className="text-lg text-gray-700 mb-4">{product.description}</p>
            <p className="text-2xl font-bold text-blue-700 mb-6">Rp {product.price}</p>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold">Rating Penjual:</span>
              {avgRating !== null ? (
                <span className="text-yellow-500 font-bold">{avgRating.toFixed(2)} ★</span>
              ) : (
                <span className="text-gray-400">Belum ada rating</span>
              )}
            </div>
            <div className="flex gap-4 product-action">
              <ChatButton listingId={Number(id)} />
              <NextUIButton
                color="success"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                as={motion.button}
                whileHover={{ scale: 1.05, boxShadow: '0 0 12px rgba(0, 255, 255, 0.7)', filter: 'blur(1px)' }}
                whileFocus={{ scale: 1.05, boxShadow: '0 0 12px rgba(0, 255, 255, 0.7)', filter: 'blur(1px)' }}
              >
                Beli Sekarang
              </NextUIButton>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Ulasan</h2>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => setIsReviewModalOpen(true)}
          >
            Tulis Ulasan
          </button>
        </div>

        {/* Dispute */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Ajukan Dispute</h2>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={() => setIsDisputeModalOpen(true)}
          >
            Ajukan Dispute
          </button>
        </div>

        {/* Modals */}
        <Modal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)}>
          <ReviewForm listingId={id as string} onReviewSubmitted={() => setIsReviewModalOpen(false)} />
        </Modal>

        <Modal isOpen={isDisputeModalOpen} onClose={() => setIsDisputeModalOpen(false)}>
          <DisputeForm listingId={id as string} onDisputeSubmitted={() => setIsDisputeModalOpen(false)} />
        </Modal>
      </motion.div>
    </>
  );
}
