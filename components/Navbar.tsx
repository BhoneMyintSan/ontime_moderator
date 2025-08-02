"use client";
import { FiSearch } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

const Navbar = () => {
  const router = useRouter();
  const [profileImg, setProfileImg] = useState("");

  // Try to load the profile image from localStorage (if you save it there in your settings page)
  useEffect(() => {
    const img = window.localStorage.getItem("profileImg") || "";
    setProfileImg(img);
  }, []);

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
        {/* Profile image */}
      <div
        className="relative ml-4 w-10 h-10 rounded-full border-2 border-blue-600 cursor-pointer overflow-hidden bg-[#18182c] flex items-center justify-center hover:ring-2 hover:ring-purple-500 transition"
        onClick={() => router.push("/dashboard/settings")}
        title="Open settings"
      >
        {profileImg ? (
          <Image
            src={profileImg}
            alt="profile"
            fill
            sizes="40px"
            className="object-cover rounded-full"
          />
        ) : (
          <span className="text-[#555] text-lg font-bold select-none">M</span>
        )}
      </div>
      </div>
    </div>
  );
};

export default Navbar;