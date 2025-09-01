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
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">
        User Moderation
      </h1>

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <span className="bg-[#23233a] text-white px-4 py-2 rounded-lg font-medium shadow">
            Total Users: {totalUsers}
          </span>
        </div>
      </div>

      <div className="bg-[#23233a] rounded-lg shadow-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[#b3b3c6]">Loading users...</div>
        ) : (
          <div className="p-6">
            <UserTable onCountChange={setTotalUsers} />
          </div>
        )}
      </div>
    </div>
  );
}
