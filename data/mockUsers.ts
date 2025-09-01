import { User } from '@/lib/types';

const mockUsers: User[] = [
  {
    id: '1',
    full_name: 'alice_brown',
    username: 'alice_brown',
    email: 'alice_b@gmail.com',
    phone: '(+66)12345678',
    status: 'Active',
    warnings: 2,
    avatar: 'https://i.pravatar.cc/40?img=1',
  },
  {
    id: '2',
    full_name: 'john_doe',
    username: 'john_doe',
    email: 'john_d@gmail.com',
    phone: '(+66)87654321',
    status: 'Away',
    warnings: 1,
    avatar: 'https://i.pravatar.cc/40?img=2',
  },
  {
    id: '3',
    full_name: 'emily_white',
    username: 'emily_white',
    email: 'emily_w@gmail.com',
    phone: '(+66)54321876',
    status: 'Suspended',
    warnings: 3,
    avatar: 'https://i.pravatar.cc/40?img=3',
  },
];

export default mockUsers;
