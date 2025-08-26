"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserTable({
  onCountChange,
}: {
  onCountChange?: (n: number) => void;
}) {
  const [users, setUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await fetch("/api/users");
        const json = await res.json();
        if (json.status === "success") {
          setUsers(json.data);
          if (onCountChange) {
            onCountChange(json.data.length);
          }
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    loadUsers();
  }, [onCountChange]);

  return (
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
        {users.map((user: any) => (
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
        {users.length === 0 && (
          <tr>
            <td colSpan={5} className="text-center py-4 text-gray-400">
              No users found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
