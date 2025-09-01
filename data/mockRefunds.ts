import { Refund } from '@/lib/types';

const mockRefunds: Refund[] = [
  {
    id: 'RF-001',
    user: 'Alice_Brown',
    email: 'alice.brown@email.com',
    amount: '25 tickets',
    status: 'Pending',
    date: '2024-06-01',
    reason: 'Service not delivered',
  },
  {
    id: 'RF-002',
    user: 'John_Smith',
    email: 'john.smith@email.com',
    amount: '15 tickets',
    status: 'Approved',
    date: '2024-05-28',
    reason: 'Duplicate payment',
  },
  {
    id: 'RF-003',
    user: 'Maria_Garcia',
    email: 'maria.garcia@email.com',
    amount: '40 tickets',
    status: 'Rejected',
    date: '2024-05-20',
    reason: 'Invalid request',
  },
];

export default mockRefunds;
