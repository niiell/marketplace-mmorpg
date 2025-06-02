"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "../hooks/useMediaQuery";
import ScrollArea from "./ScrollArea";
import Badge from "./Badge";
import { XMarkIcon, FunnelIcon } from "@heroicons/react/24/outline";
import type { FilterState } from "../constants/marketplace";
import { CATEGORIES, RARITY_LEVELS, SORT_OPTIONS } from "../constants/marketplace";

interface FilterDrawerProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onApply: () => void;
  onReset: () => void;
  activeFiltersCount: number;
}

export default function FilterDrawer({
  filters,
  onChange,
  onApply,
  onReset,
  activeFiltersCount,
}: FilterDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleClose = () => {
    setIsOpen(false);
    setLocalFilters(filters); // Reset local filters when closing
  };

  const handleApply = () => {
    onChange(localFilters);
    onApply();
    setIsOpen(false);
  };

  const variants = {
    hidden: {
      x: "100%",
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    visible: {
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        aria-label="Open filters"
      >
        <FunnelIcon className="h-5 w-5" />
        <span>Filters</span>
        {activeFiltersCount > 0 && (
          <Badge variant="primary" size="sm">
            {activeFiltersCount}
          </Badge>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={handleClose}
            />

            {/* Drawer */}
            <motion.div
              variants={variants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="fixed bottom-0 right-0 top-0 z-50 w-full max-w-md border-l border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex h-full flex-col">
                {/* Header */}
                <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Filters
                    </h2>
                    <button
                      onClick={handleClose}
                      className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-400"
                    >
                      <span className="sr-only">Close filters</span>
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <ScrollArea className="flex-1 px-4 py-6">
                  <div className="space-y-8">
                    {/* Categories */}
                    <div>
                      <h3 className="mb-4 font-medium text-gray-900 dark:text-white">
                        Category
                      </h3>
                      <div className="space-y-2">
                        {CATEGORIES.map((category) => (
                          <button
                            key={category.id}
                            onClick={() =>
                              setLocalFilters((prev) => ({
                                ...prev,
                                category: prev.category === category.id ? "" : category.id,
                                subcategory: "",
                              }))
                            }
                            className={`
                              w-full rounded-lg px-4 py-2 text-left text-sm transition-colors
                              ${
                                localFilters.category === category.id
                                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                                  : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50"
                              }
                            `}
                          >
                            {category.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Subcategories */}
                    {localFilters.category && (
                      <div>
                        <h3 className="mb-4 font-medium text-gray-900 dark:text-white">
                          Subcategory
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {CATEGORIES.find((c) => c.id === localFilters.category)
                            ?.subcategories.map((sub) => (
                              <button
                                key={sub}
                                onClick={() =>
                                  setLocalFilters((prev) => ({
                                    ...prev,
                                    subcategory: prev.subcategory === sub ? "" : sub,
                                  }))
                                }
                                className={`
                                  rounded-full px-3 py-1 text-sm transition-colors
                                  ${
                                    localFilters.subcategory === sub
                                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                  }
                                `}
                              >
                                {sub}
                              </button>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Rarity */}
                    <div>
                      <h3 className="mb-4 font-medium text-gray-900 dark:text-white">
                        Rarity
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {RARITY_LEVELS.map((rarity) => (
                          <button
                            key={rarity}
                            onClick={() =>
                              setLocalFilters((prev) => ({
                                ...prev,
                                rarity: prev.rarity === rarity ? "" : rarity,
                              }))
                            }
                            className={`
                              rounded-full px-3 py-1 text-sm transition-colors
                              ${
                                localFilters.rarity === rarity
                                  ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                              }
                            `}
                          >
                            {rarity}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div>
                      <h3 className="mb-4 font-medium text-gray-900 dark:text-white">
                        Price Range
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="sr-only">Minimum price</label>
                          <input
                            type="number"
                            value={localFilters.priceRange.min}
                            onChange={(e) =>
                              setLocalFilters((prev) => ({
                                ...prev,
                                priceRange: {
                                  ...prev.priceRange,
                                  min: e.target.value,
                                },
                              }))
                            }
                            placeholder="Min"
                            className="input-base"
                          />
                        </div>
                        <div>
                          <label className="sr-only">Maximum price</label>
                          <input
                            type="number"
                            value={localFilters.priceRange.max}
                            onChange={(e) =>
                              setLocalFilters((prev) => ({
                                ...prev,
                                priceRange: {
                                  ...prev.priceRange,
                                  max: e.target.value,
                                },
                              }))
                            }
                            placeholder="Max"
                            className="input-base"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Level Range */}
                    <div>
                      <h3 className="mb-4 font-medium text-gray-900 dark:text-white">
                        Level Range
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="sr-only">Minimum level</label>
                          <input
                            type="number"
                            value={localFilters.levelRange.min}
                            onChange={(e) =>
                              setLocalFilters((prev) => ({
                                ...prev,
                                levelRange: {
                                  ...prev.levelRange,
                                  min: e.target.value,
                                },
                              }))
                            }
                            placeholder="Min"
                            className="input-base"
                            min="1"
                            max="100"
                          />
                        </div>
                        <div>
                          <label className="sr-only">Maximum level</label>
                          <input
                            type="number"
                            value={localFilters.levelRange.max}
                            onChange={(e) =>
                              setLocalFilters((prev) => ({
                                ...prev,
                                levelRange: {
                                  ...prev.levelRange,
                                  max: e.target.value,
                                },
                              }))
                            }
                            placeholder="Max"
                            className="input-base"
                            min="1"
                            max="100"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sort */}
                    <div>
                      <h3 className="mb-4 font-medium text-gray-900 dark:text-white">
                        Sort By
                      </h3>
                      <div className="space-y-2">
                        {SORT_OPTIONS.map((option) => (
                          <button
                            key={option.id}
                            onClick={() =>
                              setLocalFilters((prev) => ({
                                ...prev,
                                sortBy: option.id,
                              }))
                            }
                            className={`
                              w-full rounded-lg px-4 py-2 text-left text-sm transition-colors
                              ${
                                localFilters.sortBy === option.id
                                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                                  : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50"
                              }
                            `}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollArea>

                {/* Footer */}
                <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800/50">
                  <div className="flex items-center justify-between gap-4">
                    <button
                      onClick={onReset}
                      className="text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      Reset all
                    </button>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={handleClose}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleApply}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-400"
                      >
                        Apply filters
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}