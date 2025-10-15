"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import {
  Ticket,
  User,
  FileText,
  Calendar,
  Shield,
  DollarSign,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
  refund_approved?: boolean; // true = refund approved, false = refund denied, undefined = pending
  refund_processed?: boolean;
  refund_decision?: "approved" | "denied";
  token_amount?: number;
  requester_new_balance?: number;
  provider_new_balance?: number;
}

export default function TicketDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [refundStatus, setRefundStatus] = useState<string>("pending");

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
        // Set initial refund status based on ticket data
        if (json.data.refund_approved === true) {
          setRefundStatus("approved");
        } else if (json.data.refund_approved === false) {
          setRefundStatus("denied");
        } else {
          setRefundStatus("pending");
        }
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
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
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
      date: date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
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
          <div className="text-[#e0e0e0] text-lg mb-4">
            Issue ticket not found
          </div>
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
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  Issue Ticket #{ticket.id}
                </h1>
                <p className="text-[#e0e0e0] text-sm sm:text-base mt-1">
                  Ticket ID: {ticket.ticket_id}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="text-sm text-[#9ca3af]">Status</div>
              <select
                value={status}
                onChange={(e) => {
                  const newStatus = e.target.value;
                  setStatus(newStatus);
                  if (!id || Array.isArray(id)) return;

                  // When resolving, send refund decision along with status update
                  const requestBody: {
                    status: string;
                    refund_approved?: boolean;
                  } = {
                    status: newStatus,
                  };

                  // If resolving, include refund decision (approved or denied)
                  if (newStatus === "resolved") {
                    if (refundStatus === "approved") {
                      requestBody.refund_approved = true;
                    } else if (refundStatus === "denied") {
                      requestBody.refund_approved = false;
                    }
                  }

                  fetch(`/api/tickets/${id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(requestBody),
                  })
                    .then((res) => res.json())
                    .then((json) => {
                      if (json.status === "success" && ticket) {
                        // Update ticket with all response data
                        setTicket({
                          ...ticket,
                          status: newStatus,
                          ...(json.data?.refund_processed && {
                            refund_processed: json.data.refund_processed,
                            refund_decision: json.data.refund_decision,
                            token_amount: json.data.token_amount,
                            requester_new_balance:
                              json.data.requester_new_balance,
                            provider_new_balance:
                              json.data.provider_new_balance,
                          }),
                        });

                        // Show appropriate message based on refund decision
                        if (json.data?.refund_processed) {
                          const decision = json.data.refund_decision;
                          const amount = json.data.token_amount;
                          if (decision === "approved") {
                            alert(
                              `Ticket resolved! Refund approved: ${amount} tokens returned to requester.`
                            );
                          } else if (decision === "denied") {
                            alert(
                              `Ticket resolved! Refund denied: ${amount} tokens released to provider.`
                            );
                          }
                        }
                      }
                    })
                    .catch((error) =>
                      console.error("Failed to update ticket status:", error)
                    );
                }}
                className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all cursor-pointer border-2 ${
                  status === "resolved"
                    ? "bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30 border-green-400"
                    : "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/30 border-orange-400"
                }`}
              >
                <option value="ongoing" className="bg-[#1f1f33] text-white">
                  Ongoing
                </option>
                <option value="resolved" className="bg-[#1f1f33] text-white">
                  Resolved
                </option>
              </select>
            </div>
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
              <h2 className="text-lg font-semibold text-white">
                Reporter (Requester)
              </h2>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-[#9ca3af] text-sm mb-1">Name</p>
                <p className="text-[#e0e0e0] font-medium">
                  {ticket.reporter_name || "Unknown"}
                </p>
              </div>
              <div>
                <p className="text-[#9ca3af] text-sm mb-1">Reporter ID</p>
                <p className="text-[#e0e0e0] font-mono text-sm">
                  {ticket.reporter_id}
                </p>
              </div>
              <div>
                <p className="text-[#9ca3af] text-sm mb-1">Role</p>
                <p className="text-[#e0e0e0]">
                  Person who requested the service
                </p>
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
                <p className="text-[#e0e0e0] font-medium">
                  {ticket.provider_name || "Unknown"}
                </p>
              </div>
              <div>
                <p className="text-[#9ca3af] text-sm mb-1">Provider ID</p>
                <p className="text-[#e0e0e0] font-mono text-sm">
                  {ticket.provider_id}
                </p>
              </div>
              <div>
                <p className="text-[#9ca3af] text-sm mb-1">Role</p>
                <p className="text-[#e0e0e0]">
                  Person who provided the service
                </p>
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
              <h2 className="text-lg font-semibold text-white">
                Service Request
              </h2>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-[#9ca3af] text-sm mb-1">Request ID</p>
                <p className="text-[#e0e0e0] font-medium">
                  #{ticket.request_id}
                </p>
              </div>
              <div>
                <p className="text-[#9ca3af] text-sm mb-1">Listing ID</p>
                <p className="text-[#e0e0e0] font-medium">
                  #{ticket.listing_id}
                </p>
              </div>
              <div>
                <p className="text-[#9ca3af] text-sm mb-1">Service Title</p>
                <p className="text-[#e0e0e0] font-medium">
                  {ticket.listing_title || "Unknown"}
                </p>
              </div>
              <button
                className="mt-2 bg-[#6366f1] hover:bg-[#4f46e5] px-4 py-2 rounded-lg text-white text-sm font-medium shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                onClick={() => {
                  if (ticket.listing_id) {
                    router.push(`/dashboard/services/${ticket.listing_id}`);
                  }
                }}
                disabled={!ticket.listing_id}
              >
                View Service
              </button>
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
                <span
                  className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${
                    status === "resolved"
                      ? "bg-green-500/20 border border-green-500/50 text-green-300"
                      : "bg-orange-500/20 border border-orange-500/50 text-orange-300"
                  }`}
                >
                  {status === "resolved" ? "Resolved" : "Ongoing"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Refund Status Section */}
        <div className="bg-[#1f1f33] rounded-2xl p-6 border border-[#29294d] hover:border-[#383862] transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Refund Status</h2>
          </div>

          {/* Show resolution result if ticket is resolved */}
          {ticket.refund_processed && status === "resolved" && (
            <div
              className={`mb-6 rounded-lg p-4 border-2 ${
                ticket.refund_decision === "approved"
                  ? "bg-green-500/10 border-green-500/50"
                  : "bg-red-500/10 border-red-500/50"
              }`}
            >
              <div className="flex items-start gap-3">
                {ticket.refund_decision === "approved" ? (
                  <Check className="w-6 h-6 text-green-400 mt-0.5" />
                ) : (
                  <X className="w-6 h-6 text-red-400 mt-0.5" />
                )}
                <div className="flex-1">
                  <h3
                    className={`font-semibold mb-2 ${
                      ticket.refund_decision === "approved"
                        ? "text-green-300"
                        : "text-red-300"
                    }`}
                  >
                    {ticket.refund_decision === "approved"
                      ? "✓ Refund Approved & Processed"
                      : "✗ Refund Denied"}
                  </h3>
                  <p className="text-[#e0e0e0] text-sm mb-3">
                    {ticket.refund_decision === "approved"
                      ? `${ticket.token_amount} tokens have been refunded to the reporter (requester).`
                      : `${ticket.token_amount} tokens have been released to the service provider.`}
                  </p>
                  {ticket.refund_decision === "approved" &&
                    ticket.requester_new_balance !== undefined && (
                      <p className="text-[#9ca3af] text-sm">
                        Requester&apos;s new balance:{" "}
                        <span className="text-green-400 font-semibold">
                          {ticket.requester_new_balance} tokens
                        </span>
                      </p>
                    )}
                  {ticket.refund_decision === "denied" &&
                    ticket.provider_new_balance !== undefined && (
                      <p className="text-[#9ca3af] text-sm">
                        Provider&apos;s new balance:{" "}
                        <span className="text-emerald-400 font-semibold">
                          {ticket.provider_new_balance} tokens
                        </span>
                      </p>
                    )}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <p className="text-[#9ca3af] text-sm mb-3">
                Token Refund Decision
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="w-full sm:w-auto">
                  <select
                    value={refundStatus}
                    onChange={(e) => {
                      const newRefundStatus = e.target.value;
                      setRefundStatus(newRefundStatus);
                      console.log("Refund status changed to:", newRefundStatus);
                      console.log(
                        "Note: Refund will be processed when ticket is marked as resolved"
                      );
                    }}
                    disabled={status === "resolved"}
                    className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all cursor-pointer border-2 min-w-[200px] ${
                      status === "resolved"
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    } ${
                      refundStatus === "approved"
                        ? "bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30 border-green-400"
                        : refundStatus === "denied"
                        ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30 border-red-400"
                        : "bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg shadow-yellow-500/30 border-yellow-400"
                    }`}
                  >
                    <option value="pending" className="bg-[#1f1f33] text-white">
                      Pending Review
                    </option>
                    <option
                      value="approved"
                      className="bg-[#1f1f33] text-white"
                    >
                      Approve Refund
                    </option>
                    <option value="denied" className="bg-[#1f1f33] text-white">
                      Deny Refund
                    </option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  {refundStatus === "approved" ? (
                    <>
                      <Check className="w-5 h-5 text-green-400" />
                      <p className="text-[#9ca3af] text-sm">
                        Refund will be processed and tokens returned to reporter
                      </p>
                    </>
                  ) : refundStatus === "denied" ? (
                    <>
                      <X className="w-5 h-5 text-red-400" />
                      <p className="text-[#9ca3af] text-sm">
                        Refund request has been denied
                      </p>
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5 text-yellow-400" />
                      <p className="text-[#9ca3af] text-sm">
                        Awaiting moderator decision
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-[#252540] rounded-lg p-4 border border-[#29294d]">
              <p className="text-[#b3b3c6] text-sm leading-relaxed">
                <span className="font-semibold text-[#e0e0e0]">Note:</span> Use
                the dropdown above to approve or deny the refund request. The
                refund will be automatically processed when you mark the ticket
                as &quot;Resolved&quot; (if refund is approved). Tokens will be
                returned to the reporter&apos;s account and a transaction record
                will be created.
              </p>
            </div>
          </div>
        </div>

        {/* Return Button */}
        <div className="flex justify-center sm:justify-end">
          <Button
            onClick={() => router.push("/dashboard/tickets")}
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
            Back to Issues
          </Button>
        </div>
      </div>
    </div>
  );
}
