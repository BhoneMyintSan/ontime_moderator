import { Ticket } from '@/lib/types';

const mockTickets: Ticket[] = [
  {
    id: 1,
    service_listing_id: 201,
    requester_name: 'alice_brown',
    provider_name: 'john_doe',
    created_at: '28 Jan, 10:30 AM',
    status: 'Resolved',
  },
  {
    id: 2,
    service_listing_id: 202,
    requester_name: 'john_doe',
    provider_name: 'mike_w',
    created_at: '28 Jan, 10:30 AM',
    status: 'Unresolved',
  },
  {
    id: 3,
    service_listing_id: 203,
    requester_name: 'emily_white',
    provider_name: 'bruce_lee',
    created_at: '28 Jan, 10:30 AM',
    status: 'Unresolved',
  },
  {
    id: 4,
    service_listing_id: 204,
    requester_name: 'michael_smith',
    provider_name: 'emily_white',
    created_at: '28 Jan, 10:30 AM',
    status: 'Unresolved',
  },
];

export default mockTickets;
