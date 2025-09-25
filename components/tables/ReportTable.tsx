"use client";
import React, { useState, useMemo, useEffect } from "react";
import SearchAndFilter from "../SearchAndFilter";
import Pagination from "../Pagination";

const statusStyle: { [key: string]: string } = {
  Resolved: "bg-green-500",
  Unresolved: "bg-red-500",
};

interface Report {
  id: number;
  listing_id: number;
  reporter_name: string;
  report_reason: string;
  datetime: string;
  status: string;
  offender_name?: string;
}

interface ReportTableProps {
  reports: Report[];
  filter: string;
  onToggleStatus: (id: string) => void;
}

const ReportTable: React.FC<ReportTableProps> = ({ reports, filter, onToggleStatus }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filterOptions = {
    status: [
      { label: "Resolved", value: "Resolved" },
      { label: "Unresolved", value: "Unresolved" },
    ],
  };

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      // Apply parent filter first
      const matchesParentFilter = filter === "all" ? true : report.status === filter;
      
      // Search filter
      const matchesSearch = searchQuery === "" || 
        report.reporter_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.id.toString().includes(searchQuery) ||
        report.listing_id.toString().includes(searchQuery) ||
        (report.report_reason && report.report_reason.toLowerCase().includes(searchQuery.toLowerCase()));

      // Status filter
      const matchesStatus = !filters.status || report.status === filters.status;

      return matchesParentFilter && matchesSearch && matchesStatus;
    });
  }, [reports, filter, searchQuery, filters]);

  const paginatedReports = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredReports.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredReports, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  // Reset to page 1 when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  return (
    <div>
      <SearchAndFilter
        searchPlaceholder="Search reports by ID, reporter, or reason..."
        onSearchChange={setSearchQuery}
        onFilterChange={setFilters}
        filterOptions={filterOptions}
      />
      
      <div className="w-full overflow-x-auto rounded-lg">
        <table className="hidden md:table w-full">
          <thead>
            <tr className="text-[#b3b3c6] text-left text-lg">
              <th className="py-4 px-3 sm:px-6 font-semibold">Report ID</th>
              <th className="py-4 px-3 sm:px-6 font-semibold">Service ID</th>
              <th className="py-4 px-3 sm:px-6 font-semibold">Reported By</th>
              <th className="py-4 px-3 sm:px-6 font-semibold">Reason</th>
              <th className="py-4 px-3 sm:px-6 font-semibold">Date</th>
              <th className="py-4 px-3 sm:px-6 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedReports.map((r) => (
            <tr
              key={r.id}
              className="border-t border-[#29294d] hover:bg-[#252540] cursor-pointer"
              onClick={() =>
                (window.location.href = `/dashboard/reports/${r.id}`)
              }
            >
              <td className="py-3 px-3 sm:px-6">{r.id}</td>
              <td className="py-3 px-3 sm:px-6">{r.listing_id}</td>
              <td className="py-3 px-3 sm:px-6">{r.reporter_name}</td>
              <td className="py-3 px-3 sm:px-6">{r.report_reason || 'No reason provided'}</td>
              <td className="py-3 px-3 sm:px-6">
                {new Date(r.datetime).toLocaleDateString()}
              </td>
              <td className="py-3 px-3 sm:px-6">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleStatus(r.id.toString());
                  }}
                  className={`w-28 px-4 py-1 rounded-full text-xs font-semibold focus:outline-none transition text-center
                    ${statusStyle[r.status]} text-white hover:opacity-90`}
                  style={{ minWidth: "7rem" }}
                >
                  {r.status}
                </button>
              </td>
            </tr>
          ))}
          {paginatedReports.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-8 text-[#b3b3c6]">
                {searchQuery || Object.keys(filters).length > 0 
                  ? "No reports match your search criteria." 
                  : "No reports found."}
              </td>
            </tr>
          )}
          </tbody>
        </table>
      </div>
      {/* Mobile cards */}
      <div className="md:hidden space-y-3 mt-4">
        {paginatedReports.map(r => (
          <div key={r.id} className="bg-[#23233a] border border-[#29294d] rounded-lg p-4 flex flex-col gap-2 hover:bg-[#252540] transition cursor-pointer" onClick={() => (window.location.href = `/dashboard/reports/${r.id}`)}>
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold">Report #{r.id}</span>
              <span className={`text-xs px-2 py-1 rounded-full text-white ${statusStyle[r.status]}`}>{r.status}</span>
            </div>
            <div className="text-[#b3b3c6] text-xs flex flex-wrap gap-x-4 gap-y-1">
              <span>Service: {r.listing_id}</span>
              <span>By: {r.reporter_name}</span>
              <span>{new Date(r.datetime).toLocaleDateString()}</span>
            </div>
            <div className="text-[#8b8ba3] text-xs truncate">{r.report_reason || 'No reason provided'}</div>
          </div>
        ))}
        {paginatedReports.length === 0 && (
          <div className="text-center py-8 text-[#b3b3c6] text-sm border border-dashed border-[#29294d] rounded-lg">
            {searchQuery || Object.keys(filters).length > 0 ? 'No reports match your search criteria.' : 'No reports found.'}
          </div>
        )}
      </div>
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        totalItems={filteredReports.length}
      />
    </div>
  );
};

export default ReportTable;
