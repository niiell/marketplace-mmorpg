"use client";

import { useState } from "react";
import TabNavigation from "./TabNavigation";
import FilterDrawer from "./FilterDrawer";
import SearchBar from "./SearchBar";
import ScrollArea from "./ScrollArea";
import { motion } from "framer-motion";
import { useMediaQuery } from "../hooks/useMediaQuery";
import type { FilterState } from "../constants/marketplace";
import { INITIAL_FILTER_STATE } from "../constants/marketplace";

interface MarketplaceLayoutProps {
  children: React.ReactNode;
  categories: {
    id: string;
    label: string;
    count: number;
  }[];
  onSearch: (query: string) => void;
  onFilterChange: (filters: FilterState) => void;
}

export default function MarketplaceLayout({
  children,
  categories,
  onSearch,
  onFilterChange,
}: MarketplaceLayoutProps) {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTER_STATE);
  const [activeTab, setActiveTab] = useState(categories[0]?.id || "");
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.subcategory) count++;
    if (filters.rarity) count++;
    if (filters.priceRange.min || filters.priceRange.max) count++;
    if (filters.levelRange.min || filters.levelRange.max) count++;
    if (filters.sortBy !== "newest") count++;
    return count;
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTER_STATE);
    onFilterChange(INITIAL_FILTER_STATE);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="py-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Marketplace
            </h1>
            <div className="flex items-center gap-4">
              <SearchBar
                onSearch={onSearch}
                placeholder="Search items..."
                className="w-full md:w-80"
              />
              {isMobile && (
                <FilterDrawer
                  filters={filters}
                  onChange={handleFilterChange}
                  onApply={() => {}}
                  onReset={handleResetFilters}
                  activeFiltersCount={getActiveFiltersCount()}
                />
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <TabNavigation
          tabs={categories}
          onChange={(tabId) => {
            setActiveTab(tabId);
            handleFilterChange({ ...filters, category: tabId });
          }}
          className="mb-6"
        />

        {/* Main Content */}
        <div className="flex gap-8 pb-12">
          {/* Sidebar - Desktop */}
          {!isMobile && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-64 shrink-0"
            >
              <div className="sticky top-6">
                <FilterDrawer
                  filters={filters}
                  onChange={handleFilterChange}
                  onApply={() => {}}
                  onReset={handleResetFilters}
                  activeFiltersCount={getActiveFiltersCount()}
                />
              </div>
            </motion.div>
          )}

          {/* Content */}
          <ScrollArea className="flex-1" orientation="vertical">
            {children}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}