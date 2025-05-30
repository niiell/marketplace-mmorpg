"use client";
import Image from 'next/image';
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from '../../../lib/supabase';
import gsap from "gsap";
import { Card, CardBody, CardFooter, Button as NextUIButton } from "@nextui-org/react";
import ChatButton from '../../../components/ChatButton';
import ReviewForm from '../../../components/ReviewForm';
import AuthGuard from '../../../components/AuthGuard';
import WishlistButton from '../../../components/WishlistButton';
import DisputeForm from '../../../components/DisputeForm';
import { NextSeo } from 'next-seo';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Modal from '../../../components/Modal';
import SkeletonLoader from '../../../components/SkeletonLoader';
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import Breadcrumbs from '../../../components/Breadcrumbs';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [product, setProduct] = useState<any>(null);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching product:', error);
          return;
        }
        setProduct(data);

        // Fetch average rating
        const { data: reviews, error: reviewsError } = await supabase
          .from('reviews')
          .select('rating')
          .eq('product_id', id);

        if (reviewsError) {
          console.error('Error fetching reviews:', reviewsError);
          setAvgRating(null);
          return;
        }

        if (reviews && reviews.length > 0) {
          const total = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
          setAvgRating(total / reviews.length);
        } else {
          setAvgRating(null);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    }

    fetchProduct();
  }, [id]);

  if (!product) {
    return <SkeletonLoader />;
  }

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
        <Breadcrumbs
          items={[
            { href: '/', label: 'Home' },
            { 
              href: `/category/${product.category?.id || ''}`, 
              label: product.category?.name || 'Kategori',
              current: false 
            },
            { 
              href: '#', 
              label: product.title || '', 
              current: true 
            },
          ]}
        />
        <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image Gallery */}
          <div className="space-y-4 product-gallery">
            {Array.isArray(product.images) && product.images.length > 0 ? (
              <Swiper spaceBetween={16} slidesPerView={1} className="rounded-lg shadow">
                {product.images.map((img: string, idx: number) => (
                  <SwiperSlide key={idx}>
                    <Image
                      src={img}
                      alt={product.title + ' ' + (idx + 1)}
                      className="w-full h-64 object-cover rounded-lg"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      placeholder="blur"
                      blurDataURL="/placeholder.png"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <Card shadow="sm">
                <CardBody className="overflow-visible p-0">
                  <Image
                    src={product.image_url}
                    alt={product.title}
                    className="w-full h-64 object-cover rounded-lg shadow"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    placeholder="blur"
                    blurDataURL="/placeholder.png"
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
              <AuthGuard>
                <ChatButton listingId={Number(id)} />
              </AuthGuard>
              <NextUIButton
                color="success"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                as={motion.button}
                whileHover={{ scale: 1.05, boxShadow: '0 0 12px rgba(0, 255, 255, 0.7)', filter: 'blur(1px)' }}
                whileFocus={{ scale: 1.05, boxShadow: '0 0 12px rgba(0, 255, 255, 0.7)', filter: 'blur(1px)' }}
              >
                Beli Sekarang
              </NextUIButton>
              <AuthGuard>
                <WishlistButton listingId={Number(id)} />
              </AuthGuard>
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
          <AuthGuard>
            {/* Render ReviewForm inline below the "Tulis Ulasan" button to avoid empty area */}
            <ReviewForm listingId={id as string} onReviewSubmitted={() => setIsReviewModalOpen(false)} />
          </AuthGuard>
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
