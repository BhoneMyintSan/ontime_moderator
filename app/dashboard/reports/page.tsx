"use client";

import { useState, useEffect } from "react";
import ReportTable from "../../../components/tables/ReportTable";
import { AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";

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
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/reports");
        const data = await response.json();

        if (data.status === "success") {
          setReports(data.data);
        } else {
          setError(data.message || "Failed to fetch reports");
          console.error("Failed to fetch reports:", data.message);
        }
      } catch (error) {
        setError("Failed to fetch reports. Please try again.");
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
      <div className="min-h-screen bg-[#23233a] p-8 flex items-center justify-center">
        <div className="text-[#e0e0e0] text-lg">Loading reports...</div>
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
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-red-500/20 to-purple-500/20 flex items-center justify-center border border-red-500/30">
              <AlertTriangle className="w-7 h-7 sm:w-8 sm:h-8 text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Reports</h1>
              <p className="text-[#e0e0e0] text-sm sm:text-base mt-1">
                Review and manage user reports and moderation requests
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
            <ReportTable
              reports={filteredReports}
              filter={activeTab}
              onToggleStatus={handleToggleStatus}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
