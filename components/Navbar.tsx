"use client";
import { Search, X, User, LogOut, Settings } from "lucide-react";
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
  const formRef = useRef<HTMLFormElement>(null);

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
    <div className="w-full flex flex-row items-center justify-end gap-4 mb-6 relative">
      <div className="flex items-center gap-4 flex-shrink-0">
        <form
          ref={formRef}
          onSubmit={handleSearch}
          className="relative w-full max-w-md"
          onBlur={() => {
            const formEl = formRef.current;
            setTimeout(() => {
              try {
                if (!formEl) return;
                const active = document.activeElement as HTMLElement | null;
                if (!active || !formEl.contains(active)) {
                  setShowSuggestions(false);
                  setActiveIndex(-1);
                }
              } catch {
                setShowSuggestions(false);
                setActiveIndex(-1);
              }
            }, 120);
          }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6d6d85]" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search users, tickets, reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#1f1f33] text-[#e0e0e0] placeholder:text-[#6d6d85] pl-10 pr-10 py-2.5 rounded-xl w-full border border-[#29294d] focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all duration-300"
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6d6d85] hover:text-white transition-colors"
                title="Clear"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {showSuggestions && (suggestions.length > 0 || loadingSuggestions) && (
            <ul
              role="listbox"
              className="absolute mt-2 left-0 w-full max-h-96 overflow-auto rounded-xl bg-[#1f1f33] border border-[#29294d] shadow-2xl z-[60] text-sm"
            >
              {loadingSuggestions && (
                <li className="px-4 py-3 text-[#9ca3af]">Loading suggestions...</li>
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
                    className={`w-full text-left px-4 py-3 flex flex-col gap-1 transition-colors border-b border-[#29294d] last:border-0 ${idx === activeIndex ? 'bg-[#252540]' : 'hover:bg-[#252540]/50'}`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`uppercase text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md ${
                        s.type === 'user' ? 'bg-purple-500/20 text-purple-300' :
                        s.type === 'ticket' ? 'bg-blue-500/20 text-blue-300' :
                        s.type === 'report' ? 'bg-red-500/20 text-red-300' :
                        'bg-emerald-500/20 text-emerald-300'
                      }`}>{s.type}</span>
                      <span className="text-white font-medium truncate">{s.title}</span>
                    </span>
                    {s.description && (
                      <span className="text-[#9ca3af] text-xs truncate ml-1">{s.description}</span>
                    )}
                  </button>
                </li>
              ))}
              {!loadingSuggestions && suggestions.length === 0 && (
                <li className="px-4 py-3 text-[#9ca3af] text-center">No matches found</li>
              )}
              {!loadingSuggestions && suggestions.length > 0 && (
                <li className="px-4 py-2 text-[10px] uppercase tracking-wide text-[#6d6d85] bg-[#1a1a29] border-t border-[#29294d]">
                  <kbd className="px-1.5 py-0.5 bg-[#252540] rounded text-[9px] mr-1">Enter</kbd> to open • 
                  <kbd className="px-1.5 py-0.5 bg-[#252540] rounded text-[9px] mx-1">Esc</kbd> to close
                </li>
              )}
            </ul>
          )}
        </form>
        
        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            className="relative w-10 h-10 rounded-xl border-2 border-[#29294d] cursor-pointer overflow-hidden bg-gradient-to-br from-[#252540] to-[#1f1f33] flex items-center justify-center hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300"
            onClick={() => setShowDropdown(!showDropdown)}
            title={user?.fullName || "User profile"}
          >
            {profileImg || user?.imageUrl ? (
              <Image
                src={profileImg || user?.imageUrl || ""}
                alt="profile"
                fill
                sizes="40px"
                className="object-cover"
              />
            ) : (
              <span className="text-white text-sm font-bold select-none">
                {user?.firstName?.charAt(0) || user?.emailAddresses?.[0]?.emailAddress?.charAt(0)?.toUpperCase() || "U"}
              </span>
            )}
          </button>
          
          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-72 bg-gradient-to-br from-[#1f1f33] to-[#252540] rounded-2xl shadow-2xl border border-[#29294d] z-[60] overflow-hidden">
              <div className="p-5 border-b border-[#29294d] bg-[#1f1f33]/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center overflow-hidden border border-[#29294d]">
                    {profileImg || user?.imageUrl ? (
                      <Image
                        src={profileImg || user?.imageUrl || ""}
                        alt="profile"
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <User className="w-6 h-6 text-indigo-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-base truncate">{user?.fullName || "User"}</p>
                    <p className="text-[#9ca3af] text-xs truncate">{user?.emailAddresses?.[0]?.emailAddress}</p>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    router.push("/dashboard/settings");
                  }}
                  className="w-full px-4 py-3 text-left text-[#e0e0e0] hover:bg-[#252540] rounded-xl transition-all duration-300 flex items-center gap-3 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 group-hover:bg-indigo-500/20 flex items-center justify-center transition-colors">
                    <Settings className="w-4 h-4 text-indigo-400" />
                  </div>
                  <span className="font-medium">Profile Settings</span>
                </button>
                <button 
                  onClick={handleSignOut}
                  className="w-full px-4 py-3 text-left text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300 flex items-center gap-3 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 flex items-center justify-center transition-colors">
                    <LogOut className="w-4 h-4 text-red-400" />
                  </div>
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-[55]"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default Navbar;