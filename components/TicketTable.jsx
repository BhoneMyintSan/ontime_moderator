const tickets = [
  {
    id: "TCK-001",
    service: "SVD-201",
    by: "alice_brown",
    against: "jhon_doe",
    date: "28 Jan, 10:30 AM",
    status: "Resolved",
  },
  {
    id: "TCK-002",
    service: "SVD-202",
    by: "jhon_doe",
    against: "mike_w",
    date: "28 Jan, 10:30 AM",
    status: "Unresolved",
  },
  {
    id: "TCK-003",
    service: "SVD-203",
    by: "emily_white",
    against: "bruce_lee",
    date: "28 Jan, 10:30 AM",
    status: "Unresolved",
  },
  {
    id: "TCK-004",
    service: "SVD-204",
    by: "michael_smith",
    against: "emily_white",
    date: "28 Jan, 10:30 AM",
    status: "Unresolved",
  },
];

const TicketTable = ({ tickets, onToggleStatus }) => (
  <div className="bg-[#23233a] rounded-2xl shadow p-0 overflow-x-auto">
    <table className="min-w-[600px] w-full table-fixed">
      <colgroup>
        <col style={{ width: "12%" }} />
        <col style={{ width: "14%" }} />
        <col style={{ width: "18%" }} />
        <col style={{ width: "18%" }} />
        <col style={{ width: "18%" }} />
        <col style={{ width: "20%" }} />
      </colgroup>
      <thead>
        <tr className="text-[#b3b3c6] text-left text-lg">
          <th className="py-4 px-3 sm:px-6 font-semibold">Ticket ID</th>
          <th className="py-4 px-3 sm:px-6 font-semibold">Service ID</th>
          <th className="py-4 px-3 sm:px-6 font-semibold">Reported By</th>
          <th className="py-4 px-3 sm:px-6 font-semibold">Against</th>
          <th className="py-4 px-3 sm:px-6 font-semibold">Date</th>
          <th className="py-4 px-3 sm:px-6 font-semibold">Status</th>
        </tr>
      </thead>
      <tbody>
        {tickets.map((t) => (
          <tr
            key={t.id}
            className="border-t border-[#29294d] text-[#e6e6f0] text-base transition-colors hover:bg-[#252540] cursor-pointer"
          >
            <td className="py-3 px-3 sm:px-6">{t.id}</td>
            <td className="py-3 px-3 sm:px-6">{t.service}</td>
            <td className="py-3 px-3 sm:px-6">{t.by}</td>
            <td className="py-3 px-3 sm:px-6">{t.against}</td>
            <td className="py-3 px-3 sm:px-6">{t.date}</td>
            <td className="py-3 px-3 sm:px-6">
              <button
                onClick={() => onToggleStatus(t.id)}
                className={`w-28 px-4 py-1 rounded-full text-sm font-semibold focus:outline-none transition text-center
                  ${
                    t.status === "Resolved"
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-red-500 text-white hover:bg-red-600"
                  }
                `}
                style={{ minWidth: "7rem" }}
              >
                {t.status}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TicketTable;
