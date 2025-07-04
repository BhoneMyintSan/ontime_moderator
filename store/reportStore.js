import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useReportStore = create(
  persist(
    (set) => ({
      reports: [
        {
          id: 'RP-101',
          serviceId: 'SVD-201',
          reporter: 'Alice_brown',
          against: 'Jhon_Doe',
          reason: 'Miss Conduct',
          date: '28 Jan,2025 at 12.30 AM',
          status: 'Resolved',
          details: 'This provider is providing the service that is differ from the description. This is not what i want to learn!!! AND IT IS COMPLETELY OFF TOPIC!!!'
        },
        // Add more reports as needed
      ],
      toggleStatus: (id) =>
        set((state) => ({
          reports: state.reports.map((r) =>
            r.id === id
              ? { ...r, status: r.status === "Resolved" ? "Unresolved" : "Resolved" }
              : r
          ),
        })),
    }),
    {
      name: "report-storage", // unique name
    }
  )
);