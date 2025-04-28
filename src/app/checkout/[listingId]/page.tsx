"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type PageProps = {
  params: {
    listingId: string;
  };
};

export default function CheckoutPage({ params }: PageProps) {
  const router = useRouter();
  useEffect(() => {
    const startCheckout = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      // Fetch listing to get seller_id and price
      const { data: listing } = await supabase
        .from("listings")
        .select("seller_id, price")
        .eq("id", params.listingId)
        .single();
      if (!listing) {
        alert("Listing tidak ditemukan");
        router.push("/marketplace");
        return;
      }
      // Create transaction
      const { data: trx, error: trxError } = await supabase
        .from("transactions")
        .insert({
          listing_id: params.listingId,
          buyer_id: user.id,
          seller_id: listing.seller_id,
          amount: listing.price,
          status_order: "PENDING",
          status_payment: "PENDING"
        })
        .select("id")
        .single();
      if (trxError || !trx) {
        alert("Gagal membuat transaksi");
        return;
      }
      // Call backend API to create Xendit invoice
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transaction_id: trx.id, amount: listing.price, buyer_id: user.id })
      });
      const result = await res.json();
      if (result.payment_url) {
        window.location.href = result.payment_url;
      } else {
        alert("Gagal membuat payment link");
      }
    };
    startCheckout();
    // eslint-disable-next-line
  }, [params.listingId]);
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl font-bold">Mempersiapkan pembayaran...</div>
    </div>
  );
}
