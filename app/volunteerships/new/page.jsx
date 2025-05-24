'use client';
import { useRouter } from 'next/navigation';

export default function CreateVolunteership() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="bg-[#23233a] rounded-2xl p-10 shadow">
        <h1 className="text-3xl font-bold text-white mb-8">Create New Volunteer Ship Activity</h1>
        <form className="space-y-6">
          <div>
            <label className="block text-[#b3b3c6] font-semibold mb-2">Activity Title</label>
            <input
              type="text"
              placeholder="Enter activity title"
              className="w-full bg-[#18182c] text-white px-4 py-3 rounded-lg focus:outline-none"
            />
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full">
              <label className="block text-[#b3b3c6] font-semibold mb-2">Start Date</label>
              <input
                type="date"
                className="w-full bg-[#18182c] text-white px-4 py-3 rounded-lg focus:outline-none"
              />
            </div>
            <div className="w-full">
              <label className="block text-[#b3b3c6] font-semibold mb-2">End Date</label>
              <input
                type="date"
                className="w-full bg-[#18182c] text-white px-4 py-3 rounded-lg focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-[#b3b3c6] font-semibold mb-2">Location</label>
            <input
              type="text"
              placeholder="Activity location"
              className="w-full bg-[#18182c] text-white px-4 py-3 rounded-lg focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[#b3b3c6] font-semibold mb-2">Role Description</label>
            <textarea
              placeholder="Describe the volunteer role"
              className="w-full bg-[#18182c] text-white px-4 py-3 rounded-lg h-24 focus:outline-none"
            ></textarea>
          </div>
          <div>
            <label className="block text-[#b3b3c6] font-semibold mb-2">Role Description</label>
            <textarea
              placeholder="List items to bring and expectations"
              className="w-full bg-[#18182c] text-white px-4 py-3 rounded-lg h-20 focus:outline-none"
            ></textarea>
          </div>
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              className="bg-[#23233a] border border-[#29294d] px-8 py-2 rounded-lg text-white font-semibold shadow transition"
              onClick={() => router.push('/volunteerships')}
            >
              Discard
            </button>
            <button
              type="submit"
              className="bg-[#6366f1] hover:bg-[#4f46e5] px-8 py-2 rounded-lg text-white font-semibold shadow transition"
            >
              Post Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
