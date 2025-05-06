"use client";

import dynamic from "next/dynamic";

const NewListingClient = dynamic(() => import("./NewListingClient"), {
  ssr: false,
  loading: () => <div className="text-center py-12">Loading new listing form...</div>,
});

export default function NewListingWrapper() {
  return <NewListingClient />;
}
