"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/lib/types";
import SearchAndFilter from "../SearchAndFilter";

export default function UserTable({
  onCountChange,
}: {
  onCountChange?: (n: number) => void;
}) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
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
  }, [onCountChange]);

  const filterOptions = {
    status: [
      { label: "Active", value: "Active" },
      { label: "Inactive", value: "Inactive" },
      { label: "Suspended", value: "Suspended" },
    ],
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Search filter
      const matchesSearch = searchQuery === "" || 
        user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.phone && user.phone.includes(searchQuery));

      // Status filter
      const matchesStatus = !filters.status || user.status === filters.status;

      return matchesSearch && matchesStatus;
    });
  }, [users, searchQuery, filters]);

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
        onFilterChange={setFilters}
        filterOptions={filterOptions}
      />
      
      <table className="min-w-full text-sm text-white">
        <thead className="bg-[#1c1c2e] text-gray-400 uppercase text-xs">
          <tr>
            <th className="px-4 py-3 text-left">Name (ID)</th>
            <th className="px-4 py-3 text-left">Phone</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Warnings</th>
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
              <td className="px-4 py-3">{user.status}</td>
              <td className="px-4 py-3">{user.warnings}</td>
            </tr>
          ))}
          {filteredUsers.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center py-8 text-gray-400">
                {searchQuery || Object.keys(filters).length > 0 
                  ? "No users match your search criteria." 
                  : "No users found."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

