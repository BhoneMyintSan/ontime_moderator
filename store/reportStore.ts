import { create } from "zustand";
import { Report } from "@/lib/types";

interface ReportState {
  reports: Report[];
  fetchReports: () => Promise<void>;
  toggleStatus: (id: number) => Promise<void>;
}

export const useReportStore = create<ReportState>((set, get) => ({
  reports: [],
  fetchReports: async () => {
    try {
      const res = await fetch("/api/reports");
      const json = await res.json();
      if (json.status === "success") {
        set({ reports: json.data });
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    }
  },
  toggleStatus: async (id) => {
    const report = get().reports.find((r) => r.id === id);
    if (!report) return;

    const newStatus = report.status === "Resolved" ? "Unresolved" : "Resolved";

    try {
      const res = await fetch(`/api/reports/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.status === "success") {
        get().fetchReports();
      }
    } catch (error) {
      console.error("Failed to update report status:", error);
    }
  },
}));