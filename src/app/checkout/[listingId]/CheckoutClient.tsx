"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { useCurrency } from "../../../context/CurrencyContext";
import { logger } from "../../../utils/logger";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type CheckoutClientProps = {
  listingId: string;
};

export default function CheckoutClient({ listingId }: CheckoutClientProps) {
  const router = useRouter();
  const { currency, convert } = useCurrency();

  useEffect(() => {
    const startCheckout = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }

        // Fetch listing to get seller_id and price
        const { data: listing, error: listingError } = await supabase
          .from("listings")
          .select("seller_id, price")
          .eq("id", listingId)
          .single();

        if (listingError || !listing) {
          alert("Listing tidak ditemukan");
          router.push("/marketplace");
          return;
        }

        // Convert price to selected currency if needed
        const amount = convert(listing.price, currency);

        // Create transaction
        const { data: trx, error: trxError } = await supabase
          .from("transactions")
          .insert({
            listing_id: listingId,
            buyer_id: user.id,
            seller_id: listing.seller_id,
            amount: amount,
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
          body: JSON.stringify({ transaction_id: trx.id, amount: amount, buyer_id: user.id })
        });

        if (!res.ok) {
          alert("Gagal membuat payment link");
          return;
        }

        const result = await res.json();
        if (result.payment_url) {
          window.location.href = result.payment_url;
        } else {
          alert("Gagal membuat payment link");
        }
      } catch (error) {
        logger.error(error);
        alert("Terjadi kesalahan");
      }
    };
    startCheckout();
  }, [listingId, currency, convert, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl font-bold">Mempersiapkan pembayaran...</div>
    </div>
  );
}
