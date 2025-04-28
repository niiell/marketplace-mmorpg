"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";
import gsap from "gsap";
import { Card, CardBody, CardFooter, Button as NextUIButton } from "@nextui-org/react";

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="text-center py-12">Loading...</div>;

  if (!product) return <div className="text-center py-12">Produk tidak ditemukan.</div>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image Gallery */}
        <div className="space-y-4 product-gallery">
          <Card shadow="sm">
            <CardBody className="overflow-visible p-0">
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full h-64 object-cover rounded-lg shadow"
              />
            </CardBody>
          </Card>
        </div>

        {/* Product Details */}
        <div>
          <p className="text-lg text-gray-700 mb-4">{product.description}</p>
          <p className="text-2xl font-bold text-blue-700 mb-6">Rp {product.price}</p>
          <div className="flex gap-4 product-action">
            <NextUIButton color="primary" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Chat dengan Penjual
            </NextUIButton>
            <NextUIButton color="success" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Beli Sekarang
            </NextUIButton>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Ulasan</h2>
        {product.reviews?.length > 0 ? (
          <div className="space-y-4">
            {product.reviews.map((review: any) => (
              <Card key={review.id} shadow="sm">
                <CardBody>
                  <p className="text-gray-800 italic">"{review.comment}"</p>
                  <p className="text-sm text-gray-600 mt-2">- {review.reviewer_id}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">Belum ada ulasan untuk produk ini.</p>
        )}
      </div>
    </div>
  );
}