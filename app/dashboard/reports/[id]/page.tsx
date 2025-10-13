'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AlertTriangle, User, FileText, Calendar, Shield, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";

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
    return (
      <div className="min-h-screen bg-[#23233a] p-8 flex items-center justify-center">
        <div className="text-[#e0e0e0] text-lg">Loading report...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#23233a] p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#1f1f33] border border-red-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <h2 className="text-xl font-semibold text-red-400">Error</h2>
            </div>
            <p className="text-[#e0e0e0] mb-6">{error}</p>
            <Button
              onClick={() => router.back()}
              size="lg"
              className="w-full sm:w-auto"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-[#23233a] p-8 flex items-center justify-center">
        <div className="text-[#e0e0e0] text-lg">Report not found.</div>
      </div>
    );
  }

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      date: date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const submittedDate = formatDateTime(report.datetime);

  return (
    <div className="min-h-screen bg-[#23233a] p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Card with Gradient */}
        <div className="relative bg-gradient-to-br from-[#1f1f33] to-[#252540] rounded-2xl p-6 sm:p-8 border border-[#29294d] overflow-hidden">
          {/* Gradient Glow Effect */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-red-500/20 to-purple-500/20 flex items-center justify-center border border-red-500/30">
                <AlertTriangle className="w-7 h-7 sm:w-8 sm:h-8 text-red-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Report #{report.id}</h1>
                <p className="text-[#e0e0e0] text-sm sm:text-base mt-1">
                  Submitted {submittedDate.date} at {submittedDate.time}
                </p>
              </div>
            </div>
            <button
              className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                report.status === "Resolved" 
                  ? "bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30" 
                  : "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30"
              }`}
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
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Reporter Information */}
          <div className="bg-[#1f1f33] rounded-2xl p-6 border border-[#29294d] hover:border-[#383862] transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                <User className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Reporter Information</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[#9ca3af] text-sm mb-1">Name</p>
                <p className="text-[#e0e0e0] font-medium">{report.users?.full_name || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-[#9ca3af] text-sm mb-1">User ID</p>
                <p className="text-[#e0e0e0] font-mono text-sm">{report.reporter_id}</p>
              </div>
              <div>
                <p className="text-[#9ca3af] text-sm mb-1">Email</p>
                <p className="text-[#e0e0e0]">{report.users?.email || 'N/A'}</p>
              </div>
              <div className="pt-2">
                <button 
                  className="bg-[#6366f1] hover:bg-[#4f46e5] px-4 py-2 rounded-lg text-white font-medium shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm"
                  onClick={() => router.push(`/dashboard/users/${report.users?.id}`)}
                  disabled={!report.users?.id}
                >
                  View Profile
                </button>
              </div>
            </div>
          </div>

          {/* Report Reason */}
          <div className="bg-[#1f1f33] rounded-2xl p-6 border border-[#29294d] hover:border-[#383862] transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-fuchsia-500/20 to-pink-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-fuchsia-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Report Reason</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block bg-fuchsia-600/30 border border-fuchsia-500/50 text-fuchsia-300 px-4 py-2 rounded-lg font-medium">
                {report.report_reason || 'No reason provided'}
              </span>
            </div>
          </div>

          {/* Reported Service */}
          <div className="bg-[#1f1f33] rounded-2xl p-6 border border-[#29294d] hover:border-[#383862] transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-violet-500/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Reported Service</h2>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-[#9ca3af] text-sm mb-1">Service Title</p>
                <p className="text-[#e0e0e0] font-medium">{report.service_listings?.title || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-[#9ca3af] text-sm mb-1">Listed By</p>
                <p className="text-[#e0e0e0]">{report.service_listings?.users?.full_name || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-[#9ca3af] text-sm mb-1">Service ID</p>
                <p className="text-[#e0e0e0] font-mono text-sm">{report.listing_id}</p>
              </div>
            </div>
          </div>

          {/* Report Timeline */}
          <div className="bg-[#1f1f33] rounded-2xl p-6 border border-[#29294d] hover:border-[#383862] transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-orange-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Timeline</h2>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-[#9ca3af] text-sm mb-1">Report Date</p>
                <p className="text-[#e0e0e0]">{submittedDate.date}</p>
              </div>
              <div>
                <p className="text-[#9ca3af] text-sm mb-1">Report Time</p>
                <p className="text-[#e0e0e0]">{submittedDate.time}</p>
              </div>
              <div>
                <p className="text-[#9ca3af] text-sm mb-1">Current Status</p>
                <span className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${
                  report.status === "Resolved" 
                    ? "bg-green-500/20 border border-green-500/50 text-green-300" 
                    : "bg-red-500/20 border border-red-500/50 text-red-300"
                }`}>
                  {report.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Service Description Section */}
        <div className="bg-[#1f1f33] rounded-2xl p-6 border border-[#29294d] hover:border-[#383862] transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-blue-500/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-indigo-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Service Description</h2>
          </div>
          <div className="bg-[#252540] rounded-lg p-4 border border-[#29294d]">
            <p className="text-[#e0e0e0] leading-relaxed">
              {report.service_listings?.description || 'No description available'}
            </p>
          </div>
        </div>

        {/* Actions Section */}
        <div className="bg-[#1f1f33] rounded-2xl p-6 border border-[#29294d]">
          <h3 className="text-lg font-semibold text-white mb-4">Moderator Actions</h3>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3">
            <button
              className={`px-6 py-3 rounded-lg font-medium shadow-lg transition-all hover:scale-105 ${
                serviceStopped
                  ? "bg-yellow-500 hover:bg-yellow-600 text-black shadow-yellow-500/30"
                  : "bg-red-500 hover:bg-red-600 text-white shadow-red-500/30"
              }`}
              onClick={() => setServiceStopped(!serviceStopped)}
            >
              {serviceStopped ? "Undo Suspend Service" : "Suspend Service"}
            </button>
          </div>
        </div>

        {/* Back Button */}
        <div className="flex justify-center sm:justify-end">
          <Button
            onClick={() => router.push('/dashboard/reports')}
            size="lg"
            className="w-full sm:w-auto"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Reports
          </Button>
          {serviceStopped && (
            <div className="mt-4 bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <p className="text-green-400 font-medium flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Service has been suspended for this user.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}