"use client";
import { useState } from "react";
import TicketTable from '../../components/TicketTable';

const tickets = [
  { id: "TCK-001", service: "SVD-201", by: "alice_brown", against: "jhon_doe", date: "28 Jan, 10:30 AM", status: "Resolved" },
  { id: "TCK-002", service: "SVD-202", by: "jhon_doe", against: "mike_w", date: "28 Jan, 10:30 AM", status: "Unresolved" },
  { id: "TCK-003", service: "SVD-203", by: "emily_white", against: "bruce_lee", date: "28 Jan, 10:30 AM", status: "Unresolved" },
  { id: "TCK-004", service: "SVD-204", by: "michael_smith", against: "emily_white", date: "28 Jan, 10:30 AM", status: "Unresolved" },
];

const filterTabs = [
  { label: "All Ticket", key: "all", count: tickets.length },
  { label: "Unresolved", key: "Unresolved", count: tickets.filter(t => t.status === "Unresolved").length },
  { label: "Resolved", key: "Resolved", count: tickets.filter(t => t.status === "Resolved").length },
];

export default function Tickets() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredTickets =
    activeTab === "all"
      ? tickets
      : tickets.filter((t) => t.status === activeTab);

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h1 className="text-3xl font-bold text-white mb-6">Ticket</h1>
      <div className="flex gap-4 mb-8">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-8 py-2 rounded-lg font-medium text-base focus:outline-none transition
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
      <TicketTable tickets={filteredTickets} />
    </div>
  );
}
