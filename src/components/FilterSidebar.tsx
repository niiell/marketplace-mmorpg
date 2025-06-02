"use client";

import { useState } from "react";

interface FilterSidebarProps {
  categories: string[];
  locations: string[];
  onFilterChange: (filters: {
    category?: string;
    priceRange?: [number, number];
    location?: string;
    attributes?: Record<string, string>;
  }) => void;
}

export default function FilterSidebar({
  categories,
  locations,
  onFilterChange,
}: FilterSidebarProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedLocation, setSelectedLocation] = useState<string | undefined>(undefined);
  const [priceMin, setPriceMin] = useState<number | undefined>(undefined);
  const [priceMax, setPriceMax] = useState<number | undefined>(undefined);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value || undefined;
    setSelectedCategory(value);
    onFilterChange({ category: value, priceRange: priceMin !== undefined && priceMax !== undefined ? [priceMin, priceMax] : undefined, location: selectedLocation });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value || undefined;
    setSelectedLocation(value);
    onFilterChange({ category: selectedCategory, priceRange: priceMin !== undefined && priceMax !== undefined ? [priceMin, priceMax] : undefined, location: value });
  };

  const handlePriceMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseFloat(e.target.value) : undefined;
    setPriceMin(value);
    onFilterChange({ category: selectedCategory, priceRange: value !== undefined && priceMax !== undefined ? [value, priceMax] : undefined, location: selectedLocation });
  };

  const handlePriceMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseFloat(e.target.value) : undefined;
    setPriceMax(value);
    onFilterChange({ category: selectedCategory, priceRange: priceMin !== undefined && value !== undefined ? [priceMin, value] : undefined, location: selectedLocation });
  };

  return (
    <aside className="w-64 p-4 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-700">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>

      <div className="mb-4">
        <label htmlFor="category" className="block mb-1 font-medium">
          Category
        </label>
        <select
          id="category"
          value={selectedCategory || ""}
          onChange={handleCategoryChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="location" className="block mb-1 font-medium">
          Location
        </label>
        <select
          id="location"
          value={selectedLocation || ""}
          onChange={handleLocationChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
        >
          <option value="">All Locations</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Price Range</label>
        <div className="flex space-x-2">
          <input
            type="number"
            placeholder="Min"
            value={priceMin !== undefined ? priceMin : ""}
            onChange={handlePriceMinChange}
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
            min={0}
          />
          <input
            type="number"
            placeholder="Max"
            value={priceMax !== undefined ? priceMax : ""}
            onChange={handlePriceMaxChange}
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
            min={0}
          />
        </div>
      </div>
    </aside>
  );
}
