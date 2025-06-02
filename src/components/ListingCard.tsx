"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useCurrency } from "../context/CurrencyContext";
import WishlistButton from "./WishlistButton";
import ChatButton from "./ChatButton";
import BuyButton from "./BuyButton";
import { useState } from "react";

export interface ListingCardProps {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  rarity?: "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";
  level?: number;
  seller: {
    name: string;
    rating?: number;
    avatarUrl?: string;
  };
  viewMode?: "grid" | "list";
  onClick?: () => void;
}

const shimmer = (w: number, h: number) => `
  <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
      <linearGradient id="g">
        <stop stop-color="#f6f7f8" offset="0%"/>
        <stop stop-color="#edeef1" offset="20%"/>
        <stop stop-color="#f6f7f8" offset="40%"/>
        <stop stop-color="#edeef1" offset="60%"/>
        <stop stop-color="#f6f7f8" offset="80%"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#g)"/>
  </svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export default function ListingCard({
  id,
  title,
  price,
  image,
  category,
  rarity = "Common",
  level = 1,
  seller,
  viewMode = "grid",
  onClick,
}: ListingCardProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { format: formatCurrency } = useCurrency();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const rarityColors = {
    Common: "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600",
    Uncommon: "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-300 dark:border-green-800",
    Rare: "bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-300 dark:border-blue-800",
    Epic: "bg-purple-200 text-purple-800 dark:bg-purple-900 dark:text-purple-300 border-purple-300 dark:border-purple-800",
    Legendary: "bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-300 dark:border-yellow-800",
  } as const;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const imageVariants = {
    hover: { scale: 1.05, transition: { duration: 0.3 } },
    tap: { scale: 0.95 },
  };

  const fallbackImage = "/placeholder-image.jpg";

  // Convert string ID to number for components that require it
  const numericId = parseInt(id, 10);

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      whileHover="hover"
      whileTap="tap"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      className={`group ${
        viewMode === "grid"
          ? "flex flex-col rounded-xl border dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 w-full"
          : "flex flex-row rounded-xl border dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 w-full gap-4"
      } bg-white dark:bg-gray-800 overflow-hidden relative cursor-pointer`}
      role="article"
      aria-label={`${title} - ${formatCurrency(price)} - ${category}`}
    >
      <Link
        href={`/product/${id}`}
        className="block focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
        aria-label={`View details for ${title}`}
      >
        <div
          className={`${
            viewMode === "grid"
              ? "w-full aspect-square"
              : "min-w-[12rem] h-48"
          } relative`}
        >
          <motion.div
            variants={imageVariants}
            className="w-full h-full"
          >
            <Image
              src={imageError ? "/placeholder-image.jpg" : image}
              alt={`Image of ${title}`}
              fill
              className={`object-cover transition-all duration-300 ${
                imageLoading ? "opacity-0" : "opacity-100"
              } group-hover:scale-105`}
              sizes={
                viewMode === "grid"
                  ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  : "12rem"
              }
              onLoadingComplete={() => setImageLoading(false)}
              onError={() => setImageError(true)}
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
            />

            {/* Loading shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: "-100%" }}
              animate={imageLoading ? { x: "100%" } : { x: "-100%" }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
              }}
            />

            {/* Image overlay gradient */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-wrap gap-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${rarityColors[rarity]}`}>
                {rarity}
              </span>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-900/70 text-white border border-gray-700">
                Lvl {level}
              </span>
              {category && (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-900/70 text-white border border-blue-700">
                  {category}
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </Link>

      <div className={`${viewMode === "grid" ? "p-4" : "flex-1 p-4 flex flex-col justify-between"}`}>
        <div className={viewMode === "list" ? "flex justify-between items-start" : ""}>
          <div>
            <Link href={`/product/${id}`}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2">
                {title}
              </h3>
            </Link>

            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <span className="mr-1">Seller:</span>
              <span className="font-medium">{seller.name}</span>
              {seller.rating && (
                <span className="ml-2 flex items-center">
                  <svg
                    className="w-4 h-4 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="ml-1">{seller.rating.toFixed(1)}</span>
                </span>
              )}
            </div>
          </div>

          {viewMode === "list" && (
            <div className="text-right">
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(price)}
              </p>
            </div>
          )}
        </div>
        
        {viewMode === "grid" && (
          <>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">
              {formatCurrency(price)}
            </p>
          </>
        )}

        <div className="flex items-center justify-between mt-4 gap-2">
          <BuyButton
            item={{
              id,
              title,
              price,
              image_url: image
            }}
            className="flex-1"
          />
          <div className="flex gap-2">
            <WishlistButton listingId={numericId} />
            <ChatButton listingId={numericId} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}