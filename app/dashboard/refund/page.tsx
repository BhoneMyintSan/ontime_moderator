"use client";
import { useState, useEffect } from "react";
import RefundTable from "../../../components/tables/RefundTable";
import { Refund } from "@/lib/types";
import { DollarSign, RefreshCw, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";

export default function RefundsPage() {
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRefunds = async () => {
      try {
        const response = await fetch("/api/refunds");
        if (!response.ok) {
          throw new Error("Failed to fetch refunds");
        }
        const data = await response.json();
        setRefunds(data.data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRefunds();
  }, []);

  // Calculate stats
  const totalRefunds = refunds.length;
  const approvedRefunds = refunds.filter(r => r.status === "Approved").length;
  const pendingRefunds = refunds.filter(r => r.status === "Pending").length;
  const rejectedRefunds = refunds.filter(r => r.status === "Rejected").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#23233a] p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#6366f1] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#e0e0e0] mt-4">Loading refunds...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#23233a] p-8 flex items-center justify-center">
        <div className="bg-gradient-to-br from-[#1f1f33] to-[#252540] rounded-2xl border border-red-500/50 p-8 max-w-md text-center shadow-lg shadow-red-500/20">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-red-500/10 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Error Loading Refunds</h2>
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#23233a] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="relative bg-gradient-to-br from-[#1f1f33] to-[#252540] rounded-2xl border border-[#29294d] p-6 sm:p-8 shadow-xl overflow-hidden">
          {/* Gradient Glow Effects */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-cyan-500/20 to-emerald-500/20 rounded-full blur-3xl -z-10"></div>

          <div className="flex items-start justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/30">
                <DollarSign className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">Refund Requests</h1>
                <p className="text-[#e0e0e0] text-sm sm:text-base">Manage and review all refund requests submitted by users</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-[#1f1f33] to-[#252540] rounded-2xl p-6 border border-[#29294d] hover:scale-[1.02] transition-all duration-300 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#9ca3af] text-sm font-medium uppercase tracking-wide">Total Refunds</span>
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <div className="text-4xl font-bold text-white">{totalRefunds}</div>
            <p className="text-xs text-[#e0e0e0] mt-1">All requests</p>
          </div>

          <div className="bg-gradient-to-br from-[#1f1f33] to-[#252540] rounded-2xl p-6 border border-[#29294d] hover:scale-[1.02] transition-all duration-300 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#9ca3af] text-sm font-medium uppercase tracking-wide">Approved</span>
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
            </div>
            <div className="text-4xl font-bold text-green-400">{approvedRefunds}</div>
            <p className="text-xs text-[#e0e0e0] mt-1">
              {totalRefunds > 0 ? ((approvedRefunds / totalRefunds) * 100).toFixed(1) : 0}% of total
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#1f1f33] to-[#252540] rounded-2xl p-6 border border-[#29294d] hover:scale-[1.02] transition-all duration-300 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#9ca3af] text-sm font-medium uppercase tracking-wide">Pending</span>
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div className="text-4xl font-bold text-amber-400">{pendingRefunds}</div>
            <p className="text-xs text-[#e0e0e0] mt-1">Awaiting review</p>
          </div>

          <div className="bg-gradient-to-br from-[#1f1f33] to-[#252540] rounded-2xl p-6 border border-[#29294d] hover:scale-[1.02] transition-all duration-300 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#9ca3af] text-sm font-medium uppercase tracking-wide">Rejected</span>
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-400" />
              </div>
            </div>
            <div className="text-4xl font-bold text-red-400">{rejectedRefunds}</div>
            <p className="text-xs text-[#e0e0e0] mt-1">
              {totalRefunds > 0 ? ((rejectedRefunds / totalRefunds) * 100).toFixed(1) : 0}% of total
            </p>
          </div>
        </div>

        {/* Refund Table */}
        <div className="bg-gradient-to-br from-[#1f1f33] to-[#252540] rounded-2xl border border-[#29294d] shadow-xl overflow-hidden">
          <div className="p-6">
            <RefundTable refunds={refunds} />
          </div>
        </div>
      </div>
    </div>
  );
}