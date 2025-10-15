"use client";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";

interface SearchAndFilterProps {
  searchPlaceholder?: string;
  onSearchChange: (query: string) => void;
  onFilterChange?: (filters: Record<string, string>) => void;
  filterOptions?: Record<string, any[]>;
  className?: string;
  showFilters?: boolean;
}

export default function SearchAndFilter({
  searchPlaceholder = "Search...",
  onSearchChange,
  onFilterChange,
  filterOptions = {},
  className = "",
  showFilters = true,
}: SearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    onSearchChange(query);
    
    // Call onFilterChange with empty filters if it exists (for backward compatibility)
    if (onFilterChange) {
      onFilterChange({});
    }
  };

  return (
    <div className={`mb-6 ${className}`}>
      {/* Search Bar Only */}
      <div className="relative max-w-md">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full bg-[#252540] text-white pl-10 pr-4 py-3 rounded-lg border border-[#29294d] focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent transition-all"
        />
      </div>
    </div>
  );
}
