const reports = [
  {
    id: 'RP-101',
    serviceId: 'SVD-201',
    reporter: 'Alice_brown',
    against: 'Jhon_Doe',
    reason: 'Miss-conduct',
    date: '28 Jan, 12.30 AM',
    status: 'Resolved'
  },
  {
    id: 'RP-102',
    serviceId: 'SVD-202',
    reporter: 'Jhon_Doe',
    against: 'Mike_Willam',
    reason: 'Spam',
    date: '25 Jan, 10.40 PM',
    status: 'Unresolved'
  },
  {
    id: 'RP-103',
    serviceId: 'SVD-203',
    reporter: 'Emily_White',
    against: 'Bruce_Lee',
    reason: 'Inappropriate content',
    date: '20 Jan, 10.40 PM',
    status: 'Unresolved'
  }
];

const statusStyle = {
  Resolved: 'bg-green-500',
  Unresolved: 'bg-red-500'
};

const ReportTable = ({ filter }) => {
  const filteredReports =
    filter === "all"
      ? reports
      : reports.filter((r) => r.status === filter);

  return (

    <div className="w-full overflow-x-auto rounded-lg">
      <table className="min-w-[600px] w-full text-base">
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
          {filteredReports.map((r, i) => (
            <tr key={i} className="border-t border-[#29294d] hover:bg-[#252540]">
              <td className="py-3 px-3 sm:px-6">{r.id}</td>
              <td className="py-3 px-3 sm:px-6">{r.serviceId}</td>
              <td className="py-3 px-3 sm:px-6">{r.reporter}</td>
              <td className="py-3 px-3 sm:px-6">{r.against}</td>
              <td className="py-3 px-3 sm:px-6">{r.reason}</td>
              <td className="py-3 px-3 sm:px-6">{r.date}</td>
              <td className="py-3 px-3 sm:px-6">
                <span className={`text-xs px-4 py-1 rounded-full text-white font-semibold ${statusStyle[r.status]}`}>
                  {r.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportTable;