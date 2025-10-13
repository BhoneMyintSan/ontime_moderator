export interface User {
  id: string;
  full_name: string;
  username: string;
  email: string;
  phone: string | null;
  status: string;
  warnings: number;
  avatar?: string;
  joined_at: string;
  token_balance: number;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface Report {
  id: number;
  reporter_name: string;
  service_listing_id: number;
  reason: string;
  status: "Resolved" | "Unresolved";
  created_at: string;
}

export interface Ticket {
  id: number;
  service_listing_id: number;
  requester_name: string;
  provider_name: string;
  created_at: string;
  status: "Resolved" | "Unresolved";
}

export interface Applicant {
  name: string;
  email: string;
  showUp: boolean;
}

export interface Volunteership {
  id: string;
  title: string;
  status: "Open" | "Closed";
  dateRange: string;
  organization: string;
  description: string;
  logistics: string;
  requirements: string;
  tokenReward: number;
  contact: string;
  applicants: Applicant[];
  maxParticipants: number;
}
