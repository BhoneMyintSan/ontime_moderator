"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  AlertTriangle, 
  Ticket, 
  DollarSign, 
  Gift,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  totalReports: number;
  totalTickets: number;
  totalRefunds: number;
  activeUsers: number;
  pendingReports: number;
  resolvedTickets: number;
  pendingRefunds: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalReports: 0,
    totalTickets: 0,
    totalRefunds: 0,
    activeUsers: 0,
    pendingReports: 0,
    resolvedTickets: 0,
    pendingRefunds: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, reportsRes, ticketsRes, refundsRes] = await Promise.all([
          fetch('/api/users').then(r => r.ok ? r.json() : { data: [] }),
          fetch('/api/reports').then(r => r.ok ? r.json() : { data: [] }),
          fetch('/api/tickets').then(r => r.ok ? r.json() : { data: [] }),
          fetch('/api/refunds').then(r => r.ok ? r.json() : { data: [] }),
        ]);

        const users = usersRes.data || [];
        const reports = reportsRes.data || [];
        const tickets = ticketsRes.data || [];
        const refunds = refundsRes.data || [];

        setStats({
          totalUsers: users.length,
          totalReports: reports.length,
          totalTickets: tickets.length,
          totalRefunds: refunds.length,
          activeUsers: users.filter((u: any) => u.account_status === 'Active').length,
          pendingReports: reports.filter((r: any) => r.status === 'Pending').length,
          resolvedTickets: tickets.filter((t: any) => t.status === 'Resolved').length,
          pendingRefunds: refunds.filter((rf: any) => rf.status === 'Pending').length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#23233a] p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#6366f1] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#e0e0e0] mt-4">Loading dashboard...</p>
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
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-500/20 to-blue-500/20 rounded-full blur-3xl -z-10"></div>

          <div className="flex items-start justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
                <LayoutDashboard className="w-7 h-7 sm:w-8 sm:h-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">Dashboard Overview</h1>
                <p className="text-[#e0e0e0] text-sm sm:text-base">Monitor and manage your moderation platform</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Users */}
          <button
            onClick={() => router.push('/dashboard/users')}
            className="bg-gradient-to-br from-[#1f1f33] to-[#252540] rounded-2xl p-6 border border-[#29294d] hover:scale-[1.02] hover:border-purple-500/50 transition-all duration-300 shadow-xl hover:shadow-purple-500/20 text-left"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#9ca3af] text-sm font-medium uppercase tracking-wide">Total Users</span>
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <div className="text-4xl font-bold text-white mb-2">{stats.totalUsers}</div>
            <div className="flex items-center gap-2 text-xs">
              <Activity className="w-3 h-3 text-green-400" />
              <span className="text-green-400 font-medium">{stats.activeUsers} Active</span>
            </div>
          </button>

          {/* Total Reports */}
          <button
            onClick={() => router.push('/dashboard/reports')}
            className="bg-gradient-to-br from-[#1f1f33] to-[#252540] rounded-2xl p-6 border border-[#29294d] hover:scale-[1.02] hover:border-red-500/50 transition-all duration-300 shadow-xl hover:shadow-red-500/20 text-left"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#9ca3af] text-sm font-medium uppercase tracking-wide">Total Reports</span>
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
            </div>
            <div className="text-4xl font-bold text-white mb-2">{stats.totalReports}</div>
            <div className="flex items-center gap-2 text-xs">
              <Clock className="w-3 h-3 text-amber-400" />
              <span className="text-amber-400 font-medium">{stats.pendingReports} Pending</span>
            </div>
          </button>

          {/* Total Tickets */}
          <button
            onClick={() => router.push('/dashboard/tickets')}
            className="bg-gradient-to-br from-[#1f1f33] to-[#252540] rounded-2xl p-6 border border-[#29294d] hover:scale-[1.02] hover:border-blue-500/50 transition-all duration-300 shadow-xl hover:shadow-blue-500/20 text-left"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#9ca3af] text-sm font-medium uppercase tracking-wide">Issues Tickets</span>
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Ticket className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <div className="text-4xl font-bold text-white mb-2">{stats.totalTickets}</div>
            <div className="flex items-center gap-2 text-xs">
              <CheckCircle className="w-3 h-3 text-green-400" />
              <span className="text-green-400 font-medium">{stats.resolvedTickets} Resolved</span>
            </div>
          </button>

          {/* Total Refunds */}
          <button
            onClick={() => router.push('/dashboard/refund')}
            className="bg-gradient-to-br from-[#1f1f33] to-[#252540] rounded-2xl p-6 border border-[#29294d] hover:scale-[1.02] hover:border-emerald-500/50 transition-all duration-300 shadow-xl hover:shadow-emerald-500/20 text-left"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#9ca3af] text-sm font-medium uppercase tracking-wide">Total Refunds</span>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div className="text-4xl font-bold text-white mb-2">{stats.totalRefunds}</div>
            <div className="flex items-center gap-2 text-xs">
              <Clock className="w-3 h-3 text-amber-400" />
              <span className="text-amber-400 font-medium">{stats.pendingRefunds} Pending</span>
            </div>
          </button>
        </div>

        {/* Quick Actions Grid */}
        <div className="bg-gradient-to-br from-[#1f1f33] to-[#252540] rounded-2xl border border-[#29294d] p-6 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <Activity className="w-4 h-4 text-indigo-400" />
            </div>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/dashboard/users')}
              className="p-4 bg-[#1f1f33] rounded-xl border border-[#29294d] hover:bg-[#252540] hover:border-purple-500/50 transition-all duration-300 flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 flex items-center justify-center transition-colors">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-left">
                <p className="text-white font-medium">Manage Users</p>
                <p className="text-[#9ca3af] text-xs">View all users</p>
              </div>
            </button>

            <button
              onClick={() => router.push('/dashboard/reports')}
              className="p-4 bg-[#1f1f33] rounded-xl border border-[#29294d] hover:bg-[#252540] hover:border-red-500/50 transition-all duration-300 flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 flex items-center justify-center transition-colors">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div className="text-left">
                <p className="text-white font-medium">Review Reports</p>
                <p className="text-[#9ca3af] text-xs">Check pending reports</p>
              </div>
            </button>

            <button
              onClick={() => router.push('/dashboard/tickets')}
              className="p-4 bg-[#1f1f33] rounded-xl border border-[#29294d] hover:bg-[#252540] hover:border-blue-500/50 transition-all duration-300 flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 flex items-center justify-center transition-colors">
                <Ticket className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-left">
                <p className="text-white font-medium">Handle Tickets</p>
                <p className="text-[#9ca3af] text-xs">Resolve issues</p>
              </div>
            </button>

            <button
              onClick={() => router.push('/dashboard/refund')}
              className="p-4 bg-[#1f1f33] rounded-xl border border-[#29294d] hover:bg-[#252540] hover:border-emerald-500/50 transition-all duration-300 flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20 flex items-center justify-center transition-colors">
                <DollarSign className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-left">
                <p className="text-white font-medium">Process Refunds</p>
                <p className="text-[#9ca3af] text-xs">Handle requests</p>
              </div>
            </button>

            <button
              onClick={() => router.push('/dashboard/reward')}
              className="p-4 bg-[#1f1f33] rounded-xl border border-[#29294d] hover:bg-[#252540] hover:border-pink-500/50 transition-all duration-300 flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-lg bg-pink-500/10 group-hover:bg-pink-500/20 flex items-center justify-center transition-colors">
                <Gift className="w-5 h-5 text-pink-400" />
              </div>
              <div className="text-left">
                <p className="text-white font-medium">Manage Rewards</p>
                <p className="text-[#9ca3af] text-xs">Create rewards</p>
              </div>
            </button>

            <button
              onClick={() => router.push('/dashboard/settings')}
              className="p-4 bg-[#1f1f33] rounded-xl border border-[#29294d] hover:bg-[#252540] hover:border-indigo-500/50 transition-all duration-300 flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 group-hover:bg-indigo-500/20 flex items-center justify-center transition-colors">
                <Activity className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="text-left">
                <p className="text-white font-medium">Settings</p>
                <p className="text-[#9ca3af] text-xs">Configure account</p>
              </div>
            </button>
          </div>
        </div>

        {/* Activity Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-gradient-to-br from-[#1f1f33] to-[#252540] rounded-2xl border border-[#29294d] p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-blue-400" />
              </div>
              Platform Status
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-[#1f1f33] rounded-xl border border-[#29294d]">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-[#e0e0e0]">System Operational</span>
                </div>
                <span className="text-green-400 text-sm font-medium">Active</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#1f1f33] rounded-xl border border-[#29294d]">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-blue-400" />
                  <span className="text-[#e0e0e0]">API Status</span>
                </div>
                <span className="text-blue-400 text-sm font-medium">Healthy</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#1f1f33] rounded-xl border border-[#29294d]">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-amber-400" />
                  <span className="text-[#e0e0e0]">Pending Tasks</span>
                </div>
                <span className="text-amber-400 text-sm font-medium">{stats.pendingReports + stats.pendingRefunds}</span>
              </div>
            </div>
          </div>

          {/* System Info */}
          <div className="bg-gradient-to-br from-[#1f1f33] to-[#252540] rounded-2xl border border-[#29294d] p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-purple-400" />
              </div>
              Quick Stats
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-[#1f1f33] rounded-xl border border-[#29294d]">
                <span className="text-[#9ca3af] text-sm">Active Users</span>
                <span className="text-white font-bold">{stats.activeUsers}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#1f1f33] rounded-xl border border-[#29294d]">
                <span className="text-[#9ca3af] text-sm">Resolved Tickets</span>
                <span className="text-white font-bold">{stats.resolvedTickets}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#1f1f33] rounded-xl border border-[#29294d]">
                <span className="text-[#9ca3af] text-sm">Pending Reviews</span>
                <span className="text-white font-bold">{stats.pendingReports}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}