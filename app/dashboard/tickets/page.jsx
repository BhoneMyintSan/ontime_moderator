"use client";
import { useState } from "react";
import TicketTable from "../../../components/tables/TicketTable";
import ticketsData from "../../../data/mockTickets";

export default function Tickets() {
  const [tickets, setTickets] = useState(ticketsData);
  const [activeTab, setActiveTab] = useState("all");

  const filterTabs = [
    { label: "All Ticket", key: "all", count: tickets.length },
    { label: "Unresolved", key: "Unresolved", count: tickets.filter(t => t.status === "Unresolved").length },
    { label: "Resolved", key: "Resolved", count: tickets.filter(t => t.status === "Resolved").length },
  ];

  const filteredTickets =
    activeTab === "all"
      ? tickets
      : tickets.filter((t) => t.status === activeTab);

  const toggleStatus = (id) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "Resolved" ? "Unresolved" : "Resolved" }
          : t
      )
    );
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 px-2 sm:px-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">Ticket</h1>
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
      <div className="bg-[#23233a] rounded-2xl shadow p-0 overflow-x-auto">
        <TicketTable tickets={filteredTickets} onToggleStatus={toggleStatus} />
      </div>
    </div>
  );
}
