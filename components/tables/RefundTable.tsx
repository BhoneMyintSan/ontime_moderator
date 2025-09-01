import React, { useState, useMemo, useEffect } from "react";
import { Refund } from "@/lib/types";
import SearchAndFilter from "../SearchAndFilter";
import Pagination from "../Pagination";

const statusStyle: { [key: string]: string } = {
  Approved: "bg-green-600",
  Pending: "bg-yellow-500",
  Rejected: "bg-red-600",
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
        <table className="w-full">
          <thead>
            <tr className="text-[#b3b3c6] text-left text-lg">
              <th className="py-4 px-3 sm:px-6 font-semibold">Refund ID</th>
              <th className="py-4 px-3 sm:px-6 font-semibold">User</th>
              <th className="py-4 px-3 sm:px-6 font-semibold">Email</th>
              <th className="py-4 px-3 sm:px-6 font-semibold">Amount</th>
              <th className="py-4 px-3 sm:px-6 font-semibold">Status</th>
              <th className="py-4 px-3 sm:px-6 font-semibold">Date</th>
              <th className="py-4 px-3 sm:px-6 font-semibold">Reason</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRefunds.map((refund) => (
              <tr
                key={refund.id}
                className="border-t border-[#29294d] hover:bg-[#252540] transition"
              >
                <td className="py-3 px-3 sm:px-6">{refund.id}</td>
                <td className="py-3 px-3 sm:px-6">{refund.user}</td>
                <td className="py-3 px-3 sm:px-6">{refund.email}</td>
                <td className="py-3 px-3 sm:px-6">{refund.amount}</td>
                <td className="py-3 px-3 sm:px-6">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${statusStyle[refund.status]}`}
                    style={{ minWidth: "7rem", display: "inline-block", textAlign: "center" }}
                  >
                    {refund.status}
                  </span>
                </td>
                <td className="py-3 px-3 sm:px-6">{refund.date}</td>
                <td className="py-3 px-3 sm:px-6">{refund.reason}</td>
              </tr>
            ))}
            {paginatedRefunds.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-8 text-[#b3b3c6]">
                  {searchQuery || Object.keys(filters).length > 0 
                    ? "No refunds match your search criteria." 
                    : "No refunds found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
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