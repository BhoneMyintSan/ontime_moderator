"use client";
import { useState } from "react";
import { useReportStore } from "../../../store/reportStore";
import ReportTable from '../../../components/ReportTable';

export default function Reports() {
  const { reports, toggleStatus } = useReportStore();
  const [activeTab, setActiveTab] = useState("all");

  const total = reports.length;
  const unresolved = reports.filter(r => r.status === "Unresolved").length;
  const resolved = reports.filter(r => r.status === "Resolved").length;

  const filterTabs = [
    { label: "All Reports", key: "all", count: total },
    { label: "Unresolved", key: "Unresolved", count: unresolved },
    { label: "Resolved", key: "Resolved", count: resolved },
  ];

  return (
    <div className="max-w-5xl mx-auto mt-10 px-2 sm:px-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">Reports</h1>
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
          filter={activeTab}
          reports={activeTab === "all" ? reports : reports.filter(r => r.status === activeTab)}
          onToggleStatus={toggleStatus}
        />
      </div>
    </div>
  );
}
