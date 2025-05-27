"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useCurrency } from "../context/CurrencyContext";
import WishlistButton from "./WishlistButton";

interface ListingCardProps {
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

export default function ListingCard({
  id,
  title,
  price,
  image,
  category,
  rarity = "Common",
  level = 1,
  seller,
}: ListingCardProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { format: formatCurrency } = useCurrency();

  const rarityColors = {
    Common: "bg-gray-200 text-gray-800",
    Uncommon: "bg-green-200 text-green-800",
    Rare: "bg-blue-200 text-blue-800",
    Epic: "bg-purple-200 text-purple-800",
    Legendary: "bg-yellow-200 text-yellow-800",
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      whileHover={{ y: -5 }}
      className="group relative bg-white rounded-xl shadow-lg overflow-hidden
        border border-gray-200 transition-all duration-300
        hover:shadow-xl hover:border-blue-300"
    >
      <Link href={`/listing/${id}`} className="block">
        {/* Image container */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Category badge */}
          <div className="absolute top-2 left-2 px-2 py-1 text-xs font-medium bg-white/90 rounded-full">
            {category}
          </div>

          {/* Rarity badge */}
          <div
            className={`absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded-full ${rarityColors[
              rarity as keyof typeof rarityColors
            ]}`}
          >
            {rarity}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {title}
          </h3>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="relative w-6 h-6 rounded-full overflow-hidden">
                <Image
                  src={seller.avatarUrl || "/default-avatar.png"}
                  alt={seller.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-sm text-gray-600">
                {seller.name}
              </span>
            </div>

            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < seller.rating
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>

          {/* Price and Level */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-blue-600">
                {formatCurrency(price)}
              </span>
              <span className="text-sm text-gray-500">
                Level {level}
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Wishlist button */}
      <div className="absolute top-3 right-3 z-10">
        <WishlistButton listingId={Number(id)} />
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
}