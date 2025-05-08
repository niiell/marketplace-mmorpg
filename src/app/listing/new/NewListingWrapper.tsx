"use client";

import dynamic from "next/dynamic";

const NewListingClient = dynamic(
  () => import("./NewListingClient"),
  {
    ssr: false,
    loading: () => (
      <div className="text-center py-12">
        <p>Loading new listing form...</p>
      </div>
    ),
  }
);

export default function NewListingWrapper() {
  return (
    <div>
      <NewListingClient />
    </div>
  );
}