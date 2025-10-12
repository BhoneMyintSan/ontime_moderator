"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Ticket, User, FileText, Calendar, Shield, MessageSquare } from "lucide-react";

interface TicketDetail {
  id: number;
  ticket_id: string;
  reporter_id: string;
  reporter_name: string;
  request_id: number;
  listing_id: number;
  listing_title: string;
  provider_id: string;
  provider_name: string;
  created_at: string;
  status: string;
}

export default function TicketDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");

  const fetchTicket = useCallback(async () => {
    // Ensure id is a string and exists
    if (!id || Array.isArray(id)) {
      setError("Invalid ticket ID");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/tickets/${id}`);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const json = await res.json();

      if (json.status === "success") {
        setTicket(json.data);
        setStatus(json.data.status || "ongoing");
      } else {
        setError(json.message || "Failed to load ticket");
      }
    } catch (error) {
      console.error("Failed to load ticket:", error);
      setError("Failed to load ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    fetchTicket();
  }, [id, fetchTicket]);

  const toggleStatus = async () => {
    if (!id || Array.isArray(id)) return;
    const newStatus = status === "resolved" ? "ongoing" : "resolved";
    try {
      const res = await fetch(`/api/tickets/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const json = await res.json();
      if (json.status === "success") {
        setStatus(newStatus);
        if (ticket) {
          setTicket({ ...ticket, status: newStatus });
        }
      }
    } catch (error) {
      console.error("Failed to update ticket status:", error);
    }
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      date: date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  // Note: status update is disabled for this view since the detail endpoint
  // does not return status values. Enable if API adds status fields.

  if (loading) {
    return (
      <div className="min-h-screen bg-[#23233a] p-8 flex items-center justify-center">
        <div className="text-[#e0e0e0] text-lg">Loading issue ticket...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#23233a] p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#1f1f33] border border-red-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-red-400" />
              <h2 className="text-xl font-semibold text-red-400">Error</h2>
            </div>
            <p className="text-[#e0e0e0] mb-6">{error}</p>
            <div className="flex gap-3">
              <button
                className="bg-[#6366f1] hover:bg-[#4f46e5] px-6 py-2.5 rounded-lg text-white font-medium transition-all"
                onClick={fetchTicket}
              >
                Retry
              </button>
              <button
                className="bg-[#252540] hover:bg-[#2a2a55] px-6 py-2.5 rounded-lg text-white font-medium transition-all border border-[#29294d]"
                onClick={() => router.back()}
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-[#23233a] p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-[#e0e0e0] text-lg mb-4">Issue ticket not found</div>
          <button
            className="bg-[#252540] hover:bg-[#2a2a55] px-6 py-2.5 rounded-lg text-white font-medium transition-all border border-[#29294d]"
            onClick={() => router.back()}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const createdDate = formatDateTime(ticket.created_at);

  return (
    <div className="min-h-screen bg-[#23233a] p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Card with Gradient */}
        <div className="relative bg-gradient-to-br from-[#1f1f33] to-[#252540] rounded-2xl p-6 sm:p-8 border border-[#29294d] overflow-hidden">
          {/* Gradient Glow Effect */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-blue-500/30">
                <Ticket className="w-7 h-7 sm:w-8 sm:h-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Issue Ticket #{ticket.id}</h1>
                <p className="text-[#e0e0e0] text-sm sm:text-base mt-1">
                  Ticket ID: {ticket.ticket_id}
                </p>
              </div>
            </div>
            <button
              className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                status === "resolved" 
                  ? "bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30" 
                  : "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/30"
              }`}
              onClick={toggleStatus}
            >
              {status === "resolved" ? "Resolved" : "Ongoing"}
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
              <h2 className="text-lg font-semibold text-white">Reporter (Requester)</h2>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-[#9ca3af] text-sm mb-1">Name</p>
                <p className="text-[#e0e0e0] font-medium">{ticket.reporter_name || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-[#9ca3af] text-sm mb-1">Reporter ID</p>
                <p className="text-[#e0e0e0] font-mono text-sm">{ticket.reporter_id}</p>
              </div>
              <div>
                <p className="text-[#9ca3af] text-sm mb-1">Role</p>
                <p className="text-[#e0e0e0]">Person who requested the service</p>
              </div>
              <button
                className="mt-2 bg-[#6366f1] hover:bg-[#4f46e5] px-4 py-2 rounded-lg text-white text-sm font-medium shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                onClick={() => {
                  if (ticket.reporter_id) {
                    router.push(`/dashboard/users/${ticket.reporter_id}`);
                  }
                }}
                disabled={!ticket.reporter_id}
              >
                View Profile
              </button>
            </div>
          </div>

          {/* Provider Information */}
          <div className="bg-[#1f1f33] rounded-2xl p-6 border border-[#29294d] hover:border-[#383862] transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                <User className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Provider</h2>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-[#9ca3af] text-sm mb-1">Name</p>
                <p className="text-[#e0e0e0] font-medium">{ticket.provider_name || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-[#9ca3af] text-sm mb-1">Provider ID</p>
                <p className="text-[#e0e0e0] font-mono text-sm">{ticket.provider_id}</p>
              </div>
              <div>
                <p className="text-[#9ca3af] text-sm mb-1">Role</p>
                <p className="text-[#e0e0e0]">Person who provided the service</p>
              </div>
              <button
                className="mt-2 bg-[#6366f1] hover:bg-[#4f46e5] px-4 py-2 rounded-lg text-white text-sm font-medium shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                onClick={() => {
                  if (ticket.provider_id) {
                    router.push(`/dashboard/users/${ticket.provider_id}`);
                  }
                }}
                disabled={!ticket.provider_id}
              >
                View Profile
              </button>
            </div>
          </div>

          {/* Service Request Information */}
          <div className="bg-[#1f1f33] rounded-2xl p-6 border border-[#29294d] hover:border-[#383862] transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-blue-500/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-indigo-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Service Request</h2>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-[#9ca3af] text-sm mb-1">Request ID</p>
                <p className="text-[#e0e0e0] font-medium">#{ticket.request_id}</p>
              </div>
              <div>
                <p className="text-[#9ca3af] text-sm mb-1">Listing ID</p>
                <p className="text-[#e0e0e0] font-medium">#{ticket.listing_id}</p>
              </div>
              <div>
                <p className="text-[#9ca3af] text-sm mb-1">Service Title</p>
                <p className="text-[#e0e0e0] font-medium">{ticket.listing_title || 'Unknown'}</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-[#1f1f33] rounded-2xl p-6 border border-[#29294d] hover:border-[#383862] transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-orange-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Timeline</h2>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-[#9ca3af] text-sm mb-1">Created Date</p>
                <p className="text-[#e0e0e0]">{createdDate.date}</p>
              </div>
              <div>
                <p className="text-[#9ca3af] text-sm mb-1">Created Time</p>
                <p className="text-[#e0e0e0]">{createdDate.time}</p>
              </div>
              <div>
                <p className="text-[#9ca3af] text-sm mb-1">Current Status</p>
                <span className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${
                  status === "resolved" 
                    ? "bg-green-500/20 border border-green-500/50 text-green-300" 
                    : "bg-orange-500/20 border border-orange-500/50 text-orange-300"
                }`}>
                  {status === "resolved" ? "Resolved" : "Ongoing"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Moderator Notes Section */}
        <div className="bg-[#1f1f33] rounded-2xl p-6 border border-[#29294d]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500/20 to-emerald-500/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-teal-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Moderator Notes</h2>
          </div>
          <textarea
            className="w-full h-32 bg-[#252540] border border-[#29294d] rounded-lg p-4 text-[#e0e0e0] placeholder-[#9ca3af] focus:outline-none focus:border-[#6366f1] resize-none transition-colors"
            placeholder="Add notes about this issue ticket..."
          ></textarea>
          <div className="flex justify-end mt-4">
            <button className="bg-[#6366f1] hover:bg-[#4f46e5] px-6 py-2.5 rounded-lg text-white font-medium shadow-lg shadow-indigo-500/30 transition-all hover:scale-105">
              Save Notes
            </button>
          </div>
        </div>

        {/* Actions Section */}
        <div className="bg-[#1f1f33] rounded-2xl p-6 border border-[#29294d]">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3">
            <button 
              className="bg-[#6366f1] hover:bg-[#4f46e5] px-6 py-3 rounded-lg text-white font-medium shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
              onClick={() => {
                if (ticket.reporter_id) {
                  router.push(`/dashboard/users/${ticket.reporter_id}`);
                }
              }}
              disabled={!ticket.reporter_id}
            >
              <User className="w-4 h-4" />
              View Reporter Profile
            </button>
            <button 
              className="bg-[#6366f1] hover:bg-[#4f46e5] px-6 py-3 rounded-lg text-white font-medium shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
              onClick={() => {
                if (ticket.provider_id) {
                  router.push(`/dashboard/users/${ticket.provider_id}`);
                }
              }}
              disabled={!ticket.provider_id}
            >
              <User className="w-4 h-4" />
              View Provider Profile
            </button>
            <button
              className="bg-[#252540] hover:bg-[#2a2a55] px-6 py-3 rounded-lg text-white font-medium transition-all hover:scale-105 border border-[#29294d]"
              onClick={() => router.push("/dashboard/tickets")}
            >
              Back to Issues
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
