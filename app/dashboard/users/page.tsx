"use client";
import { useState, useEffect } from "react";
import UserTable from "../../../components/tables/UserTable";
import { Users as UsersIcon } from "lucide-react";

interface UserStats {
  total: number;
}

export default function Users() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<UserStats>({
    total: 0,
  });

  // Simulate loading state based on UserTable's count update
  useEffect(() => {
    if (totalUsers > 0 || totalUsers === 0) {
      setLoading(false);
    }
  }, [totalUsers]);

  return (
    <div className="min-h-screen bg-[#23233a] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Card with Gradient */}
        <div className="relative bg-gradient-to-br from-[#1f1f33] to-[#252540] rounded-2xl p-6 sm:p-8 border border-[#29294d] overflow-hidden">
          {/* Gradient Glow Effect */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-blue-500/30">
              <UsersIcon className="w-7 h-7 sm:w-8 sm:h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">User Accounts</h1>
              <p className="text-[#e0e0e0] text-sm sm:text-base mt-1">
                Show user accounts across the platform
              </p>
            </div>
          </div>
        </div>

      {/* Stats Card */}
      <div className="max-w-md">
        {/* Total Users */}
        <div className="group bg-gradient-to-br from-[#1f1f33] to-[#252540] rounded-2xl border border-[#29294d] p-6 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#9ca3af] uppercase tracking-wide">Total Users</p>
              <p className="text-4xl font-bold text-white mt-2">{stats.total}</p>
              <p className="text-xs text-[#e0e0e0] mt-1">All registered accounts</p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <UsersIcon className="w-7 h-7 text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-[#1f1f33] rounded-2xl border border-[#29294d] shadow-lg overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block w-8 h-8 border-4 border-[#6366f1] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[#e0e0e0] mt-4">Loading users...</p>
          </div>
        ) : (
          <div className="p-6">
            <UserTable onCountChange={setTotalUsers} onStatsChange={setStats} />
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
