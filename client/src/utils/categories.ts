// Event category configuration with icons and colors
export const CATEGORIES = {
  Music: {
    icon: "🎵",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/20",
    textColor: "text-purple-400",
  },
  "Sports & Fitness": {
    icon: "⚽",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-500/20",
    textColor: "text-green-400",
  },
  Education: {
    icon: "📚",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/20",
    textColor: "text-blue-400",
  },
  Technology: {
    icon: "💻",
    color: "from-indigo-500 to-violet-500",
    bgColor: "bg-indigo-500/20",
    textColor: "text-indigo-400",
  },
  Gaming: {
    icon: "🎮",
    color: "from-red-500 to-orange-500",
    bgColor: "bg-red-500/20",
    textColor: "text-red-400",
  },
  "Food & Drink": {
    icon: "🍽️",
    color: "from-amber-500 to-yellow-500",
    bgColor: "bg-amber-500/20",
    textColor: "text-amber-400",
  },
  "Arts & Culture": {
    icon: "🎨",
    color: "from-rose-500 to-pink-500",
    bgColor: "bg-rose-500/20",
    textColor: "text-rose-400",
  },
  Business: {
    icon: "💼",
    color: "from-slate-500 to-gray-500",
    bgColor: "bg-slate-500/20",
    textColor: "text-slate-400",
  },
  Networking: {
    icon: "🤝",
    color: "from-teal-500 to-cyan-500",
    bgColor: "bg-teal-500/20",
    textColor: "text-teal-400",
  },
  Celebrations: {
    icon: "🎉",
    color: "from-fuchsia-500 to-pink-500",
    bgColor: "bg-fuchsia-500/20",
    textColor: "text-fuchsia-400",
  },
  Workshops: {
    icon: "🛠️",
    color: "from-orange-500 to-amber-500",
    bgColor: "bg-orange-500/20",
    textColor: "text-orange-400",
  },
  Entertainment: {
    icon: "🎬",
    color: "from-violet-500 to-purple-500",
    bgColor: "bg-violet-500/20",
    textColor: "text-violet-400",
  },
  "Health & Wellness": {
    icon: "🧘",
    color: "from-lime-500 to-green-500",
    bgColor: "bg-lime-500/20",
    textColor: "text-lime-400",
  },
  Travel: {
    icon: "✈️",
    color: "from-sky-500 to-blue-500",
    bgColor: "bg-sky-500/20",
    textColor: "text-sky-400",
  },
  Other: {
    icon: "📌",
    color: "from-gray-500 to-slate-500",
    bgColor: "bg-gray-500/20",
    textColor: "text-gray-400",
  },
} as const;

export type CategoryName = keyof typeof CATEGORIES;

export const CATEGORY_LIST = Object.keys(CATEGORIES) as CategoryName[];

export const getCategoryConfig = (category: string) => {
  // Try exact match
  if (category in CATEGORIES) {
    return CATEGORIES[category as CategoryName];
  }

  // Try partial match
  const normalizedCategory = category.toLowerCase();
  for (const [key, value] of Object.entries(CATEGORIES)) {
    if (
      normalizedCategory.includes(key.toLowerCase()) ||
      key.toLowerCase().includes(normalizedCategory)
    ) {
      return value;
    }
  }

  // Default
  return CATEGORIES.Other;
};

// Price filter options
export const PRICE_FILTERS = [
  { label: "All", value: "all" },
  { label: "Free", value: "free" },
  { label: "Paid", value: "paid" },
] as const;

// Sort options
export const SORT_OPTIONS = [
  { label: "Date (Soonest)", value: "date_asc" },
  { label: "Date (Latest)", value: "date_desc" },
  { label: "Price (Low to High)", value: "price_asc" },
  { label: "Price (High to Low)", value: "price_desc" },
  { label: "Most Popular", value: "popularity" },
  { label: "Newest", value: "newest" },
] as const;

// Date filter options
export const DATE_FILTERS = [
  { label: "All", value: "all" },
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "Upcoming", value: "upcoming" },
] as const;
