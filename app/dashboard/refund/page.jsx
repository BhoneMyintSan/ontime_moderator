"use client";
import { useState } from "react";
import RefundTable from "../../../components/tables/RefundTable";
import mockRefunds from "../../../data/mockRefunds";

export default function RefundsPage() {
  const [refunds] = useState(mockRefunds);

  return (
    <div className="max-w-5xl mx-auto mt-10 px-2 sm:px-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Refund Requests</h1>
      <p className="text-[#b3b3c6] mb-8">Manage and review all refund requests submitted by users.</p>
      <div className="bg-[#23233a] rounded-2xl p-6 shadow">
        <RefundTable refunds={refunds} />
      </div>
    </div>
  );
}