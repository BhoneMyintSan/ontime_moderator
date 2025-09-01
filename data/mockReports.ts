import { Report } from '@/lib/types';

const mockReports: Report[] = [
  {
    id: 1,
    service_listing_id: 201,
    reporter_name: 'alice_brown',
    reason: 'Spam',
    created_at: '2024-06-01',
    status: 'Unresolved',
  },
  {
    id: 2,
    service_listing_id: 202,
    reporter_name: 'john_doe',
    reason: 'Abuse',
    created_at: '2024-06-02',
    status: 'Resolved',
  },
  {
    id: 3,
    service_listing_id: 203,
    reporter_name: 'emily_white',
    reason: 'Harassment',
    created_at: '2024-06-03',
    status: 'Unresolved',
  },
  {
    id: 4,
    service_listing_id: 204,
    reporter_name: 'michael_smith',
    reason: 'Other',
    created_at: '2024-06-04',
    status: 'Unresolved',
  },
];

export default mockReports;
