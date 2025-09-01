"use client";
import { useState } from "react";
import { FiSearch, FiFilter, FiX } from "react-icons/fi";

interface FilterOption {
  label: string;
  value: string;
}

interface SearchAndFilterProps {
  searchPlaceholder?: string;
  onSearchChange: (query: string) => void;
  onFilterChange: (filters: Record<string, string>) => void;
  filterOptions?: Record<string, FilterOption[]>;
  className?: string;
}

export default function SearchAndFilter({
  searchPlaceholder = "Search...",
  onSearchChange,
  onFilterChange,
  filterOptions = {},
  className = "",
}: SearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    onSearchChange(query);
  };

  const handleFilterChange = (filterKey: string, value: string) => {
    const newFilters = { ...activeFilters };
    if (value === "") {
      delete newFilters[filterKey];
    } else {
      newFilters[filterKey] = value;
    }
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    onFilterChange({});
  };

  const activeFilterCount = Object.keys(activeFilters).length;

  return (
    <div className={`mb-6 ${className}`}>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full bg-[#252540] text-white pl-10 pr-4 py-3 rounded-lg border border-[#29294d] focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent transition-all"
          />
        </div>

        {/* Filter Button */}
        <div className="relative">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-[#252540] text-white px-4 py-3 rounded-lg border border-[#29294d] hover:bg-[#2a2a4a] transition-all"
          >
            <FiFilter size={18} />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-[#6366f1] text-white text-xs rounded-full px-2 py-1 ml-1">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Filter Dropdown */}
          {showFilters && (
            <div className="absolute right-0 mt-2 w-80 bg-[#23233a] rounded-lg shadow-xl border border-[#29294d] z-50 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-400 hover:text-white transition"
                >
                  <FiX size={18} />
                </button>
              </div>

              {Object.entries(filterOptions).map(([filterKey, options]) => (
                <div key={filterKey} className="mb-4">
                  <label className="block text-[#b3b3c6] mb-2 capitalize">
                    {filterKey.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <select
                    value={activeFilters[filterKey] || ""}
                    onChange={(e) => handleFilterChange(filterKey, e.target.value)}
                    className="w-full bg-[#18182c] text-white rounded-lg px-3 py-2 border border-[#29294d] focus:ring-2 focus:ring-[#6366f1]"
                  >
                    <option value="">All</option>
                    {options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.entries(activeFilters).map(([key, value]) => (
            <span
              key={key}
              className="inline-flex items-center gap-2 bg-[#6366f1] text-white px-3 py-1 rounded-full text-sm"
            >
              {key}: {value}
              <button
                onClick={() => handleFilterChange(key, "")}
                className="hover:bg-[#4f46e5] rounded-full p-1 transition"
              >
                <FiX size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Click outside to close filters */}
      {showFilters && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowFilters(false)}
        />
      )}
    </div>
  );
}
