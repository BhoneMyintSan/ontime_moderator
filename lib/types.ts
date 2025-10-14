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

export interface ServiceListing {
  id: number;
  title: string;
  description: string;
  token_reward: number;
  posted_by: string;
  posted_at: string;
  category: string;
  image_url: string | null;
  status: string;
  contact_method: string | null;
  user: {
    id: string;
    full_name: string;
    phone: string;
  };
  warnings?: ServiceWarning[];
  reports?: Report[];
  warning?: ServiceWarning[];  // Alternative field name from Prisma
  report?: Report[];           // Alternative field name from Prisma
  _count?: {
    warnings?: number;
    reports?: number;
    warning?: number;   // Alternative field name from Prisma
    report?: number;    // Alternative field name from Prisma
  };
}

export interface ServiceWarning {
  id: number;
  user_id: string;
  severity: "mild" | "severe";
  comment: string;
  created_at: string;
  reason: string;
  listing_id: number;
}

export interface Applicant {
  name: string;
  email: string;
  showUp: boolean;
}

