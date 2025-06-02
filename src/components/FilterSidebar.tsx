"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { FilterState } from "../app/marketplace/page";

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: any) => void;
  onReset: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterSidebar({
  filters,
  onFilterChange,
  onReset,
  isOpen,
  onClose,
}: FilterSidebarProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const sidebarVariants = {
    hidden: isMobile 
      ? { x: "100%", opacity: 0 } 
      : { opacity: 0, x: -20 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
    exit: isMobile 
      ? { x: "100%", opacity: 0 }
      : { opacity: 0, x: -20 },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const Filter = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      {children}
    </div>
  );

  const content = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
        <button
          onClick={onReset}
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
        >
          Reset All
        </button>
      </div>

      <Filter label="Category">
        <select
          value={filters.category}
          onChange={(e) => onFilterChange("category", e.target.value)}
          className="input-base"
        >
          <option value="">All Categories</option>
          <option value="Weapons">Weapons</option>
          <option value="Armor">Armor</option>
          <option value="Accessories">Accessories</option>
          <option value="Consumables">Consumables</option>
          <option value="Materials">Materials</option>
          <option value="Mounts">Mounts</option>
        </select>
      </Filter>

      <Filter label="Rarity">
        <select
          value={filters.rarity}
          onChange={(e) => onFilterChange("rarity", e.target.value)}
          className="input-base"
        >
          <option value="">All Rarities</option>
          <option value="Common">Common</option>
          <option value="Uncommon">Uncommon</option>
          <option value="Rare">Rare</option>
          <option value="Epic">Epic</option>
          <option value="Legendary">Legendary</option>
        </select>
      </Filter>

      <Filter label="Price Range">
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">Rp</span>
            </div>
            <input
              type="number"
              placeholder="Min"
              value={filters.priceRange.min}
              onChange={(e) =>
                onFilterChange("priceRange", {
                  ...filters.priceRange,
                  min: e.target.value,
                })
              }
              className="input-base pl-12"
              min="0"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">Rp</span>
            </div>
            <input
              type="number"
              placeholder="Max"
              value={filters.priceRange.max}
              onChange={(e) =>
                onFilterChange("priceRange", {
                  ...filters.priceRange,
                  max: e.target.value,
                })
              }
              className="input-base pl-12"
              min="0"
            />
          </div>
        </div>
      </Filter>

      <Filter label="Level Range">
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min Level"
            value={filters.levelRange.min}
            onChange={(e) =>
              onFilterChange("levelRange", {
                ...filters.levelRange,
                min: e.target.value,
              })
            }
            className="input-base"
            min="1"
            max="100"
          />
          <input
            type="number"
            placeholder="Max Level"
            value={filters.levelRange.max}
            onChange={(e) =>
              onFilterChange("levelRange", {
                ...filters.levelRange,
                max: e.target.value,
              })
            }
            className="input-base"
            min="1"
            max="100"
          />
        </div>
      </Filter>

      <Filter label="Sort By">
        <select
          value={filters.sortBy}
          onChange={(e) => onFilterChange("sortBy", e.target.value)}
          className="input-base"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="level-high">Level: High to Low</option>
          <option value="rating">Seller Rating</option>
        </select>
      </Filter>
    </div>
  );

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {isMobile && (
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/50 z-40"
              onClick={onClose}
            />
          )}
          <motion.div
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`${
              isMobile
                ? "fixed right-0 top-0 h-full w-80 z-50"
                : "sticky top-24 w-64"
            } bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg overflow-y-auto`}
          >
            {isMobile && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-500"
                aria-label="Close filters"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
            {content}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}