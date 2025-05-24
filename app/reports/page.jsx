"use client";
import { useState } from "react";
import ReportTable from '../../components/ReportTable';

const filterTabs = [
  { label: "All Reports", key: "all" },
  { label: "Unresolved", key: "Unresolved" },
  { label: "Resolved", key: "Resolved" },
];

export default function Reports() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h1 className="text-3xl font-bold text-white mb-6">Reports</h1>
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
            {tab.label}
          </button>
        ))}
      </div>
      <div className="bg-[#23233a] rounded-2xl shadow p-0 overflow-x-auto">
        <ReportTable filter={activeTab} />
      </div>
    </div>
  );
}
