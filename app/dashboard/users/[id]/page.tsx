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
    if (!id) return;
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${id}`);
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
    if (userData) {
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
    <div className="max-w-4xl mx-auto mt-10 bg-[#23233a] rounded-2xl p-6 sm:p-10 shadow transition-all duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#444] bg-[#18182c] flex items-center justify-center shadow-md transition-all duration-300">
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{userData.full_name}</h1>
            <p className="text-[#b3b3c6]">
              Member since {new Date(userData.joined_at).toLocaleDateString()}
            </p>
            <div className="mt-2 space-y-1">
              <div className="text-[#b3b3c6] text-sm">
                <span className="font-semibold text-white">Email:</span> {userData.email}
              </div>
              <div className="text-[#b3b3c6] text-sm">
                <span className="font-semibold text-white">Phone:</span> {userData.phone || "-"}
              </div>
              <div className="text-[#b3b3c6] text-sm">
                <span className="font-semibold text-white">Status:</span> {userData.status}
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            className="bg-orange-400 hover:bg-orange-500 text-white font-semibold px-6 py-2 rounded-lg shadow transition-all duration-200"
            onClick={() => setShowWarningConfirm(true)}
          >
            Give Warning
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg shadow transition-all duration-200"
            onClick={() => setShowBanConfirm(true)}
          >
            Ban User
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
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1 bg-[#23233a] rounded-xl p-5 shadow border border-[#29294d] flex flex-col items-center transition-all duration-300">
          <span className="text-[#b3b3c6] text-sm mb-1">Total Reports</span>
          <span className="text-2xl font-bold text-white">
            {userData.reportsReceived.length}
          </span>
        </div>
        <div className="flex-1 bg-[#23233a] rounded-xl p-5 shadow border border-[#29294d] flex flex-col items-center transition-all duration-300">
          <span className="text-[#b3b3c6] text-sm mb-1">Warnings Issued</span>
          <span className="text-2xl font-bold text-white">
            {userData.warnings}
          </span>
        </div>
        <div className="flex-1 bg-[#23233a] rounded-xl p-5 shadow border border-[#29294d] flex flex-col items-center transition-all duration-300">
          <span className="text-[#b3b3c6] text-sm mb-1">Account Status</span>
          <select
            className="text-xl font-bold rounded bg-transparent text-orange-400 focus:outline-none transition"
            value={accountStatus}
            onChange={e => setAccountStatus(e.target.value)}
          >
            {statusOptions.map(status => (
              <option
                key={status}
                value={status}
                className="bg-[#23233a] text-white"
              >
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Report History */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-3">Report History</h2>
        <div className="space-y-3">
          {userData.reportsReceived.map((report: any) => (
            <div
              key={report.id}
              className="bg-[#23233a] rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between border border-[#29294d] shadow transition-all duration-200 hover:bg-[#252540]"
            >
              <div>
                <div className="text-white font-semibold">{report.reason}</div>
                <div className="text-[#b3b3c6] text-sm">
                  Reported by: {report.reported_by_id}
                </div>
              </div>
              <div className="flex flex-col items-end mt-2 sm:mt-0">
                <span className="text-[#b3b3c6] text-sm">
                  {new Date(report.created_at).toLocaleDateString()}
                </span>
                <span className="text-[#b3b3c6] text-xs">#{report.id}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Moderation Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-3">Moderation Actions</h2>
        <div className="space-y-3">
          {userData.moderationLogs.map((action: any, idx: number) => (
            <div
              key={idx}
              className="bg-[#23233a] rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between border border-[#29294d] shadow transition-all duration-200 hover:bg-[#252540]"
            >
              <div className="flex items-center gap-2">
                <FiAlertTriangle className="text-orange-400 text-xl" />
                <div>
                  <div className="text-white font-semibold">{action.action}</div>
                  <div className="text-[#b3b3c6] text-sm">
                    By {action.performed_by}
                  </div>
                </div>
              </div>
              <div className="text-[#b3b3c6] text-sm mt-2 sm:mt-0">
                {new Date(action.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Done Button */}
      <div className="flex justify-end">
        <button
          className="bg-[#6366f1] hover:bg-[#4f46e5] text-white font-semibold px-10 py-2 rounded-lg transition"
          onClick={() => router.back()}
        >
          Done
        </button>
      </div>
    </div>
  );
}