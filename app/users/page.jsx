import UserTable from '../../components/UserTable';

export default function Users() {
  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h1 className="text-3xl font-bold text-white mb-6">User Moderation</h1>
      <div className="flex gap-4 mb-6">
        <span className="bg-[#23233a] text-white px-5 py-2 rounded-lg font-medium text-base shadow">
          Total Users : 1200
        </span>
        <button className="flex items-center gap-2 bg-[#6366f1] hover:bg-[#4f46e5] px-5 py-2 rounded-lg text-white font-semibold text-base shadow transition">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M3 12h18M3 18h18" />
          </svg>
          Filter
        </button>
      </div>
      <div className="bg-[#23233a] rounded-2xl shadow p-0 overflow-x-auto">
        <UserTable />
      </div>
    </div>
  );
}