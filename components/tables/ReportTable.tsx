const statusStyle: { [key: string]: string } = {
  Resolved: "bg-green-500",
  Unresolved: "bg-red-500",
};

interface Report {
  id: string;
  listing_id: number;
  reporter_name: string;
  offender_name: string;
  datetime: Date;
  report_reason?: string;
  status: string;
}

interface ReportTableProps {
  filter: string;
  reports: Report[];
  onToggleStatus: (id: string) => void;
}

const ReportTable: React.FC<ReportTableProps> = ({
  reports,
  onToggleStatus,
}) => {
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
          {reports.map((r) => (
            <tr
              key={r.id}
              className="border-t border-[#29294d] hover:bg-[#252540] cursor-pointer"
              onClick={() =>
                (window.location.href = `/dashboard/reports/${r.id}`)
              }
            >
              <td className="py-3 px-3 sm:px-6">{r.id}</td>
              <td className="py-3 px-3 sm:px-6">{r.listing_id}</td>
              <td className="py-3 px-3 sm:px-6">{r.reporter_name}</td>
              <td className="py-3 px-3 sm:px-6">{r.offender_name}</td>
              <td className="py-3 px-3 sm:px-6">{r.report_reason}</td>
              <td className="py-3 px-3 sm:px-6">
                {new Date(r.datetime).toLocaleDateString()}
              </td>
              <td className="py-3 px-3 sm:px-6">
                <button
                  onClick={(e) => {
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
