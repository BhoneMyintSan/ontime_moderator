"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

interface TicketDetail {
  id: number;
  ticket_id: string;
  reporter_name: string;
  listing_id: number;
  listing_title: string;
  provider_id: string;
  provider_name: string;
}

export default function TicketDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating] = useState(false);

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

  // Note: status update is disabled for this view since the detail endpoint
  // does not return status values. Enable if API adds status fields.

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
    <div className="min-h-screen bg-[#1a1a2e] p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-snug">
              Ticket Details
            </h1>
            <p className="text-[#b3b3c6] text-sm sm:text-base mt-1">Ticket ID: {ticket.ticket_id}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-[#23233a] rounded-2xl shadow-xl p-5 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Ticket Information */}
            <div className="space-y-5">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-white mb-3">
                  Ticket Information
                </h2>
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <label className="text-[#b3b3c6] text-xs sm:text-sm mb-1 tracking-wide">
                      Listing ID
                    </label>
                    <span className="text-white font-medium text-base sm:text-lg">
                      #{ticket.listing_id}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[#b3b3c6] text-xs sm:text-sm mb-1 tracking-wide">
                      Listing Title
                    </label>
                    <span className="text-white font-medium text-base sm:text-lg break-words">
                      {ticket.listing_title}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Parties Involved */}
            <div className="space-y-5">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-white mb-3">
                  Parties Involved
                </h2>
                <div className="space-y-4">
                  <div className="bg-[#2a2a45] rounded-lg p-4 sm:p-5">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <label className="text-[#b3b3c6] text-xs sm:text-sm">Reporter</label>
                        <div className="text-white font-medium text-base sm:text-lg truncate">
                          {ticket.reporter_name}
                        </div>
                        <div className="text-[#b3b3c6] text-xs sm:text-sm mt-1">
                          Person who requested the service
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#2a2a45] rounded-lg p-4 sm:p-5">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <label className="text-[#b3b3c6] text-xs sm:text-sm">Provider</label>
                        <div className="text-white font-medium text-base sm:text-lg truncate">
                          {ticket.provider_name}
                        </div>
                        <div className="text-[#b3b3c6] text-xs sm:text-sm mt-1">
                          Person who provided the service
                        </div>
                      </div>
                      <button
                        className="bg-[#6366f1] hover:bg-[#4f46e5] px-3 py-1 rounded text-white text-xs sm:text-sm transition disabled:opacity-40 disabled:cursor-not-allowed"
                        onClick={() => {
                          if (ticket.provider_id) {
                            router.push(`/dashboard/users/${ticket.provider_id}`);
                          }
                        }}
                        disabled={!ticket.provider_id}
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions - collapsible on mobile */}
          <details className="mt-8 border-t border-[#2a2a45] pt-6 md:open" open>
            <summary className="md:hidden cursor-pointer text-white font-semibold text-sm mb-4 list-none flex items-center justify-between">
              <span>Actions</span>
              <span className="text-xs text-[#b3b3c6]">Tap to toggle</span>
            </summary>
            <div className="hidden md:block mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-white">Actions</h2>
            </div>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
              <button className="bg-[#6366f1] hover:bg-[#4f46e5] px-5 py-2 sm:px-6 sm:py-3 rounded-lg text-white text-sm sm:text-base font-medium transition shadow">
                Contact Reporter
              </button>
              <button className="bg-[#6366f1] hover:bg-[#4f46e5] px-5 py-2 sm:px-6 sm:py-3 rounded-lg text-white text-sm sm:text-base font-medium transition shadow">
                Contact Provider
              </button>
            </div>
          </details>

          {/* Notes - collapsible on mobile */}
            <details className="mt-8 border-t border-[#2a2a45] pt-6 md:open" open>
              <summary className="md:hidden cursor-pointer text-white font-semibold text-sm mb-4 list-none flex items-center justify-between">
                <span>Moderator Notes</span>
                <span className="text-xs text-[#b3b3c6]">Tap to toggle</span>
              </summary>
              <div className="hidden md:block mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-white">Moderator Notes</h2>
              </div>
              <textarea
                className="w-full h-32 bg-[#2a2a45] border border-[#404040] rounded-lg p-3 sm:p-4 text-white text-sm sm:text-base placeholder-[#b3b3c6] focus:outline-none focus:border-[#6366f1] resize-none"
                placeholder="Add notes about this ticket..."
              ></textarea>
              <div className="flex justify-end mt-4">
                <button className="bg-[#6366f1] hover:bg-[#4f46e5] px-5 py-2 rounded-lg text-white text-sm font-medium sm:text-base transition">
                  Save Notes
                </button>
              </div>
            </details>

          {/* Footer */}
          <div className="flex justify-end mt-8 pt-6 border-t border-[#2a2a45]">
            <button
              className="bg-[#6366f1] hover:bg-[#4f46e5] px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-white font-medium sm:font-semibold text-sm sm:text-base transition shadow"
              onClick={() => router.push("/dashboard/tickets")}
            >
              Back to Tickets
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
