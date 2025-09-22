"use client";
import { FiSearch, FiLogOut, FiUser, FiX } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useUser, useClerk } from "@clerk/nextjs";

const Navbar = () => {
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [profileImg, setProfileImg] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allDataLoaded, setAllDataLoaded] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);

  interface Suggestion {
    id: string;
    type: 'user' | 'ticket' | 'report' | 'refund';
    title: string;
    description?: string;
    route: string;
  }

  // Cache loaded raw datasets across component mounts (simple module-level cache)
  const dataCacheRef = useRef<{ users?: any[]; tickets?: any[]; reports?: any[]; refunds?: any[] }>({});

  const buildSuggestions = (query: string) => {
    const q = query.toLowerCase();
    const { users = [], tickets = [], reports = [], refunds = [] } = dataCacheRef.current;
    const items: Suggestion[] = [];
    users.forEach((u: any) => {
      items.push({
        id: String(u.id),
        type: 'user',
        title: u.full_name || u.id,
        description: u.email || u.phone,
        route: `/dashboard/users/${u.id}`
      });
    });
    tickets.forEach((t: any) => {
      const ticketId = t.ticket_id ?? t.id;
      items.push({
        id: String(ticketId),
        type: 'ticket',
        title: `Ticket #${ticketId}`,
        description: t.reporter_name ? `Reporter: ${t.reporter_name}` : undefined,
        route: `/dashboard/tickets/${ticketId}`
      });
    });
    reports.forEach((r: any) => {
      items.push({
        id: String(r.id),
        type: 'report',
        title: `Report #${r.id}`,
        description: r.report_reason ? `Reason: ${r.report_reason}` : undefined,
        route: `/dashboard/reports/${r.id}`
      });
    });
    refunds.forEach((rf: any) => {
      items.push({
        id: String(rf.id),
        type: 'refund',
        title: `Refund ${rf.id}`,
        description: rf.user ? `User: ${rf.user}` : undefined,
        route: `/dashboard/refund`
      });
    });
    // Filter: prefer startsWith matches, then includes
    const starts = items.filter(i => i.title.toLowerCase().startsWith(q));
    const includes = items.filter(i => !i.title.toLowerCase().startsWith(q) && (
      i.title.toLowerCase().includes(q) || (i.description && i.description.toLowerCase().includes(q))
    ));
    const ordered = [...starts, ...includes];
    return ordered.slice(0, 8);
  };

  const loadAllData = async () => {
    if (allDataLoaded || loadingSuggestions) return;
    setLoadingSuggestions(true);
    try {
      const [usersRes, ticketsRes, reportsRes, refundsRes] = await Promise.all([
        fetch('/api/users').then(r => r.ok ? r.json() : Promise.reject(r.statusText)).catch(() => ({ data: [] })),
        fetch('/api/tickets').then(r => r.ok ? r.json() : Promise.reject(r.statusText)).catch(() => ({ data: [] })),
        fetch('/api/reports').then(r => r.ok ? r.json() : Promise.reject(r.statusText)).catch(() => ({ data: [] })),
        fetch('/api/refunds').then(r => r.ok ? r.json() : Promise.reject(r.statusText)).catch(() => ({ data: [] })),
      ]);
      dataCacheRef.current = {
        users: usersRes.data || [],
        tickets: ticketsRes.data || [],
        reports: reportsRes.data || [],
        refunds: refundsRes.data || [],
      };
      setAllDataLoaded(true);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Update suggestions when query changes
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSuggestions([]);
      setActiveIndex(-1);
      setShowSuggestions(false);
      return;
    }
    // Lazy load on first needed
    if (!allDataLoaded) {
      loadAllData().then(() => {
        setSuggestions(buildSuggestions(searchQuery));
        setShowSuggestions(true);
      });
    } else {
      setSuggestions(buildSuggestions(searchQuery));
      setShowSuggestions(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

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

  // Keyboard shortcuts for focusing / clearing / navigating suggestions
  useEffect(() => {
    const onKeyDown = (ev: KeyboardEvent) => {
      // Focus search with '/' or Ctrl/Cmd+K
      if (
        (!ev.ctrlKey && !ev.metaKey && ev.key === "/") ||
        ((ev.ctrlKey || ev.metaKey) && (ev.key.toLowerCase() === "k"))
      ) {
        ev.preventDefault();
        searchInputRef.current?.focus();
      }
      // Clear search on Escape when focused
      if (ev.key === "Escape" && document.activeElement === searchInputRef.current) {
        setSearchQuery("");
        setShowSuggestions(false);
        setActiveIndex(-1);
      }
      if (document.activeElement === searchInputRef.current && showSuggestions && suggestions.length > 0) {
        if (ev.key === 'ArrowDown') {
          ev.preventDefault();
          setActiveIndex(i => (i + 1) % suggestions.length);
        } else if (ev.key === 'ArrowUp') {
          ev.preventDefault();
          setActiveIndex(i => (i <= 0 ? suggestions.length - 1 : i - 1));
        } else if (ev.key === 'Enter' && activeIndex >= 0) {
          ev.preventDefault();
            const sel = suggestions[activeIndex];
            router.push(sel.route);
            setShowSuggestions(false);
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showSuggestions, suggestions, activeIndex, router]);

  const handleSignOut = async () => {
    try {
      setShowDropdown(false);
      // Clear all Clerk session data
      await signOut({ redirectUrl: '/login' });
      // Clear browser storage
      localStorage.clear();
      sessionStorage.clear();
      // Force page reload to clear any cached session state
      window.location.href = '/login';
    } catch (error) {
      console.error('Sign out error:', error);
      // Fallback: clear storage and redirect
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/login';
    }
  };

  return (
    <div className="w-full flex flex-row items-center justify-end gap-2 sm:gap-0 mb-6 relative">
      <div className="flex items-center gap-3 ml-2 flex-shrink-0">
        <form onSubmit={handleSearch} className="relative min-w-0 max-w-xs xs:max-w-sm sm:max-w-md lg:max-w-lg" onBlur={(e) => {
          // Delay to allow click events
          setTimeout(() => {
            if (!e.currentTarget.contains(document.activeElement)) {
              setShowSuggestions(false);
              setActiveIndex(-1);
            }
          }, 120);
        }}>
          <button
            type="submit"
            aria-label="Search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
            title="Search"
          >
            <FiSearch size={18} />
          </button>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search by name, ID, email, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#252540] text-white pl-10 pr-10 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base"
            onFocus={() => {
              if (searchQuery.trim()) {
                if (!allDataLoaded) loadAllData();
                setSuggestions(buildSuggestions(searchQuery));
                setShowSuggestions(true);
              }
            }}
          />
          {searchQuery && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
              title="Clear"
            >
              <FiX size={16} />
            </button>
          )}
          {showSuggestions && (suggestions.length > 0 || loadingSuggestions) && (
            <ul
              role="listbox"
              className="absolute mt-2 left-0 w-full max-h-80 overflow-auto rounded-md bg-[#1d1d31] border border-[#29294d] shadow-xl z-50 text-sm divide-y divide-[#29294d]"
            >
              {loadingSuggestions && (
                <li className="px-4 py-3 text-[#b3b3c6]">Loading...</li>
              )}
              {!loadingSuggestions && suggestions.map((s, idx) => (
                <li key={`${s.type}-${s.id}`}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={idx === activeIndex}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onMouseDown={(e) => { e.preventDefault(); }}
                    onClick={() => {
                      router.push(s.route);
                      setShowSuggestions(false);
                    }}
                    className={`w-full text-left px-4 py-2 flex flex-col gap-0.5 hover:bg-[#252540] transition ${idx === activeIndex ? 'bg-[#252540]' : ''}`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="uppercase text-[10px] tracking-wide px-1.5 py-0.5 rounded bg-[#29294d] text-[#b3b3c6]">{s.type}</span>
                      <span className="text-white font-medium truncate">{s.title}</span>
                    </span>
                    {s.description && (
                      <span className="text-[#8b8ba3] text-xs truncate">{s.description}</span>
                    )}
                  </button>
                </li>
              ))}
              {!loadingSuggestions && suggestions.length === 0 && (
                <li className="px-4 py-3 text-[#b3b3c6]">No matches</li>
              )}
              {!loadingSuggestions && suggestions.length > 0 && (
                <li className="px-4 py-2 text-[10px] uppercase tracking-wide text-[#555575] bg-[#1a1a29]">Enter to open • Esc to close</li>
              )}
            </ul>
          )}
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