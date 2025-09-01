"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FiSearch, FiUser, FiFileText, FiDollarSign, FiAlertTriangle } from "react-icons/fi";
import Link from "next/link";

interface SearchResult {
  id: string;
  type: "user" | "ticket" | "report" | "refund";
  title: string;
  description: string;
  status?: string;
  date?: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    try {
      // Simulate search across different data types
      // In a real app, this would call your search API
      const mockResults: SearchResult[] = [
        {
          id: "1",
          type: "user",
          title: "John Doe",
          description: "Active user - john.doe@email.com",
          status: "Active",
          date: "2024-01-15"
        },
        {
          id: "2",
          type: "ticket",
          title: "Payment Issue #1234",
          description: "User reported payment processing error",
          status: "Open",
          date: "2024-01-14"
        },
        {
          id: "3",
          type: "report",
          title: "Service Quality Report",
          description: "Report about service provider behavior",
          status: "Unresolved",
          date: "2024-01-13"
        },
        {
          id: "4",
          type: "refund",
          title: "Refund Request #5678",
          description: "Customer requested refund for cancelled service",
          status: "Pending",
          date: "2024-01-12"
        }
      ];

      // Filter results based on search query
      const filtered = mockResults.filter(result =>
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.description.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setResults(filtered);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "user": return <FiUser className="text-blue-400" size={20} />;
      case "ticket": return <FiFileText className="text-green-400" size={20} />;
      case "report": return <FiAlertTriangle className="text-red-400" size={20} />;
      case "refund": return <FiDollarSign className="text-yellow-400" size={20} />;
      default: return <FiSearch className="text-gray-400" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active": case "resolved": case "completed": return "bg-green-500";
      case "pending": case "open": return "bg-yellow-500";
      case "inactive": case "unresolved": case "cancelled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getResultLink = (result: SearchResult) => {
    switch (result.type) {
      case "user": return `/dashboard/users/${result.id}`;
      case "ticket": return `/dashboard/tickets/${result.id}`;
      case "report": return `/dashboard/reports/${result.id}`;
      case "refund": return `/dashboard/refund`;
      default: return "#";
    }
  };

  const filteredResults = activeFilter === "all" 
    ? results 
    : results.filter(result => result.type === activeFilter);

  const filterOptions = [
    { label: "All Results", value: "all" },
    { label: "Users", value: "user" },
    { label: "Tickets", value: "ticket" },
    { label: "Reports", value: "report" },
    { label: "Refunds", value: "refund" }
  ];

  return (
    <div className="min-h-screen bg-[#131322] text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Search Results</h1>
          {query && (
            <p className="text-[#b3b3c6]">
              Showing results for: <span className="text-white font-semibold">"{query}"</span>
            </p>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setActiveFilter(option.value)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeFilter === option.value
                  ? "bg-[#6366f1] text-white"
                  : "bg-[#252540] text-[#b3b3c6] hover:bg-[#2a2a4a]"
              }`}
            >
              {option.label}
              {option.value !== "all" && (
                <span className="ml-2 text-xs bg-[#29294d] px-2 py-1 rounded-full">
                  {results.filter(r => r.type === option.value).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6366f1] mx-auto"></div>
            <p className="mt-4 text-[#b3b3c6]">Searching...</p>
          </div>
        )}

        {/* Results */}
        {!loading && (
          <div className="space-y-4">
            {filteredResults.length > 0 ? (
              filteredResults.map((result) => (
                <Link
                  key={result.id}
                  href={getResultLink(result)}
                  className="block bg-[#252540] rounded-lg p-6 hover:bg-[#2a2a4a] transition border border-[#29294d]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="mt-1">
                        {getIcon(result.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">
                            {result.title}
                          </h3>
                          <span className="text-xs bg-[#29294d] text-[#b3b3c6] px-2 py-1 rounded-full capitalize">
                            {result.type}
                          </span>
                          {result.status && (
                            <span className={`text-xs text-white px-2 py-1 rounded-full ${getStatusColor(result.status)}`}>
                              {result.status}
                            </span>
                          )}
                        </div>
                        <p className="text-[#b3b3c6] mb-2">{result.description}</p>
                        {result.date && (
                          <p className="text-sm text-[#8b8ba3]">
                            {new Date(result.date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-12">
                <FiSearch className="mx-auto text-[#b3b3c6] mb-4" size={48} />
                <h3 className="text-xl font-semibold mb-2">No results found</h3>
                <p className="text-[#b3b3c6]">
                  {query 
                    ? `No results found for "${query}". Try different keywords.`
                    : "Enter a search query to find users, tickets, reports, and refunds."
                  }
                </p>
              </div>
            )}
          </div>
        )}

        {/* Results Summary */}
        {!loading && filteredResults.length > 0 && (
          <div className="mt-8 text-center text-[#b3b3c6]">
            Showing {filteredResults.length} of {results.length} results
          </div>
        )}
      </div>
    </div>
  );
}
