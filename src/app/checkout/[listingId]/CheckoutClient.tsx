"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { useCurrency } from "../../../context/CurrencyContext";
import { logger } from "../../../utils/logger";
import CheckoutReview from "../../../components/CheckoutReview";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type CheckoutClientProps = {
  listingId: string;
};

export default function CheckoutClient({ listingId }: CheckoutClientProps) {
  const router = useRouter();
  const { currency, convert } = useCurrency();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [insufficientStock, setInsufficientStock] = useState(false);
  const [listing, setListing] = useState<any>(null);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [shippingInfo, setShippingInfo] = useState<{
    address: string;
    city: string;
    postalCode: string;
  } | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }

        // Fetch listing to get seller_id, price and check stock
        const { data: listing, error: listingError } = await supabase
          .from("listings")
          .select("*, seller:seller_id(*)")
          .eq("id", listingId)
          .single();

        if (listingError || !listing) {
          setError("Listing not found");
          return;
        }

        setListing(listing);

        // Check if item is in stock
        if (listing.stock !== null && listing.stock < 1) {
          setInsufficientStock(true);
          return;
        }

        // Get user's shipping info if exists
        const { data: profile } = await supabase
          .from("profiles")
          .select("shipping_address, shipping_city, shipping_postal")
          .eq("user_id", user.id)
          .single();

        if (profile) {
          setShippingInfo({
            address: profile.shipping_address || "",
            city: profile.shipping_city || "",
            postalCode: profile.shipping_postal || "",
          });
        }

        setLoading(false);
      } catch (error: any) {
        logger.error(error);
        setError(error.message);
        setLoading(false);
      }
    };
    fetchListing();
  }, [listingId, router]);

  const handleStartCheckout = async () => {
    setIsReviewMode(true);
  };

  const handleEditCheckout = () => {
    setIsReviewMode(false);
  };

  const handleConfirmCheckout = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Convert price to selected currency if needed
      const amount = convert(listing.price, currency);

      // Begin transaction with stock check
      const { data: trx, error: trxError } = await supabase.rpc('create_transaction_with_stock_check', {
        p_listing_id: listingId,
        p_buyer_id: user.id,
        p_seller_id: listing.seller_id,
        p_amount: amount,
        p_quantity: 1
      });

      if (trxError) {
        if (trxError.message.includes('insufficient_stock')) {
          setInsufficientStock(true);
        } else {
          setError('Failed to create transaction');
        }
        return;
      }

      // Call backend API to create Xendit invoice
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transaction_id: trx.id,
          amount: amount,
          buyer_id: user.id,
          shipping_info: shippingInfo
        })
      });

      if (!res.ok) {
        setError('Failed to create payment link');
        return;
      }

      const result = await res.json();
      if (result.payment_url) {
        window.location.assign(result.payment_url);
      } else {
        setError('Failed to create payment link');
      }

    } catch (error: any) {
      logger.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !listing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-bold">Preparing your order...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-xl font-bold text-red-600 mb-4">
          {error}
        </div>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (insufficientStock) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-xl font-bold text-red-600 mb-4">
          This item is currently out of stock
        </div>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (isReviewMode) {
    return (
      <CheckoutReview
        items={[{
          id: listing.id,
          title: listing.title,
          price: listing.price,
          quantity: 1,
          image_url: listing.image_url
        }]}
        shippingInfo={shippingInfo || undefined}
        onConfirm={handleConfirmCheckout}
        onEdit={handleEditCheckout}
        isLoading={loading}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      {/* Shipping Information Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Address
            </label>
            <input
              type="text"
              id="address"
              value={shippingInfo?.address || ""}
              onChange={(e) => setShippingInfo(prev => ({ ...prev!, address: e.target.value }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              City
            </label>
            <input
              type="text"
              id="city"
              value={shippingInfo?.city || ""}
              onChange={(e) => setShippingInfo(prev => ({ ...prev!, city: e.target.value }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Postal Code
            </label>
            <input
              type="text"
              id="postalCode"
              value={shippingInfo?.postalCode || ""}
              onChange={(e) => setShippingInfo(prev => ({ ...prev!, postalCode: e.target.value }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleStartCheckout}
        disabled={!shippingInfo?.address || !shippingInfo?.city || !shippingInfo?.postalCode}
        className="w-full px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 
          disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
      >
        Review Order
      </button>
    </div>
  );
}
