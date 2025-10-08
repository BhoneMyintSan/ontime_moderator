import React, { useState, useMemo, useEffect } from "react";
import { Refund } from "@/lib/types";
import SearchAndFilter from "../SearchAndFilter";
import Pagination from "../Pagination";
import { Search } from "lucide-react";

const statusStyle: { [key: string]: string } = {
  Approved: "bg-green-500/20 text-green-400 border-green-500/50",
  Pending: "bg-amber-500/20 text-amber-400 border-amber-500/50",
  Rejected: "bg-red-500/20 text-red-400 border-red-500/50",
};

interface RefundTableProps {
  refunds: Refund[];
}

const RefundTable: React.FC<RefundTableProps> = ({ refunds }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filterOptions = {
    status: [
      { label: "Approved", value: "Approved" },
      { label: "Pending", value: "Pending" },
      { label: "Rejected", value: "Rejected" },
    ],
  };

  const filteredRefunds = useMemo(() => {
    return refunds.filter((refund) => {
      // Search filter
      const matchesSearch = searchQuery === "" || 
        refund.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        refund.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        refund.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        refund.reason.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus = !filters.status || refund.status === filters.status;

      return matchesSearch && matchesStatus;
    });
  }, [refunds, searchQuery, filters]);

  const paginatedRefunds = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRefunds.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRefunds, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredRefunds.length / itemsPerPage);

  // Reset to page 1 when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  return (
    <div>
      <SearchAndFilter
        searchPlaceholder="Search refunds by user, email, ID, or reason..."
        onSearchChange={setSearchQuery}
        onFilterChange={setFilters}
        filterOptions={filterOptions}
      />
      
      <div className="w-full overflow-x-auto rounded-lg">
        <table className="hidden md:table w-full">
          <thead>
            <tr className="text-[#e0e0e0] text-left text-sm border-b border-[#29294d]">
              <th className="py-4 px-3 sm:px-6 font-semibold uppercase tracking-wide">Refund ID</th>
              <th className="py-4 px-3 sm:px-6 font-semibold uppercase tracking-wide">User</th>
              <th className="py-4 px-3 sm:px-6 font-semibold uppercase tracking-wide">Email</th>
              <th className="py-4 px-3 sm:px-6 font-semibold uppercase tracking-wide">Amount</th>
              <th className="py-4 px-3 sm:px-6 font-semibold uppercase tracking-wide">Status</th>
              <th className="py-4 px-3 sm:px-6 font-semibold uppercase tracking-wide">Date</th>
              <th className="py-4 px-3 sm:px-6 font-semibold uppercase tracking-wide">Reason</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRefunds.map((refund) => (
              <tr
                key={refund.id}
                className="border-t border-[#29294d] hover:bg-[#252540]/50 transition-colors"
              >
                <td className="py-4 px-3 sm:px-6 text-[#e0e0e0] font-medium">{refund.id}</td>
                <td className="py-4 px-3 sm:px-6 text-[#e0e0e0]">{refund.user}</td>
                <td className="py-4 px-3 sm:px-6 text-[#9ca3af]">{refund.email}</td>
                <td className="py-4 px-3 sm:px-6 text-emerald-400 font-semibold">{refund.amount}</td>
                <td className="py-4 px-3 sm:px-6">
                  <span
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${statusStyle[refund.status]}`}
                    style={{ minWidth: "7rem", display: "inline-block", textAlign: "center" }}
                  >
                    {refund.status}
                  </span>
                </td>
                <td className="py-4 px-3 sm:px-6 text-[#9ca3af]">{refund.date}</td>
                <td className="py-4 px-3 sm:px-6 text-[#e0e0e0]">{refund.reason}</td>
              </tr>
            ))}
            {paginatedRefunds.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-xl bg-[#252540] flex items-center justify-center">
                      <Search className="w-8 h-8 text-[#9ca3af]" />
                    </div>
                    <p className="text-[#e0e0e0] font-medium">
                      {searchQuery || Object.keys(filters).length > 0 
                        ? "No refunds match your search criteria" 
                        : "No refunds found"}
                    </p>
                    <p className="text-[#9ca3af] text-sm">
                      {searchQuery || Object.keys(filters).length > 0 
                        ? "Try adjusting your search or filters" 
                        : "Refund requests will appear here"}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Mobile cards */}
      <div className="md:hidden space-y-4 mt-4">
        {paginatedRefunds.map(r => (
          <div key={r.id} className="bg-gradient-to-br from-[#252540] to-[#1f1f33] border border-[#29294d] rounded-2xl p-5 flex flex-col gap-3 hover:scale-[1.02] transition-all duration-300 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-white font-bold text-lg">#{r.id}</span>
              <span className={`text-xs px-3 py-1.5 rounded-lg font-semibold border ${statusStyle[r.status]}`}>{r.status}</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[#9ca3af] text-sm">User:</span>
                <span className="text-[#e0e0e0] font-medium">{r.user}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#9ca3af] text-sm">Amount:</span>
                <span className="text-emerald-400 font-bold">{r.amount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#9ca3af] text-sm">Date:</span>
                <span className="text-[#e0e0e0]">{r.date}</span>
              </div>
            </div>
            <div className="pt-3 border-t border-[#29294d]">
              <p className="text-[#9ca3af] text-xs mb-1">Reason:</p>
              <p className="text-[#e0e0e0] text-sm">{r.reason || 'N/A'}</p>
            </div>
            <div className="pt-2 border-t border-[#29294d]">
              <p className="text-[#6d6d85] text-xs break-all">{r.email}</p>
            </div>
          </div>
        ))}
        {paginatedRefunds.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-[#29294d] rounded-2xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-[#252540] flex items-center justify-center">
              <Search className="w-8 h-8 text-[#9ca3af]" />
            </div>
            <p className="text-[#e0e0e0] font-medium mb-1">
              {searchQuery || Object.keys(filters).length > 0 ? 'No refunds match your criteria' : 'No refunds found'}
            </p>
            <p className="text-[#9ca3af] text-sm">
              {searchQuery || Object.keys(filters).length > 0 ? 'Try adjusting your search or filters' : 'Refund requests will appear here'}
            </p>
          </div>
        )}
      </div>
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        totalItems={filteredRefunds.length}
      />
    </div>
  );
};

export default RefundTable;