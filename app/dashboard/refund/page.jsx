"use client";
import { useState } from "react";
import RefundTable from "../../../components/RefundTable";

const mockRefunds = [
  {
    id: "RF-001",
    user: "Alice_Brown",
    email: "alice.brown@email.com",
    amount: "25 tickets",
    status: "Pending",
    date: "2024-06-01",
    reason: "Service not delivered",
  },
  {
    id: "RF-002",
    user: "John_Smith",
    email: "john.smith@email.com",
    amount: "15 tickets",
    status: "Approved",
    date: "2024-05-28",
    reason: "Duplicate payment",
  },
  {
    id: "RF-003",
    user: "Maria_Garcia",
    email: "maria.garcia@email.com",
    amount: "40 tickets",
    status: "Rejected",
    date: "2024-05-20",
    reason: "Invalid request",
  },
];

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