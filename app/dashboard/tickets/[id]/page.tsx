'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';

interface TicketData {
  id: string;
  service: string;
  serviceDetails?: {
    title: string;
    description: string;
    category: string;
    tokenReward: number;
    postedAt: string;
  } | null;
  by: string;
  byId: string;
  against: string;
  againstId: string;
  date: string;
  updatedDate: string;
  status: string;
  activity: string;
  tokenReward: number;
}

export default function TicketDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

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

  const updateTicketStatus = async (newStatus: string) => {
    if (!ticket || !id || Array.isArray(id)) return;
    
    try {
      setUpdating(true);
      const res = await fetch(`/api/tickets/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const json = await res.json();
      if (json.status === "success") {
        setTicket(json.data);
      } else {
        setError(json.message || "Failed to update ticket");
      }
    } catch (error) {
      console.error("Failed to update ticket status:", error);
      setError("Failed to update ticket status. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-white text-xl">Loading ticket...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Error: {error}</div>
          <div className="space-x-4">
            <button
              className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg text-white transition"
              onClick={fetchTicket}
            >
              Retry
            </button>
            <button
              className="bg-gray-500 hover:bg-gray-600 px-6 py-2 rounded-lg text-white transition"
              onClick={() => router.back()}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-white text-xl mb-4">Ticket not found</div>
          <button
            className="bg-gray-500 hover:bg-gray-600 px-6 py-2 rounded-lg text-white transition"
            onClick={() => router.back()}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a2e] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Ticket Details</h1>
            <p className="text-[#b3b3c6]">Ticket ID: #{ticket.id}</p>
          </div>
          <button
            className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 ${
              ticket.status === "Resolved" 
                ? "bg-green-500 hover:bg-green-600 text-white" 
                : "bg-red-500 hover:bg-red-600 text-white"
            } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => updateTicketStatus(ticket.status === "Resolved" ? "Unresolved" : "Resolved")}
            disabled={updating}
          >
            {updating ? "Updating..." : ticket.status}
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-[#23233a] rounded-2xl shadow-xl p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Ticket Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Ticket Information</h2>
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <label className="text-[#b3b3c6] text-sm mb-1">Date Created</label>
                    <span className="text-white font-medium">{ticket.date}</span>
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="text-[#b3b3c6] text-sm mb-1">Last Updated</label>
                    <span className="text-white font-medium">{ticket.updatedDate}</span>
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="text-[#b3b3c6] text-sm mb-1">Service ID</label>
                    <span className="text-white font-medium">#{ticket.service}</span>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[#b3b3c6] text-sm mb-1">Activity Type</label>
                    <span className="text-white font-medium capitalize">{ticket.activity}</span>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[#b3b3c6] text-sm mb-1">Token Reward</label>
                    <span className="text-white font-medium">{ticket.tokenReward} tokens</span>
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="text-[#b3b3c6] text-sm mb-1">Current Status</label>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold w-fit ${
                      ticket.status === "Resolved" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Service & Parties */}
            <div className="space-y-6">
              {/* Service Information */}
              {ticket.serviceDetails && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-4">Service Information</h2>
                  <div className="bg-[#2a2a45] rounded-lg p-4 space-y-3">
                    <div>
                      <label className="text-[#b3b3c6] text-sm">Title</label>
                      <div className="text-white font-medium">{ticket.serviceDetails.title}</div>
                    </div>
                    <div>
                      <label className="text-[#b3b3c6] text-sm">Category</label>
                      <div className="text-white font-medium">{ticket.serviceDetails.category}</div>
                    </div>
                    <div>
                      <label className="text-[#b3b3c6] text-sm">Description</label>
                      <div className="text-white text-sm">{ticket.serviceDetails.description}</div>
                    </div>
                    <div>
                      <label className="text-[#b3b3c6] text-sm">Posted On</label>
                      <div className="text-white text-sm">{ticket.serviceDetails.postedAt}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Parties Involved */}
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Parties Involved</h2>
                <div className="space-y-4">
                  <div className="bg-[#2a2a45] rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <label className="text-[#b3b3c6] text-sm">Requester</label>
                        <div className="text-white font-medium text-lg">{ticket.by}</div>
                        <div className="text-[#b3b3c6] text-sm mt-1">Person who requested the service</div>
                      </div>
                      <button
                        className="bg-[#6366f1] hover:bg-[#4f46e5] px-3 py-1 rounded text-white text-sm transition"
                        onClick={() => {
                          if (ticket.byId) {
                            router.push(`/dashboard/users/${ticket.byId}`);
                          }
                        }}
                        disabled={!ticket.byId}
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-[#2a2a45] rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <label className="text-[#b3b3c6] text-sm">Provider</label>
                        <div className="text-white font-medium text-lg">{ticket.against}</div>
                        <div className="text-[#b3b3c6] text-sm mt-1">Person who provided the service</div>
                      </div>
                      <button
                        className="bg-[#6366f1] hover:bg-[#4f46e5] px-3 py-1 rounded text-white text-sm transition"
                        onClick={() => {
                          if (ticket.againstId) {
                            router.push(`/dashboard/users/${ticket.againstId}`);
                          }
                        }}
                        disabled={!ticket.againstId}
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Section */}
          <div className="border-t border-[#2a2a45] mt-8 pt-8">
            <h2 className="text-xl font-bold text-white mb-4">Moderation Actions</h2>
            <div className="flex flex-wrap gap-4">
              <button className="bg-[#6366f1] hover:bg-[#4f46e5] px-6 py-3 rounded-lg text-white font-semibold transition-all duration-200 shadow-lg">
                Contact Requester
              </button>
              <button className="bg-[#6366f1] hover:bg-[#4f46e5] px-6 py-3 rounded-lg text-white font-semibold transition-all duration-200 shadow-lg">
                Contact Provider
              </button>
              <button className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg text-white font-semibold transition-all duration-200 shadow-lg">
                Escalate Issue
              </button>
              <button className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-lg text-white font-semibold transition-all duration-200 shadow-lg">
                Close Ticket
              </button>
            </div>
          </div>

          {/* Notes Section */}
          <div className="border-t border-[#2a2a45] mt-8 pt-8">
            <h2 className="text-xl font-bold text-white mb-4">Moderator Notes</h2>
            <textarea
              className="w-full h-32 bg-[#2a2a45] border border-[#404040] rounded-lg p-4 text-white placeholder-[#b3b3c6] focus:outline-none focus:border-[#6366f1] resize-none"
              placeholder="Add notes about this ticket..."
            ></textarea>
            <div className="flex justify-end mt-4">
              <button className="bg-[#6366f1] hover:bg-[#4f46e5] px-6 py-2 rounded-lg text-white font-semibold transition-all duration-200">
                Save Notes
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end mt-8 pt-6 border-t border-[#2a2a45]">
            <button
              className="bg-[#6366f1] hover:bg-[#4f46e5] px-8 py-3 rounded-lg text-white font-semibold transition-all duration-200 shadow-lg"
              onClick={() => router.push('/dashboard/tickets')}
            >
              Back to Tickets
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
