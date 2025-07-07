"use client";
import Image from 'next/image';
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from '../../../lib/supabase';
import { Card, CardBody } from "@heroui/react";
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
import BuyButton from '../../../components/BuyButton';

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
      try {
        if (!id) return;
        
        const { data: product, error } = await supabase
          .from('listings')
          .select(`
            *,
            seller:seller_id (
              username,
              seller_rating,
              avatar_url
            )
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        
        // Get average rating
        const { data: ratings, error: ratingsError } = await supabase
          .from('seller_ratings')
          .select('rating')
          .eq('seller_id', product.seller_id);

        if (!ratingsError && ratings) {
          const avg = ratings.reduce((sum, curr) => sum + curr.rating, 0) / ratings.length;
          setAvgRating(avg || null);
        }

        setProduct(product);
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
              label: product.category?.name || 'Kategori'
            },
            { 
              href: '#', 
              label: product.title || ''
            },
          ]}
        />
        <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            {product.images?.length > 0 ? (
              <Swiper
                spaceBetween={10}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
              >
                {product.images.map((image: string, index: number) => (
                  <SwiperSlide key={index}>
                    <Image
                      src={image}
                      alt={`${product.title} image ${index + 1}`}
                      width={600}
                      height={400}
                      className="rounded-lg"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <Card>
                <CardBody>
                  <Image
                    src={product.image_url || '/placeholder.png'}
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
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">{product.description}</p>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-6">Rp {product.price}</p>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold">Rating Penjual:</span>
              {avgRating !== null ? (
                <span className="text-yellow-500 font-bold">{avgRating.toFixed(2)} ★</span>
              ) : (
                <span className="text-gray-400">Belum ada rating</span>
              )}
            </div>
            <div className="flex gap-4 product-action">
              <BuyButton
                item={{
                  id: product.id,
                  title: product.title,
                  price: product.price,
                  image_url: product.image_url
                }}
                className="flex-1"
              />
              <div className="flex gap-2">
                <AuthGuard>
                  <WishlistButton listingId={product.id} />
                </AuthGuard>
                <AuthGuard>
                  <ChatButton listingId={product.id} />
                </AuthGuard>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-2">Informasi Item</h3>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-gray-600 dark:text-gray-400">Kategori</dt>
                  <dd>{product.category}</dd>
                </div>
                <div>
                  <dt className="text-gray-600 dark:text-gray-400">Level</dt>
                  <dd>{product.level}</dd>
                </div>
                <div>
                  <dt className="text-gray-600 dark:text-gray-400">Rarity</dt>
                  <dd>{product.rarity}</dd>
                </div>
                <div>
                  <dt className="text-gray-600 dark:text-gray-400">Penjual</dt>
                  <dd>{product.seller?.username || 'Unknown'}</dd>
                </div>
              </dl>
            </div>
          </div>
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
