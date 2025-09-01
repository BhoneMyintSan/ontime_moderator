"use client";
import { useState, useEffect } from "react";
import RefundTable from "../../../components/tables/RefundTable";
import { Refund } from "@/lib/types";

export default function RefundsPage() {
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRefunds = async () => {
      try {
        const response = await fetch("/api/refunds");
        if (!response.ok) {
          throw new Error("Failed to fetch refunds");
        }
        const data = await response.json();
        setRefunds(data.data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRefunds();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10 px-2 sm:px-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Refund Requests</h1>
      <p className="text-[#b3b3c6] mb-8">Manage and review all refund requests submitted by users.</p>
      <div className="bg-[#23233a] rounded-2xl p-6 shadow">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && <RefundTable refunds={refunds} />}
      </div>
    </div>
  );
}