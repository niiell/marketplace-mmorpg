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

const Swiper = dynamic(() => import('swiper/react').then(mod => mod.Swiper), { ssr: false });
const SwiperSlide = dynamic(() => import('swiper/react').then(mod => mod.SwiperSlide), { ssr: false });
import 'swiper/css';

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);

  const fetchReviews = async (sellerId: string) => {
    const { data: reviewList } = await supabase
      .from("reviews")
      .select("rating, comment, reviewer_id, created_at")
      .eq("reviewee_id", sellerId);
    setReviews(reviewList || []);
    if (reviewList && reviewList.length > 0) {
      const avg = reviewList.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewList.length;
      setAvgRating(avg);
    } else {
      setAvgRating(null);
    }
  };

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        setLoading(true);
        const { data, error } = await supabase
          .from("listings")
          .select("*, reviews(*), seller:profiles(username)")
          .eq("id", id)
          .single();

        if (!error) {
          setProduct(data);
        }
        setLoading(false);
      };

      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    if (product) {
      gsap.fromTo('.product-gallery', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 });
      gsap.fromTo('.product-action', { scale: 0.9 }, { scale: 1, duration: 0.3, delay: 0.2 });
    }
  }, [product]);

  useEffect(() => {
    if (id && product?.seller?.id) {
      fetchReviews(product.seller.id);
    }
  }, [id, product?.seller?.id]);

  const handleReviewSubmitted = () => {
    if (product?.seller?.id) {
      fetchReviews(product.seller.id);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  if (!product) return <div className="text-center py-12">Produk tidak ditemukan.</div>;

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
      <div className="max-w-4xl mx-auto py-12 px-4">
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
              <NextUIButton color="success" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Beli Sekarang
              </NextUIButton>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Ulasan</h2>
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review: any, idx: number) => (
                <div key={idx} className="bg-gray-100 p-4 rounded-lg shadow">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
                    <span className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-800 italic">"{review.comment}"</p>
                  <p className="text-sm text-gray-600 mt-2">- {review.reviewer_id}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Belum ada ulasan untuk produk ini.</p>
          )}
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Tulis Ulasan</h2>
          <ReviewForm listingId={id as string} onReviewSubmitted={handleReviewSubmitted} />
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Ajukan Dispute</h2>
          <DisputeForm listingId={id as string} onDisputeSubmitted={() => {}} />
        </div>
      </div>
    </>
  );
}
