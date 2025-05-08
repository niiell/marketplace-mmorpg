"use client";

import Link from "next/link";
import Image from "next/image";
import { useCurrency } from "../context/CurrencyContext";
import { formatCurrency } from "../tools/formatCurrency";
import WishlistButton from "./WishlistButton";

export default function ListingCard({ listing }: { listing: any }) {
  const { currency } = useCurrency();
  const locale = currency === "IDR" ? "id-ID" : currency === "PHP" ? "en-PH" : currency === "THB" ? "th-TH" : "en-US";

  return (
    <Link href={`/marketplace/${listing.id}`} className="block">
      <div className="bg-white rounded shadow p-4 hover:shadow-xl hover:-translate-y-1 transition cursor-pointer relative">
        <Image
          src={listing.image_url}
          alt={listing.title}
          className="w-full h-40 object-cover rounded mb-3"
          width={400}
          height={160}
          placeholder="blur"
          blurDataURL="/placeholder.png"
          priority={false}
        />
        <div className="flex items-center gap-2 mb-2">
          {listing.category && (
            <span className="bg-gray-100 text-xs px-2 py-1 rounded">{listing.category}</span>
          )}
          {listing.game && (
            <span className="bg-indigo-100 text-xs px-2 py-1 rounded">{listing.game}</span>
          )}
          {listing.stock !== undefined && (
            <span className={`ml-auto text-xs px-2 py-1 rounded ${listing.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {listing.stock > 0 ? `Stok: ${listing.stock}` : "Stok Habis"}
            </span>
          )}
        </div>
        <h2 className="text-lg font-semibold mb-1 line-clamp-1">{listing.title}</h2>
        <div className="text-blue-600 font-bold text-xl mb-1">
          {formatCurrency(listing.price, locale, currency)}
        </div>
        {listing.description && (
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{listing.description}</p>
        )}
        <div className="flex justify-end mt-2">
          <WishlistButton listingId={listing.id} />
        </div>
        {listing.seller && (
          <div className="flex items-center gap-2 mt-2">
            {listing.seller.avatar_url && (
              <Image
                src={listing.seller.avatar_url}
                alt="avatar"
                className="rounded-full"
                width={24}
                height={24}
                placeholder="blur"
                blurDataURL="/avatar-placeholder.png"
              />
            )}
            <span className="text-xs text-gray-500">{listing.seller.username || listing.seller_id}</span>
          </div>
        )}
        {listing.rating && (
          <div className="flex items-center gap-1 mt-1">
            <span className="text-yellow-400">★</span>
            <span className="text-xs text-gray-700">{listing.rating.toFixed(1)}</span>
          </div>
        )}
      </div>
    </Link>
  );
}