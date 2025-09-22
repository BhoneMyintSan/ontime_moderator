"use client";
import { useState, useEffect, Suspense, useMemo } from "react";
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

function SearchContent() {
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
      const q = searchQuery.toLowerCase();

      const [usersRes, ticketsRes, reportsRes, refundsRes] = await Promise.all([
        fetch('/api/users').then(r => r.ok ? r.json() : Promise.reject(r.statusText)).catch(() => ({ status: 'error', data: [] })),
        fetch('/api/tickets').then(r => r.ok ? r.json() : Promise.reject(r.statusText)).catch(() => ({ status: 'error', data: [] })),
        fetch('/api/reports').then(r => r.ok ? r.json() : Promise.reject(r.statusText)).catch(() => ({ status: 'error', data: [] })),
        fetch('/api/refunds').then(r => r.ok ? r.json() : Promise.reject(r.statusText)).catch(() => ({ status: 'error', data: [] })),
      ]);

      const userResults: SearchResult[] = (usersRes.data || []).map((u: any) => ({
        id: String(u.id),
        type: 'user',
        title: u.full_name || u.id,
        description: [u.email, u.phone].filter(Boolean).join(' • '),
        status: u.status,
        date: u.joined_at ? new Date(u.joined_at).toISOString() : undefined,
      }));

      const ticketResults: SearchResult[] = (ticketsRes.data || []).map((t: any) => ({
        id: String(t.id ?? t.ticket_id ?? t.request_id),
        type: 'ticket',
        title: `Ticket #${t.ticket_id ?? t.id}`,
        description: [t.reporter_name && `Reporter: ${t.reporter_name}`, t.request_id && `Request: ${t.request_id}`].filter(Boolean).join(' • '),
        status: t.status ? String(t.status).charAt(0).toUpperCase() + String(t.status).slice(1) : undefined,
        date: t.created_at,
      }));

      const reportResults: SearchResult[] = (reportsRes.data || []).map((r: any) => ({
        id: String(r.id),
        type: 'report',
        title: `Report #${r.id}`,
        description: [r.report_reason && `Reason: ${r.report_reason}`, r.reporter_name && `Reporter: ${r.reporter_name}`].filter(Boolean).join(' • '),
        status: r.status,
        date: r.datetime,
      }));

      const refundResults: SearchResult[] = (refundsRes.data || []).map((rf: any) => ({
        id: String(rf.id).replace(/^RF-/, ''),
        type: 'refund',
        title: `Refund ${rf.id}`,
        description: [rf.user && `User: ${rf.user}`, rf.email, rf.amount && `Amount: ${rf.amount}`].filter(Boolean).join(' • '),
        status: rf.status,
        date: rf.date,
      }));

      const all = [...userResults, ...ticketResults, ...reportResults, ...refundResults];
      const filtered = all.filter(item =>
        [item.title, item.description].filter(Boolean).some(s => s!.toLowerCase().includes(q))
      );

      setResults(filtered);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
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
              Showing results for: <span className="text-white font-semibold">&quot;{query}&quot;</span>
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

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#131322] text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-[#b3b3c6]">Loading search...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
