import { useState } from "react";
import { motion } from "motion/react";
import { Search, Filter, X, ChevronDown, Grid, List } from "lucide-react";
import {
  CATEGORY_LIST,
  getCategoryConfig,
  PRICE_FILTERS,
  SORT_OPTIONS,
  DATE_FILTERS,
} from "@/utils/categories";

interface EventFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  onViewChange: (view: "grid" | "list") => void;
  viewMode: "grid" | "list";
}

export interface FilterState {
  search: string;
  category: string;
  priceFilter: string;
  dateFilter: string;
  sortBy: string;
}

export function EventFilters({
  onFilterChange,
  onViewChange,
  viewMode,
}: EventFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "",
    priceFilter: "all",
    dateFilter: "all",
    sortBy: "date_asc",
  });
  const [showFilters, setShowFilters] = useState(false);

  const updateFilter = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters: FilterState = {
      search: "",
      category: "",
      priceFilter: "all",
      dateFilter: "all",
      sortBy: "date_asc",
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const hasActiveFilters =
    filters.category ||
    filters.priceFilter !== "all" ||
    filters.dateFilter !== "all" ||
    filters.search;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-100" />
          <input
            type="text"
            placeholder="Search events..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-primary-200 border border-primary-100 text-white placeholder:text-secondary-100 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-3 rounded-xl border flex items-center gap-2 transition-all ${
            showFilters || hasActiveFilters
              ? "bg-secondary/20 border-secondary text-secondary"
              : "bg-primary-200 border-primary-100 text-secondary-100"
          }`}
        >
          <Filter className="w-5 h-5" />
          Filters
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-secondary" />
          )}
        </motion.button>

        {/* View Toggle */}
        <div className="flex rounded-xl border border-primary-100 overflow-hidden">
          <button
            onClick={() => onViewChange("grid")}
            className={`p-3 transition-colors ${
              viewMode === "grid"
                ? "bg-secondary text-white"
                : "bg-primary-200 text-secondary-100 hover:bg-primary-100"
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => onViewChange("list")}
            className={`p-3 transition-colors ${
              viewMode === "list"
                ? "bg-secondary text-white"
                : "bg-primary-200 text-secondary-100 hover:bg-primary-100"
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Expandable Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-primary-200 rounded-xl p-4 border border-primary-100 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-secondary">
                Category
              </label>
              <div className="relative">
                <select
                  value={filters.category}
                  onChange={(e) => updateFilter("category", e.target.value)}
                  className="w-full px-4 py-2.5 pr-10 rounded-lg bg-primary-300 border border-primary-100 text-white appearance-none focus:border-secondary outline-none"
                >
                  <option value="">All Categories</option>
                  {CATEGORY_LIST.map((cat) => (
                    <option key={cat} value={cat}>
                      {getCategoryConfig(cat).icon} {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-100 pointer-events-none" />
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-secondary">
                Price
              </label>
              <div className="relative">
                <select
                  value={filters.priceFilter}
                  onChange={(e) => updateFilter("priceFilter", e.target.value)}
                  className="w-full px-4 py-2.5 pr-10 rounded-lg bg-primary-300 border border-primary-100 text-white appearance-none focus:border-secondary outline-none"
                >
                  {PRICE_FILTERS.map((pf) => (
                    <option key={pf.value} value={pf.value}>
                      {pf.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-100 pointer-events-none" />
              </div>
            </div>

            {/* Date Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-secondary">When</label>
              <div className="relative">
                <select
                  value={filters.dateFilter}
                  onChange={(e) => updateFilter("dateFilter", e.target.value)}
                  className="w-full px-4 py-2.5 pr-10 rounded-lg bg-primary-300 border border-primary-100 text-white appearance-none focus:border-secondary outline-none"
                >
                  {DATE_FILTERS.map((df) => (
                    <option key={df.value} value={df.value}>
                      {df.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-100 pointer-events-none" />
              </div>
            </div>

            {/* Sort */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-secondary">
                Sort By
              </label>
              <div className="relative">
                <select
                  value={filters.sortBy}
                  onChange={(e) => updateFilter("sortBy", e.target.value)}
                  className="w-full px-4 py-2.5 pr-10 rounded-lg bg-primary-300 border border-primary-100 text-white appearance-none focus:border-secondary outline-none"
                >
                  {SORT_OPTIONS.map((so) => (
                    <option key={so.value} value={so.value}>
                      {so.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-100 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="flex justify-end">
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 text-sm text-secondary-100 hover:text-secondary transition-colors"
              >
                <X className="w-4 h-4" />
                Clear all filters
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* Category Quick Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => updateFilter("category", "")}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
            !filters.category
              ? "bg-secondary text-white"
              : "bg-primary-200 text-secondary-100 hover:bg-primary-100"
          }`}
        >
          All
        </button>
        {CATEGORY_LIST.slice(0, 8).map((cat) => {
          const config = getCategoryConfig(cat);
          return (
            <button
              key={cat}
              onClick={() => updateFilter("category", cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                filters.category === cat
                  ? "bg-secondary text-white"
                  : "bg-primary-200 text-secondary-100 hover:bg-primary-100"
              }`}
            >
              <span>{config.icon}</span>
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
