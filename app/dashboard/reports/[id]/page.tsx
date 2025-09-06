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
    <div className="flex justify-center items-start min-h-screen pt-12 bg-[#23233a]">
      <div className="w-full max-w-5xl">
        <div className="flex justify-end mb-4">
          <button
            className={`px-8 py-2 rounded-full font-semibold text-lg ${report.status === "Resolved" ? "bg-green-500 text-black" : "bg-red-500 text-white"}`}
            onClick={async () => {
              if (!id || Array.isArray(id)) return;
              
              const newStatus = report.status === "Resolved" ? "Unresolved" : "Resolved";
              try {
                const res = await fetch(`/api/reports/${id}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ status: newStatus }),
                });
                
                if (!res.ok) {
                  throw new Error(`HTTP error! status: ${res.status}`);
                }
                
                const json = await res.json();
                if (json.status === "success") {
                  setReport(json.data);
                }
              } catch (error) {
                console.error("Failed to update report status:", error);
              }
            }}
          >
            {report.status}
          </button>
        </div>
        <div className="bg-[#29294d] rounded-2xl shadow-lg p-8 flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:justify-between gap-8">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">Report ID #{report.id}</h2>
              <p className="text-[#b3b3c6] mb-4">
                Submitted on {new Date(report.datetime).toLocaleDateString()}
              </p>
              <h3 className="font-bold text-white mb-2">Report Details</h3>
              <div className="mb-2">
                <span className="text-[#b3b3c6]">Reporter: </span>
                <span className="font-bold text-white">{report.users?.full_name || 'Unknown'}</span>
              </div>
              <div className="mb-2">
                <span className="text-[#b3b3c6]">Service Listed By: </span>
                <span className="font-bold text-white">{report.service_listings?.users?.full_name || 'Unknown'}</span>
              </div>
              <div className="mb-2">
                <span className="text-[#b3b3c6]">Service Title: </span>
                <span className="font-bold text-white">{report.service_listings?.title || 'Unknown'}</span>
              </div>
              <div className="mb-2">
                <span className="text-[#b3b3c6]">Reason: </span>
                <span className="inline-block bg-fuchsia-700 text-white px-4 py-1 rounded-full font-semibold ml-2">{report.report_reason || 'No reason provided'}</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white mb-2">Additional Details</h3>
              <p className="text-[#b3b3c6]">{report.additional_detail || 'No additional details provided'}</p>
              <div className="mt-4">
                <h4 className="font-bold text-white mb-2">Service Description</h4>
                <p className="text-[#b3b3c6]">{report.service_listings?.description || 'No description available'}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:justify-between gap-4">
            <div className="flex gap-4">
              <button 
                className="bg-[#6366f1] hover:bg-[#4f46e5] px-6 py-2 rounded-lg text-white font-semibold shadow transition"
                onClick={() => router.push(`/dashboard/users/${report.service_listings?.users?.id}`)}
                disabled={!report.service_listings?.users?.id}
              >
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