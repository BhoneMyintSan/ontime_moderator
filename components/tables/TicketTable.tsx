import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import SearchAndFilter from "../SearchAndFilter";

interface Ticket {
  id: number;
  reporter_id: string;
  reporter_name: string;
  request_id: number;
  created_at: string; // ISO string
  ticket_id: string;
  status?: string; // "resolved" | "ongoing" | undefined
}

interface TicketTableProps {
  tickets: Ticket[];
  onToggleStatus: (id: number) => void;
}

const TicketTable: React.FC<TicketTableProps> = ({
  tickets,
  onToggleStatus,
}) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});

  const handleRowClick = (ticketId: number, event: React.MouseEvent) => {
    // Don't navigate if the status button was clicked
    if ((event.target as HTMLElement).closest("button")) {
      return;
    }
    router.push(`/dashboard/tickets/${ticketId}`);
  };

  const filterOptions = {
    status: [
      { label: "Resolved", value: "resolved" },
      { label: "Ongoing", value: "ongoing" },
    ],
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        ticket.ticket_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(ticket.request_id)
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        ticket.reporter_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        ticket.reporter_id.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const normalizedStatus = (ticket.status ?? "ongoing").toLowerCase();
      const matchesStatus =
        !filters.status || normalizedStatus === filters.status;

      return matchesSearch && matchesStatus;
    });
  }, [tickets, searchQuery, filters]);

  return (
    <div>
      <SearchAndFilter
        searchPlaceholder="Search by ticket ID, request ID, or reporter name..."
        onSearchChange={setSearchQuery}
        onFilterChange={setFilters}
        filterOptions={filterOptions}
      />

      <div className="bg-[#23233a] rounded-2xl shadow p-0 overflow-x-auto">
        <table className="min-w-[650px] w-full table-fixed">
          <colgroup>
            <col style={{ width: "20%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "25%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "15%" }} />
          </colgroup>
          <thead>
            <tr className="text-[#b3b3c6] text-left text-lg">
              <th className="py-4 px-3 sm:px-6 font-semibold">Ticket ID</th>
              <th className="py-4 px-3 sm:px-6 font-semibold">Request ID</th>
              <th className="py-4 px-3 sm:px-6 font-semibold">Reporter Name</th>
              <th className="py-4 px-3 sm:px-6 font-semibold">Created</th>
              <th className="py-4 px-3 sm:px-6 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((t) => (
              <tr
                key={t.id}
                className="border-t border-[#29294d] text-[#e6e6f0] text-base transition-colors hover:bg-[#252540] cursor-pointer"
                onClick={(e) => handleRowClick(t.id, e)}
              >
                <td className="py-3 px-3 sm:px-6">{t.ticket_id}</td>
                <td className="py-3 px-3 sm:px-6">{t.request_id}</td>
                <td className="py-3 px-3 sm:px-6">{t.reporter_name}</td>
                <td className="py-3 px-3 sm:px-6">
                  {new Date(t.created_at).toISOString().split("T")[0]}
                </td>
                <td className="py-3 px-3 sm:px-6">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click
                      onToggleStatus(t.id);
                    }}
                    className={`w-28 px-4 py-1 rounded-full text-sm font-semibold focus:outline-none transition text-center ${
                      (t.status ?? "ongoing").toLowerCase() === "resolved"
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-yellow-500 text-white hover:bg-yellow-600"
                    }`}
                    style={{ minWidth: "7rem" }}
                  >
                    {(t.status ?? "ongoing").toLowerCase() === "resolved"
                      ? "Resolved"
                      : "Ongoing"}
                  </button>
                </td>
              </tr>
            ))}
            {filteredTickets.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-[#b3b3c6]">
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
