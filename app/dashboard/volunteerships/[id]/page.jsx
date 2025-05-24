'use client';

import { useParams, useRouter } from 'next/navigation';
import { FiDownload } from 'react-icons/fi';

const applicants = [
  { name: 'Anna Brown', email: 'anna.b@email.com', showUp: true },
  { name: 'James Smith', email: 'james.s@email.com', showUp: true },
  { name: 'Emily Johnson', email: 'emily.j@email.com', showUp: true }
];

export default function VolunteershipDetail() {
  const { id } = useParams();
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto bg-[#23233a] p-4 sm:p-8 rounded-2xl mt-10 shadow">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Community Clean-Up</h1>
          <p className="text-[#b3b3c6] font-semibold mb-2">May 15,2024 - Benjakiti Park</p>
        </div>
        <button className="flex items-center gap-2 bg-[#6366f1] hover:bg-[#4f46e5] px-5 py-2 rounded-lg text-white font-semibold shadow transition">
          <FiDownload />
          Download List
        </button>
      </div>

      <h2 className="text-lg sm:text-xl font-bold text-white mb-2">Description</h2>
      <p className="mb-8 text-[#b3b3c6]">
        Join us for a community clean-up event inside Benjakiti Park to help improve our local parks and streets
      </p>

      <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Applicants ({applicants.length})</h2>
      <div className="overflow-x-auto rounded-lg">
        <table className="w-full text-base mb-2 min-w-[500px]">
          <thead>
            <tr className="text-[#b3b3c6] text-left border-b border-[#29294d]">
              <th className="p-3 font-semibold">Name</th>
              <th className="p-3 font-semibold">Status</th>
              <th className="p-3 font-semibold">Email</th>
              <th className="p-3 font-semibold">Show Up</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((a, i) => (
              <tr key={i} className="border-b border-[#29294d] hover:bg-[#252540] transition-colors">
                <td className="p-3 font-semibold text-white">{a.name}</td>
                <td className="p-3 text-white">Applied</td>
                <td className="p-3">
                  <a href={`mailto:${a.email}`} className="text-[#8ab4f8] hover:underline">{a.email}</a>
                </td>
                <td className="p-3 text-green-400 text-lg">✔</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-[#b3b3c6] px-2 py-2 gap-2">
          <span>Showing 1-3 of {applicants.length} applicants</span>
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded bg-[#23233a] text-white border border-[#29294d]">1</button>
            <button className="w-8 h-8 rounded bg-[#23233a] text-white border border-[#29294d]">2</button>
            <button className="w-8 h-8 rounded bg-[#23233a] text-white border border-[#29294d]">3</button>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between mt-8 gap-4">
        <button
          className="bg-[#29294d] px-8 py-2 rounded-lg text-white font-semibold shadow transition"
          onClick={() => router.push('/dashboard/volunteerships')}
        >
          Back
        </button>
        <button className="bg-[#6366f1] hover:bg-[#4f46e5] px-8 py-2 rounded-lg text-white font-semibold shadow transition">
          Mark All
        </button>
      </div>
    </div>
  );
}
