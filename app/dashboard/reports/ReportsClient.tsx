"use client";

import { useState } from "react";
import ReportTable from "../../../components/tables/ReportTable";

interface ReportsClientProps {
  initialReports: any[];
}

export default function ReportsClient({ initialReports }: ReportsClientProps) {
  const [reports, setReports] = useState(initialReports);
  const [activeTab, setActiveTab] = useState("all");

  const total = reports.length;
  const unresolved = reports.filter((r) => r.status === "Unresolved").length;
  const resolved = reports.filter((r) => r.status === "Resolved").length;

  const filterTabs = [
    { label: "All Reports", key: "all", count: total },
    { label: "Unresolved", key: "Unresolved", count: unresolved },
    { label: "Resolved", key: "Resolved", count: resolved },
  ];

  const filteredReports =
    activeTab === "all"
      ? reports
      : reports.filter((report) => report.status === activeTab);

  const handleToggleStatus = async (id: string) => {
    try {
      const report = reports.find((r) => r.id === id);
      if (!report) return;

      const newStatus =
        report.status === "Resolved" ? "Unresolved" : "Resolved";

      const response = await fetch(`/api/reports/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setReports((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
        );
      }
    } catch (error) {
      console.error("Failed to update report status:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 px-2 sm:px-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">
        Reports
      </h1>
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
        <ReportTable
          reports={filteredReports}
          filter={activeTab}
          onToggleStatus={handleToggleStatus}
        />
      </div>
    </div>
  );
}
