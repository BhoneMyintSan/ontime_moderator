"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

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
          console.log("User data received:", json.data);
          console.log("Token balance:", json.data.token_balance);
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
        <Button
          onClick={() => router.back()}
          size="lg"
          className="w-full sm:w-auto ml-4"
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
    );
  }

  return (
    <div className="min-h-screen bg-[#23233a] p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Card - Enhanced */}
        <div className="relative bg-gradient-to-br from-[#1f1f33] to-[#252540] rounded-2xl p-6 sm:p-8 border border-[#29294d] overflow-hidden">
          {/* Gradient Glow Effect */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Avatar */}
              <div className="w-28 h-28 rounded-2xl border-4 border-blue-500/30 bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-white font-bold text-4xl shadow-xl flex-shrink-0">
                {userData.full_name.charAt(0).toUpperCase()}
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  {userData.full_name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="text-sm text-[#b3b3c6] flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Member since{" "}
                    {new Date(userData.joined_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-sm text-[#b3b3c6]">•</span>
                  <span className="text-sm text-[#b3b3c6]">
                    ID: {userData.id?.substring(0, 8)}...
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2 text-[#e0e0e0] bg-[#252540] px-3 py-2 rounded-lg">
                    <svg
                      className="w-4 h-4 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="break-all text-sm">
                      {userData.email || "No email"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[#e0e0e0] bg-[#252540] px-3 py-2 rounded-lg">
                    <svg
                      className="w-4 h-4 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span className="text-sm">
                      {userData.phone || "No phone"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[#e0e0e0] bg-[#252540] px-3 py-2 rounded-lg">
                    <svg
                      className="w-4 h-4 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-sm font-medium text-green-400">
                      {(userData.token_balance ?? 0).toLocaleString()} Tokens
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>





      {/* Additional User Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Details */}
        <div className="bg-[#1f1f33] rounded-2xl border border-[#29294d] shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#29294d] bg-gradient-to-r from-blue-500/5 to-purple-500/5">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <svg
                className="w-5 h-5 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Account Details
            </h2>
          </div>
          <div className="px-6 py-4 space-y-3">
            <div className="flex justify-between items-center py-3 border-b border-[#29294d]">
              <span className="text-[#9ca3af] text-sm font-medium">
                Email Signup
              </span>
              <span className={`text-sm font-medium ${userData.is_email_signedup ? 'text-green-400' : 'text-gray-400'}`}>
                {userData.is_email_signedup ? "Verified" : "Not Verified"}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-[#29294d]">
              <span className="text-[#9ca3af] text-sm font-medium">
                User ID
              </span>
              <code className="text-white text-xs bg-[#252540] px-2 py-1 rounded font-mono">
                {userData.id}
              </code>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-[#9ca3af] text-sm font-medium">
                Account Age
              </span>
              <span className="text-white font-semibold">
                {Math.floor(
                  (new Date().getTime() -
                    new Date(userData.joined_at).getTime()) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                days
              </span>
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="bg-[#1f1f33] rounded-2xl border border-[#29294d] shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#29294d] bg-gradient-to-r from-blue-500/5 to-purple-500/5">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <svg
                className="w-5 h-5 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Location Information
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <div className="text-[#9ca3af] text-xs uppercase tracking-wide">
                Address
              </div>
              <div className="text-white text-sm">
                {userData.address_line_1}
              </div>
              {userData.address_line_2 && (
                <div className="text-white text-sm">
                  {userData.address_line_2}
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#29294d]">
              <div>
                <div className="text-[#9ca3af] text-xs uppercase tracking-wide mb-1">
                  City
                </div>
                <div className="text-white text-sm font-medium">
                  {userData.city}
                </div>
              </div>
              <div>
                <div className="text-[#9ca3af] text-xs uppercase tracking-wide mb-1">
                  State
                </div>
                <div className="text-white text-sm font-medium">
                  {userData.state_province}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#29294d]">
              <div>
                <div className="text-[#9ca3af] text-xs uppercase tracking-wide mb-1">
                  Postal Code
                </div>
                <div className="text-white text-sm font-medium">
                  {userData.zip_postal_code}
                </div>
              </div>
              <div>
                <div className="text-[#9ca3af] text-xs uppercase tracking-wide mb-1">
                  Country
                </div>
                <div className="text-white text-sm font-medium">
                  {userData.country}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>





      {/* Done Button */}
      <div className="flex justify-center sm:justify-end">
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
          Back to Users
        </Button>
      </div>
      </div>
    </div>
  );
}
