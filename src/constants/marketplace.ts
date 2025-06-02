export const RARITY_LEVELS = [
  "Common",
  "Uncommon",
  "Rare",
  "Epic",
  "Legendary",
] as const;

export const CATEGORIES = [
  {
    id: "weapons",
    label: "Weapons",
    subcategories: [
      "Swords",
      "Bows",
      "Staves",
      "Daggers",
      "Axes",
      "Spears",
    ],
  },
  {
    id: "armor",
    label: "Armor",
    subcategories: [
      "Helmets",
      "Chest Armor",
      "Gloves",
      "Boots",
      "Shields",
    ],
  },
  {
    id: "accessories",
    label: "Accessories",
    subcategories: [
      "Rings",
      "Necklaces",
      "Earrings",
      "Belts",
      "Bracelets",
    ],
  },
  {
    id: "consumables",
    label: "Consumables",
    subcategories: [
      "Potions",
      "Scrolls",
      "Food",
      "Enhancement Materials",
    ],
  },
  {
    id: "materials",
    label: "Materials",
    subcategories: [
      "Ores",
      "Herbs",
      "Leather",
      "Cloth",
      "Gems",
    ],
  },
  {
    id: "mounts",
    label: "Mounts",
    subcategories: [
      "Ground Mounts",
      "Flying Mounts",
      "Aquatic Mounts",
    ],
  },
] as const;

export const SORT_OPTIONS = [
  {
    id: "newest",
    label: "Newest First",
  },
  {
    id: "oldest",
    label: "Oldest First",
  },
  {
    id: "price-low",
    label: "Price: Low to High",
  },
  {
    id: "price-high",
    label: "Price: High to Low",
  },
  {
    id: "level-high",
    label: "Level: High to Low",
  },
  {
    id: "rating",
    label: "Seller Rating",
  },
] as const;

export type RarityLevel = typeof RARITY_LEVELS[number];
export type Category = typeof CATEGORIES[number];
export type SortOption = typeof SORT_OPTIONS[number];

export interface FilterState {
  category: string;
  subcategory?: string;
  rarity: string;
  sortBy: string;
  priceRange: {
    min: string;
    max: string;
  };
  levelRange: {
    min: string;
    max: string;
  };
  searchQuery: string;
}

export const INITIAL_FILTER_STATE: FilterState = {
  category: "",
  subcategory: "",
  rarity: "",
  sortBy: "newest",
  priceRange: {
    min: "",
    max: "",
  },
  levelRange: {
    min: "",
    max: "",
  },
  searchQuery: "",
};