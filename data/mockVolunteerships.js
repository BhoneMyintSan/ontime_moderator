const mockVolunteerships = [
  {
    id: "1",
    title: "Community Clean-Up",
    status: "Open",
    dateRange: "May 15, 2024",
    organization: "Green Earth Org",
    description: "Help clean up the park and make our community greener.",
    logistics: "Meet at the main gate at 8am. Tools provided.",
    requirements: "Must be 16+. Bring water and wear comfortable clothes.",
    tokenReward: 10,
    contact: "contact@greenearth.org",
    applicants: [
      { name: "Anna Brown", email: "anna.b@email.com", showUp: true },
      { name: "James Smith", email: "james.s@email.com", showUp: true },
      { name: "Emily Johnson", email: "emily.j@email.com", showUp: true }
    ],
    maxParticipants: 5
  },
  {
    id: "2",
    title: "Tutoring Program",
    status: "Open",
    dateRange: "Jun 1 - Jul 15, 2024",
    organization: "Bright Minds",
    description: "Volunteer to tutor students in math and science.",
    logistics: "Sessions held at the library every Saturday.",
    requirements: "Must be 18+. Background check required.",
    tokenReward: 8,
    contact: "info@brightminds.org",
    applicants: [
      { name: "Michael Brown", email: "michael.b@email.com", showUp: true },
      { name: "Jessica Davis", email: "jessica.d@email.com", showUp: true }
    ],
    maxParticipants: 3
  },
  {
    id: "3",
    title: "Animal Shelter Helper",
    status: "Closed",
    dateRange: "Jul 1 - Aug 30, 2024",
    organization: "Happy Paws Shelter",
    description: "Assist with daily care of animals at the shelter.",
    logistics: "Shifts available mornings and afternoons.",
    requirements: "Must love animals. Training provided.",
    tokenReward: 12,
    contact: "volunteer@happypaws.org",
    applicants: [
      { name: "William Wilson", email: "william.w@email.com", showUp: true },
      { name: "Sophia Miller", email: "sophia.m@email.com", showUp: true },
      { name: "Olivia Moore", email: "olivia.m@email.com", showUp: true }
    ],
    maxParticipants: 4
  }
];

export default mockVolunteerships;