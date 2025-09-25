'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ReportDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [serviceStopped, setServiceStopped] = useState(false);

  useEffect(() => {
    if (!id || Array.isArray(id)) {
      setError("Invalid report ID");
      setLoading(false);
      return;
    }
    
    const fetchReport = async () => {
      try {
        const res = await fetch(`/api/reports/${id}`);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const json = await res.json();
        if (json.status === "success") {
          setReport(json.data);
          setError(null);
        } else {
          setError(json.message || "Failed to load report");
        }
      } catch (error) {
        console.error("Failed to load report:", error);
        setError("Failed to load report. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  if (loading) {
    return <div className="text-white p-8">Loading report...</div>;
  }

  if (error) {
    return (
      <div className="text-white p-8">
        <div className="text-red-400 mb-4">Error: {error}</div>
        <button
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white"
          onClick={() => router.back()}
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!report) return <div className="text-white p-8">Report not found.</div>;

  return (
    <div className="min-h-screen bg-[#23233a] p-4 sm:p-6">
      <div className="w-full max-w-5xl mx-auto space-y-5 sm:space-y-6">
        {/* Status Button */}
        <div className="flex justify-end -mb-2 sm:mb-0">
          <button
            className={`px-6 sm:px-8 py-2 rounded-full font-medium sm:font-semibold text-sm sm:text-lg ${report.status === "Resolved" ? "bg-green-500 text-black" : "bg-red-500 text-white"} shadow transition`}
            onClick={async () => {
              if (!id || Array.isArray(id)) return;
              const newStatus = report.status === "Resolved" ? "Unresolved" : "Resolved";
              try {
                const res = await fetch(`/api/reports/${id}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ status: newStatus }),
                });
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const json = await res.json();
                if (json.status === "success") setReport(json.data);
              } catch (error) {
                console.error("Failed to update report status:", error);
              }
            }}
          >
            {report.status}
          </button>
        </div>

        <div className="bg-[#29294d] rounded-2xl shadow-lg p-5 sm:p-8 flex flex-col gap-6 sm:gap-8">
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Left */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Report #{report.id}</h2>
              <p className="text-[#b3b3c6] mb-4 text-sm sm:text-base">
                Submitted on {new Date(report.datetime).toLocaleDateString()}
              </p>
              <h3 className="font-semibold text-white mb-2 text-sm sm:text-base tracking-wide uppercase">Report Details</h3>
              <div className="space-y-2 text-sm sm:text-base">
                <div>
                  <span className="text-[#b3b3c6]">Reporter: </span>
                  <span className="font-medium text-white break-words">{report.users?.full_name || 'Unknown'}</span>
                </div>
                <div>
                  <span className="text-[#b3b3c6]">Service Listed By: </span>
                  <span className="font-medium text-white break-words">{report.service_listings?.users?.full_name || 'Unknown'}</span>
                </div>
                <div>
                  <span className="text-[#b3b3c6]">Service Title: </span>
                  <span className="font-medium text-white break-words">{report.service_listings?.title || 'Unknown'}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[#b3b3c6]">Reason:</span>
                  <span className="inline-block bg-fuchsia-700 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                    {report.report_reason || 'No reason provided'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="space-y-4">
              <h3 className="font-semibold text-white text-sm sm:text-base tracking-wide uppercase">Additional Details</h3>
              <p className="text-[#b3b3c6] text-sm sm:text-base leading-relaxed">
                {report.additional_detail || 'No additional details provided'}
              </p>
              <div>
                <h4 className="font-semibold text-white mb-2 text-sm sm:text-base tracking-wide uppercase">Service Description</h4>
                <p className="text-[#b3b3c6] text-sm sm:text-base leading-relaxed">
                  {report.service_listings?.description || 'No description available'}
                </p>
              </div>
            </div>
          </div>

          {/* Actions - collapsible on mobile */}
          <details className="border-t border-[#383862] pt-6 md:open" open>
            <summary className="md:hidden cursor-pointer text-white font-medium text-sm mb-4 list-none flex items-center justify-between">
              <span>Actions</span>
              <span className="text-xs text-[#b3b3c6]">Tap to toggle</span>
            </summary>
            <div className="hidden md:block mb-4">
              <h3 className="font-semibold text-white text-base sm:text-lg">Actions</h3>
            </div>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
              <button 
                className="bg-[#6366f1] hover:bg-[#4f46e5] px-5 py-2 sm:px-6 sm:py-3 rounded-lg text-white text-sm sm:text-base font-medium shadow transition disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={() => router.push(`/dashboard/users/${report.service_listings?.users?.id}`)}
                disabled={!report.service_listings?.users?.id}
              >
                Moderate User
              </button>
              <button
                className={`px-5 py-2 sm:px-6 sm:py-3 rounded-lg text-sm sm:text-base font-medium shadow transition ${
                  serviceStopped
                    ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                    : "bg-red-500 hover:bg-red-600 text-white"
                }`}
                onClick={() => setServiceStopped(!serviceStopped)}
              >
                {serviceStopped ? "Undo Stop Service" : "Stop Service"}
              </button>
              <button
                className="bg-[#444b] hover:bg-[#555b] px-5 py-2 sm:px-6 sm:py-3 rounded-lg text-white text-sm sm:text-base font-medium shadow transition"
                onClick={() => router.push('/dashboard/reports')}
              >
                Back
              </button>
            </div>
          </details>
          {serviceStopped && (
            <div className="mt-2 text-green-400 font-medium text-center text-sm">
              Service has been stopped for this user.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}