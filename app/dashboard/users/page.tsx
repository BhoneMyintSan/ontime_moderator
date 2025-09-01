"use client";
import { useState, useEffect } from "react";
import UserTable from "../../../components/tables/UserTable";

export default function Users() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  // Simulate loading state based on UserTable's count update
  useEffect(() => {
    if (totalUsers > 0 || totalUsers === 0) {
      setLoading(false);
    }
  }, [totalUsers]);

  return (
    <div className="max-w-5xl mx-auto mt-10 px-2 sm:px-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">
        User Moderation
      </h1>

      <div className="flex flex-row flex-wrap justify-start gap-2 sm:gap-4 mb-6">
        <span className="bg-[#23233a] text-white px-5 py-2 rounded-lg font-medium text-base shadow w-auto self-auto">
          Total Users: {totalUsers}
        </span>

        <button className="flex items-center gap-2 bg-[#6366f1] hover:bg-[#4f46e5] px-5 py-2 rounded-lg text-white font-semibold text-base shadow transition w-auto self-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M3 12h18M3 18h18" />
          </svg>
          Filter
        </button>
      </div>

      <div className="bg-[#23233a] rounded-2xl shadow p-0 overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-white">Loading user...</div>
        ) : (
          <UserTable onCountChange={setTotalUsers} />
        )}
      </div>
    </div>
  );
}
