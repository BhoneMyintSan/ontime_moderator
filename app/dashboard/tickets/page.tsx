"use client";
import { useState, useEffect } from "react";
import TicketTable from "../../../components/tables/TicketTable";
import { Ticket, AlertCircle, CheckCircle } from "lucide-react";

interface IssueTicket {
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

export default function IssuesTicket() {
  const [tickets, setTickets] = useState<IssueTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/tickets");
        const data: ApiResponse<IssueTicket[]> = await response.json();

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
    { label: "All Issues", key: "all", count: tickets.length },
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

      const data: ApiResponse<IssueTicket> = await response.json();

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
      <div className="min-h-screen bg-[#23233a] p-8 flex items-center justify-center">
        <div className="text-[#e0e0e0] text-lg">Loading issue tickets...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#23233a] p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#1f1f33] border border-red-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <h2 className="text-xl font-semibold text-red-400">Error</h2>
            </div>
            <p className="text-[#e0e0e0]">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#23233a] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Card with Gradient */}
        <div className="relative bg-gradient-to-br from-[#1f1f33] to-[#252540] rounded-2xl p-6 sm:p-8 mb-6 border border-[#29294d] overflow-hidden">
          {/* Gradient Glow Effect */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-blue-500/30">
              <Ticket className="w-7 h-7 sm:w-8 sm:h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Issues Ticket</h1>
              <p className="text-[#e0e0e0] text-sm sm:text-base mt-1">
                Manage service request issues and user disputes
              </p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-6">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
                activeTab === tab.key
                  ? "bg-[#6366f1] text-white shadow-lg shadow-indigo-500/30"
                  : "bg-[#1f1f33] text-[#e0e0e0] border border-[#29294d] hover:border-[#383862]"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-[#1f1f33] rounded-2xl shadow-lg border border-[#29294d] overflow-hidden">
          <div className="p-6">
            <TicketTable
              tickets={filteredTickets}
              onToggleStatus={toggleStatus}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
