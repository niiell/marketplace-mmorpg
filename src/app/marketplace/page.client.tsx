"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
// Mock allListings temporarily to fix build error
const allListings: { category?: string; [key: string]: any }[] = [];

import ListingCard from "../../components/ListingCard";
import SkeletonLoader from "../../components/SkeletonLoader";

interface Listing {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  rarity?: string;
  level?: number;
  seller: {
    name: string;
    rating: number;
    avatarUrl?: string;
  };
}

type Rarity = "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";

const isValidRarity = (rarity: string | null | undefined): rarity is Rarity => {
  return (
    rarity === "Common" ||
    rarity === "Uncommon" ||
    rarity === "Rare" ||
    rarity === "Epic" ||
    rarity === "Legendary"
  );
};

export default function MarketplacePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const category = searchParams?.get("category") || null;
    setFilterCategory(category);
  }, [searchParams]);

  useEffect(() => {
    const uniqueCategories = [
      ...new Set(
        allListings
          .map((l) => l.category)
          .filter((c): c is string => c !== undefined)
      ),
    ];
    setCategories(uniqueCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    let filteredListings = allListings;

    if (filterCategory) {
      filteredListings = filteredListings.filter(
        (listing) => listing.category === filterCategory
      );
    }

    setListings(filteredListings);
    setLoading(false);
  }, [filterCategory]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="max-w-7xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-6">Marketplace</h1>
        <div className="mb-8">
          <label htmlFor="category" className="block mb-2 font-semibold">
            Filter by Category
          </label>
          <select
            id="category"
            value={filterCategory || ""}
            onChange={(e) => {
              const value = e.target.value;
              router.push(
                value ? `/marketplace?category=${value}` : "/marketplace"
              );
            }}
            className="border border-gray-300 rounded p-2"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        {loading && listings.length === 0 ? (
          <SkeletonLoader />
        ) : listings.length === 0 ? (
          <p className="text-center text-gray-500">No listings found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {listings.map((listing: Listing) => (
              <ListingCard
                key={listing.id}
                id={listing.id}
                title={listing.title}
                price={listing.price}
                image={listing.image}
                category={listing.category}
                rarity={
                  isValidRarity(listing.rarity) ? listing.rarity : "Common"
                }
                level={listing.level}
                seller={listing.seller}
              />
            ))}
          </div>
        )}
      </div>
    </Suspense>
  );
}