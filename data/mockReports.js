const mockReports = [
  {
    id: "RPT-001",
    serviceId: "SVD-201",
    reporter: "alice_brown",
    against: "john_doe",
    reason: "Spam",
    date: "2024-06-01",
    status: "Unresolved",
    details: "User posted spam links in the chat.",
  },
  {
    id: "RPT-002",
    serviceId: "SVD-202",
    reporter: "john_doe",
    against: "mike_w",
    reason: "Abuse",
    date: "2024-06-02",
    status: "Resolved",
    details: "User used abusive language.",
  },
  {
    id: "RPT-003",
    serviceId: "SVD-203",
    reporter: "emily_white",
    against: "bruce_lee",
    reason: "Harassment",
    date: "2024-06-03",
    status: "Unresolved",
    details: "User sent harassing messages.",
  },
  {
    id: "RPT-004",
    serviceId: "SVD-204",
    reporter: "michael_smith",
    against: "emily_white",
    reason: "Other",
    date: "2024-06-04",
    status: "Unresolved",
    details: "Other inappropriate behavior.",
  },
];

export default mockReports;