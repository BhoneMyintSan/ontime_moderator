import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import SearchAndFilter from "../SearchAndFilter";
import { Check, X } from "lucide-react";

interface Ticket {
  id: number;
  reporter_id: string;
  reporter_name: string;
  provider_name: string;
  provider_id: string;
  request_id: number;
  created_at: string; // ISO string
  ticket_id: string;
  status?: string; // "resolved" | "ongoing" | undefined
  refund_approved?: boolean; // true = refund approved, false = refund denied, undefined = pending
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

  const handleRowClick = (ticketId: number, event: React.MouseEvent) => {
    // Don't navigate if the status button was clicked
    if ((event.target as HTMLElement).closest("button")) {
      return;
    }
    router.push(`/dashboard/tickets/${ticketId}`);
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      // Search filter only
      const matchesSearch =
        searchQuery === "" ||
        ticket.ticket_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(ticket.request_id)
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        ticket.reporter_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        ticket.provider_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        ticket.reporter_id.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [tickets, searchQuery]);

  return (
    <div>
      <SearchAndFilter
        searchPlaceholder="Search by ticket ID, request ID, reporter, or provider..."
        onSearchChange={setSearchQuery}
      />

      <div className="bg-[#23233a] rounded-2xl shadow p-0 overflow-x-auto">
        <table className="hidden md:table min-w-[800px] w-full table-fixed">
          <colgroup>
            <col style={{ width: "12%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "14%" }} />
          </colgroup>
          <thead>
            <tr className="text-[#b3b3c6] text-left text-lg">
              <th className="py-4 px-3 sm:px-6 font-semibold">Ticket ID</th>
              <th className="py-4 px-3 sm:px-6 font-semibold">Request ID</th>
              <th className="py-4 px-3 sm:px-6 font-semibold">Reporter</th>
              <th className="py-4 px-3 sm:px-6 font-semibold">Provider</th>
              <th className="py-4 px-3 sm:px-6 font-semibold">Created</th>
              <th className="py-4 px-3 sm:px-6 font-semibold">Refund</th>
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
                <td className="py-3 px-3 sm:px-6">{t.provider_name}</td>
                <td className="py-3 px-3 sm:px-6">
                  {new Date(t.created_at).toISOString().split("T")[0]}
                </td>
                <td className="py-3 px-3 sm:px-6">
                  <div className="flex items-center justify-center">
                    {t.refund_approved === true ? (
                      <div className="flex items-center gap-1 text-green-400">
                        <Check className="w-5 h-5" />
                        <span className="text-sm font-medium">Yes</span>
                      </div>
                    ) : t.refund_approved === false ? (
                      <div className="flex items-center gap-1 text-red-400">
                        <X className="w-5 h-5" />
                        <span className="text-sm font-medium">No</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <span className="text-[#b3b3c6] text-sm font-medium">Pending</span>
                      </div>
                    )}
                  </div>
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
                <td colSpan={7} className="text-center py-8 text-[#b3b3c6]">
                  {searchQuery
                    ? "No tickets match your search criteria."
                    : "No tickets found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Mobile (card) layout */}
      <div className="md:hidden space-y-3">
        {filteredTickets.map(t => (
          <div key={t.id} onClick={(e) => handleRowClick(t.id, e)} className="bg-[#23233a] border border-[#29294d] rounded-lg p-4 flex flex-col gap-2 shadow hover:bg-[#252540] transition cursor-pointer">
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold">Ticket #{t.ticket_id}</span>
              <button
                onClick={(e) => { e.stopPropagation(); onToggleStatus(t.id); }}
                className={`px-3 py-1 rounded-full text-xs font-semibold focus:outline-none transition ${(t.status ?? 'ongoing').toLowerCase() === 'resolved' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}
              >
                {(t.status ?? 'ongoing').toLowerCase() === 'resolved' ? 'Resolved' : 'Ongoing'}
              </button>
            </div>
            <div className="text-[#b3b3c6] text-sm flex flex-col gap-1">
              <div className="flex flex-wrap gap-x-4">
                <span><span className="text-[#8b8ba3]">Request:</span> {t.request_id}</span>
                <span><span className="text-[#8b8ba3]">Date:</span> {new Date(t.created_at).toISOString().split('T')[0]}</span>
              </div>
              <div><span className="text-[#8b8ba3]">Reporter:</span> {t.reporter_name}</div>
              <div><span className="text-[#8b8ba3]">Provider:</span> {t.provider_name}</div>
              <div className="flex items-center gap-2">
                <span className="text-[#8b8ba3]">Refund:</span>
                {t.refund_approved === true ? (
                  <div className="flex items-center gap-1 text-green-400">
                    <Check className="w-4 h-4" />
                    <span className="text-xs font-medium">Approved</span>
                  </div>
                ) : t.refund_approved === false ? (
                  <div className="flex items-center gap-1 text-red-400">
                    <X className="w-4 h-4" />
                    <span className="text-xs font-medium">Denied</span>
                  </div>
                ) : (
                  <span className="text-xs font-medium">Pending</span>
                )}
              </div>
            </div>
          </div>
        ))}
        {filteredTickets.length === 0 && (
          <div className="text-center py-8 text-[#b3b3c6] text-sm border border-dashed border-[#29294d] rounded-lg">No tickets found.</div>
        )}
      </div>
    </div>
  );
};

export default TicketTable;
