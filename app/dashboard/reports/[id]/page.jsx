'use client';

import { useParams, useRouter } from 'next/navigation';
import { useReportStore } from "../../../../store/reportStore";
import { useState } from 'react';

export default function ReportDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { reports, toggleStatus } = useReportStore();
  const report = reports.find(r => r.id === id);
  const [serviceStopped, setServiceStopped] = useState(false);

  if (!report) return <div className="text-white p-8">Report not found.</div>;

  return (
    <div className="flex justify-center items-start min-h-screen pt-12 bg-[#23233a]">
      <div className="w-full max-w-5xl">
        <div className="flex justify-end mb-4">
          <button
            className={`px-8 py-2 rounded-full font-semibold text-lg ${report.status === "Resolved" ? "bg-green-500 text-black" : "bg-red-500 text-white"}`}
            onClick={() => toggleStatus(report.id)}
          >
            {report.status}
          </button>
        </div>
        <div className="bg-[#29294d] rounded-2xl shadow-lg p-8 flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:justify-between gap-8">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">Report ID #{report.id}</h2>
              <p className="text-[#b3b3c6] mb-4">Submitted on {report.date}</p>
              <h3 className="font-bold text-white mb-2">Report Details</h3>
              <div className="mb-2">
                <span className="text-[#b3b3c6]">Reporter </span>
                <span className="font-bold text-white">{report.reporter}</span>
              </div>
              <div className="mb-2">
                <span className="text-[#b3b3c6]">Against </span>
                <span className="font-bold text-white">{report.against}</span>
              </div>
              <div className="mb-2">
                <span className="text-[#b3b3c6]">Reason </span>
                <span className="inline-block bg-fuchsia-700 text-white px-4 py-1 rounded-full font-semibold ml-2">{report.reason}</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white mb-2">Additional Details</h3>
              <p className="text-[#b3b3c6]">{report.details}</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:justify-between gap-4">
            <div className="flex gap-4">
              <button className="bg-[#6366f1] hover:bg-[#4f46e5] px-6 py-2 rounded-lg text-white font-semibold shadow transition">
                Moderate User
              </button>
              <button
                className={`px-6 py-2 rounded-lg font-semibold shadow transition ${
                  serviceStopped
                    ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                    : "bg-red-500 hover:bg-red-600 text-white"
                }`}
                onClick={() => setServiceStopped(!serviceStopped)}
              >
                {serviceStopped ? "Undo Stop Service" : "Stop Service"}
              </button>
            </div>
            <button
              className="bg-[#6366f1] hover:bg-[#4f46e5] px-8 py-2 rounded-lg text-white font-semibold shadow transition self-end"
              onClick={() => router.push('/dashboard/reports')}
            >
              Done
            </button>
          </div>
          {serviceStopped && (
            <div className="mt-4 text-green-400 font-semibold text-center">
              Service has been stopped for this user.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}