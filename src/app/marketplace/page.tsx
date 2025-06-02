"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useKeyPress } from "../../hooks/useKeyPress";
import ListingCard from "../../components/ListingCard";
import { supabase } from "../../lib/supabase";
import { SmokeButton } from "../../components/SmokeButton";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import OnboardingGuide from "../../components/OnboardingGuide";
import SkeletonLoader from "../../components/SkeletonLoader";
import { useSwipeable } from 'react-swipeable';
import { useDebounce } from "../../hooks/useDebounce";
import Toast from "../../components/Toast";
import SearchBar from "../../components/SearchBar";
import { useAnalytics } from "../../hooks/useAnalytics";
import { monitoring } from "../../utils/monitoring";
import MarketplaceErrorBoundary from "../../components/MarketplaceErrorBoundary";

export interface FilterState {
  category: string;
  rarity: string;
  sortBy: string;
  priceRange: { min: string; max: string };
  levelRange: { min: string; max: string };
  searchQuery: string;
}

interface Listing {
  id: string;
  title: string;
  price: number;
  image_url: string;
  category: string;
  rarity?: string;
  level?: number;
  seller: {
    username: string;
    seller_rating: number;
    avatar_url?: string;
  };
  status: string;
  created_at: string;
}

type Rarity = "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";

const isValidRarity = (rarity: string | null | undefined): rarity is Rarity => {
  return rarity === "Common" || rarity === "Uncommon" || rarity === "Rare" || rarity === "Epic" || rarity === "Legendary";
};

export default function MarketplacePage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    category: "",
    rarity: "",
    sortBy: "newest",
    priceRange: { min: "", max: "" },
    levelRange: { min: "", max: "" },
    searchQuery: "",
  });
  const debouncedFilters = useDebounce(filters, 500);
  const { user } = useAuth();
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  const { trackListingView, trackSearch } = useAnalytics();

  useEffect(() => {
    monitoring.startMeasure('marketplace-load');
    fetchListings().finally(() => {
      monitoring.endMeasure('marketplace-load', 3000); // Alert if load takes > 3s
    });
  }, []);

  // Show toast message
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  };

  async function fetchListings() {
    try {
      setLoading(true);
      const startTime = performance.now();
      
      // Validate price range
      if (debouncedFilters.priceRange.min && debouncedFilters.priceRange.max) {
        const min = parseFloat(debouncedFilters.priceRange.min);
        const max = parseFloat(debouncedFilters.priceRange.max);
        if (min > max) {
          showToast('Minimum price cannot be greater than maximum price', 'error');
          return;
        }
      }

      // Validate level range
      if (debouncedFilters.levelRange.min && debouncedFilters.levelRange.max) {
        const min = parseInt(debouncedFilters.levelRange.min);
        const max = parseInt(debouncedFilters.levelRange.max);
        if (min > max) {
          showToast('Minimum level cannot be greater than maximum level', 'error');
          return;
        }
      }

      let query = supabase
        .from('listings')
        .select(`
          *,
          profiles:seller_id (
            username,
            seller_rating,
            avatar_url
          )
        `)
        .eq('status', 'active');

      // Apply search query
      if (debouncedFilters.searchQuery) {
        query = query.or(
          `title.ilike.%${debouncedFilters.searchQuery}%,` +
          `description.ilike.%${debouncedFilters.searchQuery}%`
        );
      }

      // Apply filters
      if (debouncedFilters.category) {
        query = query.eq('category', debouncedFilters.category);
      }
      if (debouncedFilters.rarity) {
        query = query.eq('rarity', debouncedFilters.rarity);
      }
      if (debouncedFilters.priceRange.min) {
        query = query.gte('price', parseFloat(debouncedFilters.priceRange.min));
      }
      if (debouncedFilters.priceRange.max) {
        query = query.lte('price', parseFloat(debouncedFilters.priceRange.max));
      }
      if (debouncedFilters.levelRange.min) {
        query = query.gte('level', parseInt(debouncedFilters.levelRange.min));
      }
      if (debouncedFilters.levelRange.max) {
        query = query.lte('level', parseInt(debouncedFilters.levelRange.max));
      }

      // Apply sorting
      switch (debouncedFilters.sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        case 'price-low':
          query = query.order('price', { ascending: true });
          break;
        case 'price-high':
          query = query.order('price', { ascending: false });
          break;
        case 'level-high':
          query = query.order('level', { ascending: false });
          break;
        case 'rating':
          query = query.order('profiles.seller_rating', { ascending: false });
          break;
      }

      const { data, error } = await query;

      if (error) {
        showToast('Error loading listings: ' + error.message, 'error');
        throw error;
      }
      
      const formattedListings = (data || []).map(item => ({
        id: item.id.toString(),
        title: item.title,
        price: item.price,
        image_url: item.image_url || '/placeholder-image.jpg',
        category: item.category || 'Uncategorized',
        rarity: isValidRarity(item.rarity) ? item.rarity : "Common",
        level: item.level,
        seller: {
          username: item.profiles?.username || 'Unknown Seller',
          seller_rating: item.profiles?.seller_rating || 0,
          avatar_url: item.profiles?.avatar_url
        },
        status: item.status,
        created_at: item.created_at
      }));

      const responseTime = performance.now() - startTime;
      monitoring.trackApiPerformance('fetch_listings', responseTime);
      
      if (debouncedFilters.searchQuery) {
        trackSearch(debouncedFilters.searchQuery, formattedListings.length);
        monitoring.trackSearchPerformance(
          debouncedFilters.searchQuery,
          responseTime,
          formattedListings.length
        );
      }

      setListings(formattedListings);
      
      // Show feedback based on filter results
      if (formattedListings.length === 0 && 
          (debouncedFilters.category || debouncedFilters.rarity || 
           debouncedFilters.priceRange.min || debouncedFilters.priceRange.max || 
           debouncedFilters.levelRange.min || debouncedFilters.levelRange.max)) {
        showToast('No items match your filter criteria', 'info');
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('Failed to load listings. Please try again later.', 'error');
      monitoring.trackErrorRate('fetch_listings', 1, 1);
    } finally {
      setLoading(false);
    }
  }

  // Update filter handlers with validation
  const updateFilter = (key: keyof FilterState, value: any) => {
    if (key === 'priceRange') {
      const { min, max } = value;
      if (min && max && parseFloat(min) > parseFloat(max)) {
        showToast('Minimum price cannot be greater than maximum price', 'error');
        return;
      }
    }

    if (key === 'levelRange') {
      const { min, max } = value;
      if (min && max && parseInt(min) > parseInt(max)) {
        showToast('Minimum level cannot be greater than maximum level', 'error');
        return;
      }
    }

    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Add popular search suggestions
  const searchSuggestions = [
    "Legendary Sword",
    "Magic Staff",
    "Dragon Scale Armor",
    "Health Potion",
    "Flying Mount",
    "Crafting Materials",
    "Ancient Relic",
    "Enchanted Ring"
  ];

  // Handle search
  const handleSearch = (query: string) => {
    updateFilter('searchQuery', query);
  };

  const resetFilters = () => {
    setFilters({
      category: "",
      rarity: "",
      sortBy: "newest",
      priceRange: { min: "", max: "" },
      levelRange: { min: "", max: "" },
      searchQuery: ""
    });
    showToast('Filters have been reset', 'success');
  };

  // Apply filters when debounced values change
  useEffect(() => {
    fetchListings();
  }, [debouncedFilters]);

  // Keyboard shortcuts
  useKeyPress("f", (event) => {
    if ((event.ctrlKey || event.metaKey) && !event.shiftKey) {
      event.preventDefault();
      document.getElementById("category")?.focus();
    }
  });

  useKeyPress("r", (event) => {
    if ((event.ctrlKey || event.metaKey) && !event.shiftKey) {
      event.preventDefault();
      resetFilters();
    }
  });

  useKeyPress("/", (event) => {
    event.preventDefault();
    document.getElementById("category")?.focus();
  });

  // Keyboard navigation for listing cards
  const [focusedCard, setFocusedCard] = useState(-1);

  useKeyPress("ArrowRight", () => {
    if (focusedCard < listings.length - 1) {
      setFocusedCard(prev => prev + 1);
    }
  });

  useKeyPress("ArrowLeft", () => {
    if (focusedCard > 0) {
      setFocusedCard(prev => prev - 1);
    }
  });

  useEffect(() => {
    if (focusedCard >= 0) {
      const card = document.querySelector(`[data-card-index="${focusedCard}"]`);
      if (card instanceof HTMLElement) {
        card.focus();
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [focusedCard]);

  // Touch gesture handlers
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (focusedCard < listings.length - 1) {
        setFocusedCard(prev => prev + 1);
      }
    },
    onSwipedRight: () => {
      if (focusedCard > 0) {
        setFocusedCard(prev => prev - 1);
      }
    },
    trackMouse: true,
    preventScrollOnSwipe: true,
  });

  // Add search keyboard shortcut
  useKeyPress("k", (event) => {
    if ((event.ctrlKey || event.metaKey) && !event.shiftKey) {
      event.preventDefault();
      const searchInput = document.querySelector('input[aria-label="Search"]');
      if (searchInput instanceof HTMLElement) {
        searchInput.focus();
      }
    }
  });

  // Track listing views
  const handleListingClick = (listing: any) => {
    trackListingView(listing.id, listing.title, listing.price);
  };

  return (
    <MarketplaceErrorBoundary>
      <>
        {/* Skip link for keyboard users */}
        <a 
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-500 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Skip to main content
        </a>

        <div 
          id="main-content"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
          role="main"
          aria-label="Marketplace listings"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Marketplace</h1>
            {user && (
              <Link href="/listing/new">
                <SmokeButton 
                  variant="primary" 
                  className="flex items-center space-x-2"
                  aria-label="Create new listing"
                  data-guide="create-listing"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  <span>Jual Barang</span>
                </SmokeButton>
              </Link>
            )}
          </div>

          {/* Search and filter sections with improved tab order */}
          <div className="mb-6">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search by item name or description..."
              suggestions={searchSuggestions}
              className="max-w-2xl mx-auto"
            />
            <div className="mt-2 text-center">
              <button
                onClick={() => document.getElementById("filters-section")?.focus()}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Jump to filters
              </button>
            </div>
          </div>

          {/* Keyboard shortcuts and touch gesture help */}
          <div className="mb-4 text-sm text-gray-500 dark:text-gray-400 space-y-2">
            <div className="hidden md:block">
              <span className="mr-4">
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">Ctrl</kbd> + <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">F</kbd> or <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">/</kbd> to focus filters
              </span>
              <span className="mr-4">
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">Ctrl</kbd> + <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">R</kbd> to reset filters
              </span>
              <span className="mr-4">
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">Ctrl</kbd> + <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">K</kbd> to focus search
              </span>
              <span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">←</kbd> <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">→</kbd> to navigate listings
              </span>
            </div>
            <div className="md:hidden">
              <span>Swipe left/right to navigate listings</span>
            </div>
          </div>

          {/* Filters section with focusable container */}
          <div 
            id="filters-section"
            tabIndex={-1}
            className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
              <div className="flex items-center gap-4">
                <div className="flex border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors duration-200 ${
                      viewMode === 'grid'
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    aria-label="Grid view"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    <span className="hidden sm:inline">Grid</span>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors duration-200 ${
                      viewMode === 'list'
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    aria-label="List view"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <span className="hidden sm:inline">List</span>
                  </button>
                </div>
                <button
                  onClick={resetFilters}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  Reset Filters
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    value={filters.category}
                    onChange={(e) => updateFilter('category', e.target.value)}
                    className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">All Categories</option>
                    <option value="Weapons">Weapons</option>
                    <option value="Armor">Armor</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Consumables">Consumables</option>
                    <option value="Materials">Materials</option>
                    <option value="Mounts">Mounts</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="rarity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Rarity
                  </label>
                  <select
                    id="rarity"
                    value={filters.rarity}
                    onChange={(e) => updateFilter('rarity', e.target.value)}
                    className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">All Rarities</option>
                    <option value="Common">Common</option>
                    <option value="Uncommon">Uncommon</option>
                    <option value="Rare">Rare</option>
                    <option value="Epic">Epic</option>
                    <option value="Legendary">Legendary</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="price-range" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Price Range
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">Rp</span>
                      </div>
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.priceRange.min}
                        onChange={(e) => updateFilter('priceRange', { ...filters.priceRange, min: e.target.value })}
                        className="pl-12 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        min="0"
                      />
                    </div>
                    <span className="text-gray-500">-</span>
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">Rp</span>
                      </div>
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.priceRange.max}
                        onChange={(e) => updateFilter('priceRange', { ...filters.priceRange, max: e.target.value })}
                        className="pl-12 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="level-range" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Level Range
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Min Level"
                      min="1"
                      max="100"
                      value={filters.levelRange.min}
                      onChange={(e) => updateFilter('levelRange', { ...filters.levelRange, min: e.target.value })}
                      className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      placeholder="Max Level"
                      min="1"
                      max="100"
                      value={filters.levelRange.max}
                      onChange={(e) => updateFilter('levelRange', { ...filters.levelRange, max: e.target.value })}
                      className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="sort" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Sort By
                  </label>
                  <select
                    id="sort"
                    value={filters.sortBy}
                    onChange={(e) => updateFilter('sortBy', e.target.value)}
                    className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="level-high">Level: High to Low</option>
                    <option value="rating">Seller Rating</option>
                  </select>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {listings.length} items found
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  const element = document.querySelector('[data-card-index="0"]');
                  if (element instanceof HTMLElement) {
                    element.focus();
                  }
                }}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Jump to listings
              </button>
            </div>
          </div>

          {loading ? (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
              <SkeletonLoader type="listing" count={6} />
            </div>
          ) : (
            <>
              {listings.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    No listings found matching your criteria.
                  </p>
                </motion.div>
              ) : (
                <div 
                  {...handlers}
                  className={`${
                    viewMode === 'grid' 
                      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
                      : 'flex flex-col gap-4'
                  } relative touch-pan-y`}
                  role="list"
                  aria-label="Marketplace listings"
                >
                  {listings.map((listing, index) => (
                    <motion.div
                      key={listing.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        scale: focusedCard === index ? 1.02 : 1,
                      }}
                      transition={{ 
                        duration: 0.3,
                        scale: { duration: 0.2 } 
                      }}
                      tabIndex={0}
                      role="listitem"
                      data-card-index={index}
                      onFocus={() => setFocusedCard(index)}
                      className={`outline-none transform transition-transform ${
                        focusedCard === index 
                          ? 'ring-2 ring-blue-500 rounded-xl shadow-lg' 
                          : ''
                      }`}
                    >
                      <ListingCard 
                        {...{
                          ...listing,
                          rarity: isValidRarity(listing.rarity) ? listing.rarity : "Common"
                        }}
                        image={listing.image_url}
                        seller={{
                          name: listing.seller.username,
                          rating: listing.seller.seller_rating,
                          avatarUrl: listing.seller.avatar_url
                        }}
                        onClick={() => handleListingClick(listing)}
                      />
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Navigation indicators */}
              {listings.length > 0 && (
                <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 md:hidden">
                  {listings.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        focusedCard === index
                          ? 'bg-blue-500'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                      onClick={() => setFocusedCard(index)}
                      aria-label={`Go to listing ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {/* Onboarding Guide */}
          <OnboardingGuide />

          {/* Toast notifications */}
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}
        </div>
      </>
    </MarketplaceErrorBoundary>
  );
}