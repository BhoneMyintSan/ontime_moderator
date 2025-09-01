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
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2">Refund Requests</h1>
      <p className="text-[#b3b3c6] mb-8">Manage and review all refund requests submitted by users.</p>
      <div className="bg-[#23233a] rounded-lg shadow-lg overflow-hidden">
        {loading && <div className="p-8 text-center text-[#b3b3c6]">Loading refunds...</div>}
        {error && <div className="p-8 text-center text-red-400">{error}</div>}
        {!loading && !error && <div className="p-6"><RefundTable refunds={refunds} /></div>}
      </div>
    </div>
  );
}