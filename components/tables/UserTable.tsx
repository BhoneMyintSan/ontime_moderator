"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/lib/types";
import SearchAndFilter from "../SearchAndFilter";

interface UserStats {
  total: number;
}

export default function UserTable({
  onCountChange,
  onStatsChange,
}: {
  onCountChange?: (n: number) => void;
  onStatsChange?: (stats: UserStats) => void;
}) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/users");
        const json = await res.json();
        if (json.status === "success") {
          setUsers(json.data);
          if (onCountChange) {
            onCountChange(json.data.length);
          }
          // Calculate stats
          if (onStatsChange) {
            const stats: UserStats = {
              total: json.data.length,
            };
            onStatsChange(stats);
          }
        } else {
          setError(json.message || "Failed to fetch users");
        }
      } catch (error) {
        setError("Failed to fetch users");
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [onCountChange, onStatsChange]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Search filter
      const matchesSearch = searchQuery === "" || 
        user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.phone && user.phone.includes(searchQuery));

      return matchesSearch;
    });
  }, [users, searchQuery]);

  if (loading) {
    return <div className="text-center py-4 text-gray-400">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <SearchAndFilter
        searchPlaceholder="Search users by name, ID, or phone..."
        onSearchChange={setSearchQuery}
      />
      
  <table className="hidden md:table min-w-full text-sm text-white">
        <thead className="bg-[#1c1c2e] text-gray-400 uppercase text-xs">
          <tr>
            <th className="px-4 py-3 text-left">Name (ID)</th>
            <th className="px-4 py-3 text-left">Phone</th>
            <th className="px-4 py-3 text-left">Account Date</th>
            <th className="px-4 py-3 text-left">Tokens</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr
              key={user.id}
              className="border-b border-gray-700 hover:bg-[#252540] transition cursor-pointer"
              onClick={() => router.push(`/dashboard/users/${user.id}`)}
            >
              <td className="px-4 py-3">
                {user.full_name}
                <div className="text-xs text-gray-400">{user.id}</div>
              </td>
              <td className="px-4 py-3">{user.phone || "-"}</td>
              <td className="px-4 py-3">
                {user.joined_at ? new Date(user.joined_at).toLocaleDateString() : "-"}
                <div className="text-xs text-gray-400">
                  {user.joined_at ? 
                    Math.floor((new Date().getTime() - new Date(user.joined_at).getTime()) / (1000 * 60 * 60 * 24)) + " days ago" 
                    : ""
                  }
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="text-green-400 font-medium">
                  {(user.token_balance || 0).toLocaleString()}
                </span>
              </td>
            </tr>
          ))}
          {filteredUsers.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center py-8 text-gray-400">
                {searchQuery 
                  ? "No users match your search criteria." 
                  : "No users found."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Mobile cards */}
      <div className="md:hidden space-y-3 mt-4">
        {filteredUsers.map(user => (
          <div key={user.id} onClick={() => router.push(`/dashboard/users/${user.id}`)} className="bg-[#23233a] border border-[#29294d] rounded-lg p-4 flex flex-col gap-2 hover:bg-[#252540] transition cursor-pointer">
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold truncate">{user.full_name}</span>
              <span className="text-green-400 font-medium text-sm">
                {(user.token_balance || 0).toLocaleString()} tokens
              </span>
            </div>
            <div className="text-[#b3b3c6] text-xs flex flex-wrap gap-x-4 gap-y-1">
              <span>ID: {user.id}</span>
              {user.phone && <span>📞 {user.phone}</span>}
              <span>📅 Joined {user.joined_at ? new Date(user.joined_at).toLocaleDateString() : "N/A"}</span>
            </div>
          </div>
        ))}
        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-[#b3b3c6] text-sm border border-dashed border-[#29294d] rounded-lg">
            {searchQuery ? 'No users match your search criteria.' : 'No users found.'}
          </div>
        )}
      </div>
    </div>
  );
}
