"use client";

import dynamic from "next/dynamic";

const CheckoutClient = dynamic(() => import("./CheckoutClient"), {
  ssr: false,
  loading: () => <div className="text-center py-12">Loading checkout...</div>,
});

interface CheckoutWrapperProps {
  listingId: string;
}

export default function CheckoutWrapper({ listingId }: CheckoutWrapperProps) {
  if (!listingId) {
    throw new Error("listingId is required");
  }

  return (
    <div>
      <CheckoutClient listingId={listingId} />
    </div>
  );
}