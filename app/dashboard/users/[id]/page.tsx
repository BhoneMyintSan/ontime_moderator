"use client";
import { useParams, useRouter } from "next/navigation";
import { FiAlertTriangle } from "react-icons/fi";
import { useEffect, useState } from "react";

export default function UserProfile() {
  const router = useRouter();
  const { id } = useParams();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || Array.isArray(id)) return;
    
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${id}`);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const json = await res.json();
        if (json.status === "success") {
          setUserData(json.data);
        }
      } catch (error) {
        console.error("Failed to load user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  // Confirmation modal state
  const [showWarningConfirm, setShowWarningConfirm] = useState(false);
  const [showBanConfirm, setShowBanConfirm] = useState(false);

  // Make account status interactive
  const [accountStatus, setAccountStatus] = useState("Active");
  const statusOptions = ["Active", "Under Review", "Suspended", "Banned"];

  useEffect(() => {
    if (userData && userData.status) {
      setAccountStatus(userData.status);
    }
  }, [userData]);

  if (loading) {
    return (
      <div className="text-white text-center mt-20">
        Loading user profile...
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="text-white text-center mt-20">
        User not found.
        <button
          className="ml-4 underline"
          onClick={() => router.back()}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-6 sm:mt-10 bg-[#23233a] rounded-2xl p-5 sm:p-10 shadow transition-all duration-300 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6">
        <div className="flex items-center gap-5 w-full sm:w-auto">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#444] bg-[#18182c] flex items-center justify-center shadow-md">
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight break-words">{userData.full_name}</h1>
            <p className="text-[#b3b3c6] text-xs sm:text-sm mt-1">
              Member since {new Date(userData.joined_at).toLocaleDateString()}
            </p>
            <div className="mt-2 space-y-1 text-xs sm:text-sm">
              <div className="text-[#b3b3c6]">
                <span className="font-semibold text-white">Email:</span> <span className="break-all">{userData.email}</span>
              </div>
              <div className="text-[#b3b3c6]">
                <span className="font-semibold text-white">Phone:</span> {userData.phone || "-"}
              </div>
              <div className="text-[#b3b3c6]">
                <span className="font-semibold text-white">Status:</span> {userData.status}
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-3 w-full sm:w-auto justify-stretch sm:justify-end">
          <button
            className="flex-1 sm:flex-none bg-orange-400 hover:bg-orange-500 text-white font-semibold px-4 sm:px-6 py-2 rounded-lg shadow transition text-sm sm:text-base"
            onClick={() => setShowWarningConfirm(true)}
          >
            Warn
          </button>
          <button
            className="flex-1 sm:flex-none bg-red-500 hover:bg-red-600 text-white font-semibold px-4 sm:px-6 py-2 rounded-lg shadow transition text-sm sm:text-base"
            onClick={() => setShowBanConfirm(true)}
          >
            Ban
          </button>
        </div>
      </div>

      {/* Confirmation Modals */}
      {showWarningConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-all duration-200">
          <div className="bg-[#23233a] rounded-xl p-8 shadow-lg max-w-xs w-full text-center animate-fadeIn">
            <div className="text-white text-lg font-semibold mb-4">
              Confirm Warning
            </div>
            <div className="text-[#b3b3c6] mb-6">
              Are you sure you want to issue a warning to{" "}
              <span className="font-bold">{userData.full_name}</span>?
            </div>
            <div className="flex justify-center gap-3">
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition"
                onClick={() => setShowWarningConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition"
                onClick={() => {
                  setShowWarningConfirm(false);
                  // Add your warning logic here
                  alert("Warning issued!");
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {showBanConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-all duration-200">
          <div className="bg-[#23233a] rounded-xl p-8 shadow-lg max-w-xs w-full text-center animate-fadeIn">
            <div className="text-white text-lg font-semibold mb-4">Confirm Ban</div>
            <div className="text-[#b3b3c6] mb-6">
              Are you sure you want to{" "}
              <span className="font-bold text-red-400">ban</span>{" "}
              <span className="font-bold">{userData.full_name}</span>?
            </div>
            <div className="flex justify-center gap-3">
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition"
                onClick={() => setShowBanConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
                onClick={() => {
                  setShowBanConfirm(false);
                  // Add your ban logic here
                  alert("User banned!");
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#1f1f33] rounded-xl p-4 sm:p-5 shadow border border-[#29294d] flex flex-col items-center">
          <span className="text-[#b3b3c6] text-xs sm:text-sm mb-1">Reports Made</span>
          <span className="text-xl sm:text-2xl font-bold text-white">{userData.reports?.length || 0}</span>
        </div>
        <div className="bg-[#1f1f33] rounded-xl p-4 sm:p-5 shadow border border-[#29294d] flex flex-col items-center">
          <span className="text-[#b3b3c6] text-xs sm:text-sm mb-1">Warnings Issued</span>
          <span className="text-xl sm:text-2xl font-bold text-white">{userData.warnings || 0}</span>
        </div>
        <div className="bg-[#1f1f33] rounded-xl p-4 sm:p-5 shadow border border-[#29294d] flex flex-col items-center">
          <span className="text-[#b3b3c6] text-xs sm:text-sm mb-1">Account Status</span>
          <select
            className="text-lg sm:text-xl font-bold rounded bg-transparent text-orange-400 focus:outline-none"
            value={accountStatus}
            onChange={e => setAccountStatus(e.target.value)}
          >
            {statusOptions.map(status => (
              <option key={status} value={status} className="bg-[#1f1f33] text-white">
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Report History */}
      <details className="group" open>
        <summary className="cursor-pointer list-none flex items-center justify-between mb-3">
          <h2 className="text-lg sm:text-xl font-semibold text-white">Reports Made by User</h2>
          <span className="text-xs text-[#b3b3c6] sm:hidden">Tap</span>
        </summary>
        <div className="space-y-3">
          {userData.reports && userData.reports.length > 0 ? (
            userData.reports.map((report: any) => (
              <div
                key={report.id}
                className="bg-[#1f1f33] rounded-xl px-4 py-3 sm:px-5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between border border-[#29294d] shadow hover:bg-[#252540]"
              >
                <div className="text-xs sm:text-sm">
                  <div className="text-white font-medium sm:font-semibold text-sm sm:text-base">{report.report_reason || 'No reason provided'}</div>
                  <div className="text-[#b3b3c6] mt-1">Listing ID: {report.listing_id}</div>
                  <div className="text-[#b3b3c6]">Status: {report.status}</div>
                  {report.additional_detail && (
                    <div className="text-[#b3b3c6] mt-1 line-clamp-2">
                      Details: {report.additional_detail}
                    </div>
                  )}
                </div>
                <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 mt-2 sm:mt-0 text-[#b3b3c6] text-[10px] sm:text-xs">
                  <span>{new Date(report.datetime).toLocaleDateString()}</span>
                  <span className="opacity-70">#{report.id}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-[#1f1f33] rounded-xl px-5 py-4 border border-[#29294d] text-center text-[#b3b3c6] text-sm">
              No reports found
            </div>
          )}
        </div>
      </details>

      {/* Moderation Actions */}
      <details className="group" open>
        <summary className="cursor-pointer list-none flex items-center justify-between mb-3">
          <h2 className="text-lg sm:text-xl font-semibold text-white">Moderation Actions</h2>
          <span className="text-xs text-[#b3b3c6] sm:hidden">Tap</span>
        </summary>
        <div className="space-y-3">
          {userData.moderationLogs && userData.moderationLogs.length > 0 ? (
            userData.moderationLogs.map((action: any, idx: number) => (
              <div
                key={idx}
                className="bg-[#1f1f33] rounded-xl px-4 py-3 sm:px-5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between border border-[#29294d] shadow hover:bg-[#252540]"
              >
                <div className="flex items-center gap-2">
                  <FiAlertTriangle className="text-orange-400 text-lg sm:text-xl" />
                  <div className="text-xs sm:text-sm">
                    <div className="text-white font-medium sm:font-semibold text-sm">{action.action}</div>
                    <div className="text-[#b3b3c6]">By {action.performed_by}</div>
                  </div>
                </div>
                <div className="text-[#b3b3c6] text-[10px] sm:text-sm mt-2 sm:mt-0">
                  {new Date(action.created_at).toLocaleDateString()}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-[#1f1f33] rounded-xl px-5 py-4 border border-[#29294d] text-center text-[#b3b3c6] text-sm">
              No moderation actions found
            </div>
          )}
        </div>
      </details>

      {/* Done Button */}
      <div className="flex justify-end pt-2">
        <button
          className="bg-[#6366f1] hover:bg-[#4f46e5] text-white font-medium sm:font-semibold px-6 sm:px-10 py-2.5 rounded-lg text-sm sm:text-base transition"
          onClick={() => router.back()}
        >
          Done
        </button>
      </div>
    </div>
  );
}