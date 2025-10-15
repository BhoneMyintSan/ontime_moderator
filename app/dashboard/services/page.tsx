"use client";
import { useState, useEffect } from "react";
import ServiceTable from "@/components/tables/ServiceTable";
import { ServiceListing } from "@/lib/types";
import { Wrench, AlertTriangle, CheckCircle, Clock, Users, Ticket } from "lucide-react";

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("/api/services");
        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }
        const data = await response.json();
        setServices(data.data);
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

    fetchServices();
  }, []);

  // Calculate stats with null checks and field name variations
  const totalServices = services.length;
  const activeServices = services.filter(s => s.status === "active").length;
  const suspendedServices = services.filter(s => s.status === "suspended").length;
  const servicesWithReports = services.filter(s => {
    const reportCount = s._count?.reports || s._count?.report || 0;
    return reportCount > 0;
  }).length;
  const servicesWithTickets = services.filter(s => {
    const ticketCount = (s._count as any)?.issue_ticket || 0;
    return ticketCount > 0;
  }).length;
  const totalWarnings = services.reduce((sum, s) => {
    const warningCount = s._count?.warnings || s._count?.warning || 0;
    return sum + (typeof warningCount === 'number' ? warningCount : 0);
  }, 0);
  const totalReports = services.reduce((sum, s) => {
    const reportCount = s._count?.reports || s._count?.report || 0;
    return sum + (typeof reportCount === 'number' ? reportCount : 0);
  }, 0);
  const totalTickets = services.reduce((sum, s) => {
    const ticketCount = (s._count as any)?.issue_ticket || 0;
    return sum + (typeof ticketCount === 'number' ? ticketCount : 0);
  }, 0);

  // Filter tabs configuration
  const filterTabs = [
    { label: "All Services", key: "all", count: totalServices },
    { label: "Active", key: "active", count: activeServices },
    { label: "Suspended", key: "suspended", count: suspendedServices },
    { label: "With Reports", key: "reports", count: servicesWithReports },
    { label: "With Tickets", key: "tickets", count: servicesWithTickets },
  ];

  // Filter services based on active tab
  const filteredServices = (() => {
    switch (activeTab) {
      case "all":
        return services;
      case "reports":
        return services.filter(service => {
          const reportCount = service._count?.reports || service._count?.report || 0;
          return reportCount > 0;
        });
      case "tickets":
        return services.filter(service => {
          const ticketCount = (service._count as any)?.issue_ticket || 0;
          return ticketCount > 0;
        });
      default:
        return services.filter(service => service.status === activeTab);
    }
  })();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#23233a] p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#6366f1] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#e0e0e0] mt-4">Loading services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#23233a] p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Services</h2>
          <p className="text-[#b3b3c6] mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#6366f1] hover:bg-[#4f46e5] text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#23233a] p-3 sm:p-4 lg:p-6">
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Header Card with Gradient */}
        <div className="relative bg-gradient-to-br from-[#1f1f33] to-[#252540] rounded-2xl p-4 sm:p-6 border border-[#29294d] overflow-hidden">
          {/* Gradient Glow Effect */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-blue-500/30">
                <Wrench className="w-7 h-7 sm:w-8 sm:h-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Service Management</h1>
                <p className="text-[#e0e0e0] text-sm sm:text-base mt-1">
                  Monitor and manage all service listings with warnings and moderation tools
                </p>
              </div>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          <div className="bg-gradient-to-br from-[#1f1f33] to-[#252540] rounded-2xl p-4 border border-[#29294d] hover:scale-[1.02] transition-all duration-300 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#9ca3af] text-xs font-medium uppercase tracking-wide">Total Services</span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Wrench className="w-4 h-4 text-blue-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white">{totalServices}</div>
            <p className="text-xs text-[#e0e0e0] mt-1">All service listings</p>
          </div>

          <div className="bg-gradient-to-br from-[#1f1f33] to-[#252540] rounded-2xl p-4 border border-[#29294d] hover:scale-[1.02] transition-all duration-300 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#9ca3af] text-xs font-medium uppercase tracking-wide">Active</span>
              <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-green-400">{activeServices}</div>
            <p className="text-xs text-[#e0e0e0] mt-1">
              {totalServices > 0 ? ((activeServices / totalServices) * 100).toFixed(1) : 0}% of total
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#1f1f33] to-[#252540] rounded-2xl p-4 border border-[#29294d] hover:scale-[1.02] transition-all duration-300 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#9ca3af] text-xs font-medium uppercase tracking-wide">Suspended</span>
              <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                <Clock className="w-4 h-4 text-red-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-red-400">{suspendedServices}</div>
            <p className="text-xs text-[#e0e0e0] mt-1">Requires attention</p>
          </div>

          <div className="bg-gradient-to-br from-[#1f1f33] to-[#252540] rounded-2xl p-4 border border-[#29294d] hover:scale-[1.02] transition-all duration-300 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#9ca3af] text-xs font-medium uppercase tracking-wide">Total Warnings</span>
              <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-yellow-400">{totalWarnings}</div>
            <p className="text-xs text-[#e0e0e0] mt-1">Across all services</p>
          </div>

          <div className="bg-gradient-to-br from-[#1f1f33] to-[#252540] rounded-2xl p-4 border border-[#29294d] hover:scale-[1.02] transition-all duration-300 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#9ca3af] text-xs font-medium uppercase tracking-wide">Total Reports</span>
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-purple-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-purple-400">{totalReports}</div>
            <p className="text-xs text-[#e0e0e0] mt-1">User reports filed</p>
          </div>

          <div className="bg-gradient-to-br from-[#1f1f33] to-[#252540] rounded-2xl p-4 border border-[#29294d] hover:scale-[1.02] transition-all duration-300 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#9ca3af] text-xs font-medium uppercase tracking-wide">Issue Tickets</span>
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Ticket className="w-4 h-4 text-orange-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-orange-400">{totalTickets}</div>
            <p className="text-xs text-[#e0e0e0] mt-1">Service issues</p>
          </div>
        </div>

        {/* Services Table */}
        <div className="bg-gradient-to-br from-[#1f1f33] to-[#252540] rounded-2xl border border-[#29294d] shadow-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-[#29294d]">
            <h2 className="text-2xl font-bold text-white">
              {activeTab === "all" 
                ? "All Services" 
                : activeTab === "reports"
                ? "Services with Reports"
                : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Services`}
            </h2>
            <p className="text-[#b3b3c6] text-sm mt-1">
              Showing {filteredServices.length} of {totalServices} services
            </p>
          </div>
          <div className="p-6">
            {filteredServices.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                  <Wrench className="w-12 h-12 text-blue-400" />
                </div>
                <p className="text-[#e0e0e0] text-xl font-semibold mb-2">
                  {activeTab === "all" 
                    ? "No services found" 
                    : activeTab === "reports"
                    ? "No services with reports"
                    : `No ${activeTab} services`}
                </p>
                <p className="text-[#9ca3af] text-sm">
                  {activeTab === "all" 
                    ? "Services will appear here when they are created"
                    : activeTab === "reports"
                    ? "No services have user reports filed against them"
                    : `No services with ${activeTab} status found`}
                </p>
              </div>
            ) : (
              <ServiceTable services={filteredServices} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
