import Link from "next/link";

const statusStyle = {
  Resolved: 'bg-green-500',
  Unresolved: 'bg-red-500'
};

const ReportTable = ({ filter, reports, onToggleStatus }) => {
  const filteredReports =
    filter === "all"
      ? reports
      : reports.filter((r) => r.status === filter);

  return (
    <div className="w-full overflow-x-auto rounded-lg">
      <table className="w-full">
        <thead>
          <tr className="text-[#b3b3c6] text-left text-lg">
            <th className="py-4 px-3 sm:px-6 font-semibold">Report ID</th>
            <th className="py-4 px-3 sm:px-6 font-semibold">Service ID</th>
            <th className="py-4 px-3 sm:px-6 font-semibold">Reported By</th>
            <th className="py-4 px-3 sm:px-6 font-semibold">Against</th>
            <th className="py-4 px-3 sm:px-6 font-semibold">Reason</th>
            <th className="py-4 px-3 sm:px-6 font-semibold">Date</th>
            <th className="py-4 px-3 sm:px-6 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredReports.map((r) => (
            <tr
              key={r.id}
              className="border-t border-[#29294d] hover:bg-[#252540] cursor-pointer"
              onClick={() => window.location.href = `/dashboard/reports/${r.id}`}
            >
              <td className="py-3 px-3 sm:px-6">{r.id}</td>
              <td className="py-3 px-3 sm:px-6">{r.serviceId}</td>
              <td className="py-3 px-3 sm:px-6">{r.reporter}</td>
              <td className="py-3 px-3 sm:px-6">{r.against}</td>
              <td className="py-3 px-3 sm:px-6">{r.reason}</td>
              <td className="py-3 px-3 sm:px-6">{r.date}</td>
              <td className="py-3 px-3 sm:px-6">
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onToggleStatus(r.id);
                  }}
                  className={`w-28 px-4 py-1 rounded-full text-xs font-semibold focus:outline-none transition text-center
                    ${statusStyle[r.status]} text-white hover:opacity-90`}
                  style={{ minWidth: "7rem" }}
                >
                  {r.status}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportTable;