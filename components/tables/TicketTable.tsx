import React, { useState, useMemo } from "react";
import SearchAndFilter from "../SearchAndFilter";

interface Ticket {
  id: string;
  service: string;
  by: string;
  against: string;
  date: string;
  status: string;
}

interface TicketTableProps {
  tickets: Ticket[];
  onToggleStatus: (id: string) => void;
}

const TicketTable: React.FC<TicketTableProps> = ({ tickets, onToggleStatus }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});

  const filterOptions = {
    status: [
      { label: "Resolved", value: "Resolved" },
      { label: "Pending", value: "Pending" },
      { label: "In Progress", value: "In Progress" },
    ],
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      // Search filter
      const matchesSearch = searchQuery === "" || 
        ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.by.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.against.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus = !filters.status || ticket.status === filters.status;

      return matchesSearch && matchesStatus;
    });
  }, [tickets, searchQuery, filters]);

  return (
    <div>
      <SearchAndFilter
        searchPlaceholder="Search tickets by ID, service, reporter, or target..."
        onSearchChange={setSearchQuery}
        onFilterChange={setFilters}
        filterOptions={filterOptions}
      />
      
      <div className="bg-[#23233a] rounded-2xl shadow p-0 overflow-x-auto">
        <table className="min-w-[600px] w-full table-fixed">
          <colgroup>
            <col style={{ width: "12%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "20%" }} />
          </colgroup>
          <thead>
            <tr className="text-[#b3b3c6] text-left text-lg">
              <th className="py-4 px-3 sm:px-6 font-semibold">Ticket ID</th>
              <th className="py-4 px-3 sm:px-6 font-semibold">Service ID</th>
              <th className="py-4 px-3 sm:px-6 font-semibold">Reported By</th>
              <th className="py-4 px-3 sm:px-6 font-semibold">Against</th>
              <th className="py-4 px-3 sm:px-6 font-semibold">Date</th>
              <th className="py-4 px-3 sm:px-6 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((t) => (
              <tr
                key={t.id}
                className="border-t border-[#29294d] text-[#e6e6f0] text-base transition-colors hover:bg-[#252540] cursor-pointer"
              >
                <td className="py-3 px-3 sm:px-6">{t.id}</td>
                <td className="py-3 px-3 sm:px-6">{t.service}</td>
                <td className="py-3 px-3 sm:px-6">{t.by}</td>
                <td className="py-3 px-3 sm:px-6">{t.against}</td>
                <td className="py-3 px-3 sm:px-6">{t.date}</td>
                <td className="py-3 px-3 sm:px-6">
                  <button
                    onClick={() => onToggleStatus(t.id)}
                    className={`w-28 px-4 py-1 rounded-full text-sm font-semibold focus:outline-none transition text-center
                      ${
                        t.status === "Resolved"
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : "bg-red-500 text-white hover:bg-red-600"
                      }
                    `}
                    style={{ minWidth: "7rem" }}
                  >
                    {t.status}
                  </button>
                </td>
              </tr>
            ))}
            {filteredTickets.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-[#b3b3c6]">
                  {searchQuery || Object.keys(filters).length > 0 
                    ? "No tickets match your search criteria." 
                    : "No tickets found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketTable;