import React from "react";

const statusStyle = {
  Approved: "bg-green-600",
  Pending: "bg-yellow-500",
  Rejected: "bg-red-600",
};

const RefundTable = ({ refunds }) => (
  <div className="w-full overflow-x-auto rounded-lg">
    <table className="w-full">
      <thead>
        <tr className="text-[#b3b3c6] text-left text-lg">
          <th className="py-4 px-3 sm:px-6 font-semibold">Refund ID</th>
          <th className="py-4 px-3 sm:px-6 font-semibold">User</th>
          <th className="py-4 px-3 sm:px-6 font-semibold">Email</th>
          <th className="py-4 px-3 sm:px-6 font-semibold">Amount</th>
          <th className="py-4 px-3 sm:px-6 font-semibold">Status</th>
          <th className="py-4 px-3 sm:px-6 font-semibold">Date</th>
          <th className="py-4 px-3 sm:px-6 font-semibold">Reason</th>
        </tr>
      </thead>
      <tbody>
        {refunds.map((refund) => (
          <tr
            key={refund.id}
            className="border-t border-[#29294d] hover:bg-[#252540] transition"
          >
            <td className="py-3 px-3 sm:px-6">{refund.id}</td>
            <td className="py-3 px-3 sm:px-6">{refund.user}</td>
            <td className="py-3 px-3 sm:px-6">{refund.email}</td>
            <td className="py-3 px-3 sm:px-6">{refund.amount}</td>
            <td className="py-3 px-3 sm:px-6">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${statusStyle[refund.status]}`}
                style={{ minWidth: "7rem", display: "inline-block", textAlign: "center" }}
              >
                {refund.status}
              </span>
            </td>
            <td className="py-3 px-3 sm:px-6">{refund.date}</td>
            <td className="py-3 px-3 sm:px-6">{refund.reason}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default RefundTable;