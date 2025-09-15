"use client";
import { useState, useEffect } from "react";
import TicketTable from "../../../components/tables/TicketTable";

interface Ticket {
  id: number;
  reporter_id: string;
  reporter_name: string;
  request_id: number;
  created_at: string;
  ticket_id: string;
  status?: string;
}

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export default function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/tickets");
        const data: ApiResponse<Ticket[]> = await response.json();

        if (data.status === "success") {
          setTickets(data.data);
        } else {
          setError(data.message || "Failed to fetch tickets");
        }
      } catch (err) {
        setError("Failed to fetch tickets");
        console.error("Failed to fetch tickets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const filterTabs = [
    { label: "All Ticket", key: "all", count: tickets.length },
    {
      label: "Unresolved",
      key: "ongoing",
      count: tickets.filter(
        (t) => (t.status ?? "ongoing").toLowerCase() === "ongoing"
      ).length,
    },
    {
      label: "Resolved",
      key: "resolved",
      count: tickets.filter(
        (t) => (t.status ?? "ongoing").toLowerCase() === "resolved"
      ).length,
    },
  ];

  const filteredTickets =
    activeTab === "all"
      ? tickets
      : tickets.filter(
          (t) => (t.status ?? "ongoing").toLowerCase() === activeTab
        );

  const toggleStatus = async (id: number) => {
    try {
      const ticket = tickets.find((t) => t.id === id);
      if (!ticket) return;

      const current = (ticket.status ?? "ongoing").toLowerCase();
      const newStatus = current === "resolved" ? "ongoing" : "resolved";

      const response = await fetch(`/api/tickets/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data: ApiResponse<Ticket> = await response.json();

      if (data.status === "success") {
        setTickets((prev) =>
          prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
        );
      } else {
        setError(data.message || "Failed to update ticket status");
      }
    } catch (err) {
      setError("Failed to update ticket status");
      console.error("Failed to update ticket status:", err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12 text-[#b3b3c6]">
          Loading tickets...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12 text-red-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2">Tickets</h1>
      <p className="text-[#b3b3c6] mb-8">
        Manage support tickets and user inquiries.
      </p>
      <div className="flex flex-wrap gap-2 sm:gap-4 mb-8">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 sm:px-8 py-2 rounded-lg font-medium text-base focus:outline-none transition
              ${
                activeTab === tab.key
                  ? "bg-blue-600 text-white shadow"
                  : "bg-[#23233a] text-[#b3b3c6] border border-[#29294d]"
              }
            `}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>
      <div className="bg-[#23233a] rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <TicketTable
            tickets={filteredTickets}
            onToggleStatus={toggleStatus}
          />
        </div>
      </div>
    </div>
  );
}
