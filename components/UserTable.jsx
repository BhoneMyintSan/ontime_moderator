import Link from 'next/link';

const users = [
  {
    id: 1,
    username: 'alice_brown',
    email: 'alice_b@gmail.com',
    phone: '(+66)12345678',
    status: 'Active',
    joined: 'March 2023',
    warnings: 2,
    avatar: 'https://i.pravatar.cc/40?img=1'
  },
  {
    id: 2,
    username: 'john_doe',
    email: 'john_d@gmail.com',
    phone: '(+66)87654321',
    status: 'Away',
    joined: 'January 2023',
    warnings: 1,
    avatar: 'https://i.pravatar.cc/40?img=2'
  },
  {
    id: 3,
    username: 'emily_white',
    email: 'emily_w@gmail.com',
    phone: '(+66)54321876',
    status: 'Suspended',
    joined: 'April 2023',
    warnings: 3,
    avatar: 'https://i.pravatar.cc/40?img=3'
  }
];

const statusStyle = {
  Active: 'bg-green-500',
  Away: 'bg-yellow-500',
  Suspended: 'bg-red-500'
};

const UserTable = () => {
  return (

    <div className="overflow-x-auto">
      <table className="min-w-[600px] w-full text-base">
        <thead>
          <tr className="text-[#b3b3c6] text-left text-lg">
            <th className="py-4 px-3 sm:px-6 font-semibold">User</th>
            <th className="py-4 px-3 sm:px-6 font-semibold">Email</th>
            <th className="py-4 px-3 sm:px-6 font-semibold">Phone</th>
            <th className="py-4 px-3 sm:px-6 font-semibold">Status</th>
            <th className="py-4 px-3 sm:px-6 font-semibold">Warnings</th>

          </tr>
        </thead>
        <tbody>
          {users.map((user, i) => (
            <tr key={i} className="border-t border-[#29294d] hover:bg-[#252540]">
              <td className="py-3 px-3 sm:px-6 flex items-center gap-3">

                <img src={user.avatar} className="rounded-full w-10 h-10" alt="avatar" />
                <div>
                  <div className="font-semibold text-white">
                    <Link href={`/dashboard/users/${user.id}`}>
                      <div className="user-card">{user.username}</div>
                    </Link>
                  </div>
                  <div className="text-xs text-gray-400">Member since {user.joined}</div>
                </div>
              </td>

              <td className="py-3 px-3 sm:px-6">
                <a href={`mailto:${user.email}`} className="text-[#8ab4f8] hover:underline">{user.email}</a>
              </td>
              <td className="py-3 px-3 sm:px-6">{user.phone}</td>
              <td className="py-3 px-3 sm:px-6">

                <span className={`text-xs px-3 py-1 rounded-full text-white font-semibold ${statusStyle[user.status]}`}>
                  {user.status}
                </span>
              </td>

              <td className="py-3 px-3 sm:px-6">{user.warnings}</td>

            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-400 px-3 sm:px-6 pb-4 gap-2">

        <span>Showing 1-3 of 1200 users</span>
        <div className="flex gap-2">
          <button className="w-8 h-8 rounded bg-[#23233a] text-white border border-[#29294d]">1</button>
          <button className="w-8 h-8 rounded bg-[#23233a] text-white border border-[#29294d]">2</button>
          <button className="w-8 h-8 rounded bg-[#23233a] text-white border border-[#29294d]">3</button>
        </div>
      </div>
    </div>
  );
};

export default UserTable;
