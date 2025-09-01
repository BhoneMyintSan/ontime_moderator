"use client";
import { FiSearch, FiLogOut, FiUser } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useUser, useClerk } from "@clerk/nextjs";

const Navbar = () => {
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [profileImg, setProfileImg] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Try to load the profile image from localStorage (if you save it there in your settings page)
  useEffect(() => {
    const img = window.localStorage.getItem("profileImg") || "";
    setProfileImg(img);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to a search results page or handle search
      router.push(`/dashboard/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSignOut = async () => {
    try {
      setShowDropdown(false);
      await signOut();
      // Replace the current history entry to prevent back button navigation
      window.location.replace('/login');
    } catch (error) {
      console.error('Sign out error:', error);
      // Fallback to regular navigation if replace fails
      router.push('/login');
    }
  };

  return (
    <div className="w-full flex flex-row items-center justify-end gap-2 sm:gap-0 mb-6 relative">
      <div className="flex items-center gap-3 ml-2 flex-shrink-0">
        <form onSubmit={handleSearch} className="relative min-w-0 max-w-xs xs:max-w-sm sm:max-w-md lg:max-w-lg">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <FiSearch size={18} />
          </span>
          <input
            type="text"
            placeholder="Search by name, ID, email, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#252540] text-white pl-10 pr-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base"
          />
        </form>
        
        {/* User Profile Dropdown */}
        <div className="relative">
          <div
            className="relative ml-4 w-10 h-10 rounded-full border-2 border-blue-600 cursor-pointer overflow-hidden bg-[#18182c] flex items-center justify-center hover:ring-2 hover:ring-purple-500 transition"
            onClick={() => setShowDropdown(!showDropdown)}
            title={user?.fullName || "User profile"}
          >
            {profileImg || user?.imageUrl ? (
              <Image
                src={profileImg || user?.imageUrl || ""}
                alt="profile"
                fill
                sizes="40px"
                className="object-cover rounded-full"
              />
            ) : (
              <span className="text-[#b3b3c6] text-lg font-bold select-none">
                {user?.firstName?.charAt(0) || user?.emailAddresses?.[0]?.emailAddress?.charAt(0)?.toUpperCase() || "U"}
              </span>
            )}
          </div>
          
          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-[#23233a] rounded-lg shadow-xl border border-[#29294d] z-50">
              <div className="p-4 border-b border-[#29294d]">
                <p className="text-white font-semibold">{user?.fullName || "User"}</p>
                <p className="text-[#b3b3c6] text-sm">{user?.emailAddresses?.[0]?.emailAddress}</p>
              </div>
              <div className="py-2">
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    router.push("/dashboard/settings");
                  }}
                  className="w-full px-4 py-2 text-left text-white hover:bg-[#252540] transition flex items-center gap-3"
                >
                  <FiUser size={16} />
                  Profile Settings
                </button>
                <button 
                  onClick={handleSignOut}
                  className="w-full px-4 py-2 text-left text-red-400 hover:bg-[#252540] transition flex items-center gap-3"
                >
                  <FiLogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default Navbar;