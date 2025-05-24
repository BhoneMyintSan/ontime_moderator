"use client";
import { FiSearch } from "react-icons/fi";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();

  return (

    <div className="w-full flex flex-row items-center justify-end gap-2 sm:gap-0 mb-6 relative">
      <div className="flex items-center gap-3 ml-2 flex-shrink-0">
        <div className="relative min-w-0 max-w-xs xs:max-w-sm sm:max-w-md lg:max-w-lg">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <FiSearch size={18} />
          </span>
          <input
            type="text"
            placeholder="Search..."
            className="bg-[#252540] text-white pl-10 pr-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base"
          />
        </div>
        <img
          src="https://i.pravatar.cc/40"
          alt="profile"
          className="rounded-full w-10 h-10 border-2 border-blue-600 cursor-pointer"

          onClick={() => router.push("/dashboard/settings")}
        />
      </div>
    </div>
  );
};

export default Navbar;
