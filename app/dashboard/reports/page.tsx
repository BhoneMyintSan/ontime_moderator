"use client";

import { useState, useEffect } from "react";
import ReportTable from "../../../components/tables/ReportTable";

interface Report {
  id: number;
  listing_id: number;
  reporter_name: string;
  report_reason: string;
  datetime: string;
  status: string;
  offender_name?: string;
}

export default function Reports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch("/api/reports");
        const data = await response.json();

        if (data.status === "success") {
          setReports(data.data);
        } else {
          console.error("Failed to fetch reports:", data.message);
        }
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

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
      const report = reports.find((r) => r.id.toString() === id);
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
          prev.map((r) => (r.id.toString() === id ? { ...r, status: newStatus } : r))
        );
      }
    } catch (error) {
      console.error("Failed to update report status:", error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12 text-[#b3b3c6]">Loading reports...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2">
        Reports
      </h1>
      <p className="text-[#b3b3c6] mb-8">Review and manage user reports and moderation requests.</p>
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
          <ReportTable
            reports={filteredReports}
            filter={activeTab}
            onToggleStatus={handleToggleStatus}
          />
        </div>
      </div>
    </div>
  );
}
