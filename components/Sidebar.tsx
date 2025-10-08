"use client";
import { useState } from "react";
import Image from 'next/image';
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutGrid,
  AlertTriangle,
  Users,
  Settings,
  Menu,
  X,
  Gift,
  DollarSign,
  Ticket,
} from "lucide-react";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const links = [
    { name: "Issues Ticket", href: "/dashboard/tickets", icon: Ticket, color: "text-blue-400", bgColor: "bg-blue-500/10" },
    { name: "Reports", href: "/dashboard/reports", icon: AlertTriangle, color: "text-red-400", bgColor: "bg-red-500/10" },
    { name: "Users", href: "/dashboard/users", icon: Users, color: "text-purple-400", bgColor: "bg-purple-500/10" },
    { name: "Rewards", href: "/dashboard/reward", icon: Gift, color: "text-pink-400", bgColor: "bg-pink-500/10" },
    { name: "Refund", href: "/dashboard/refund", icon: DollarSign, color: "text-emerald-400", bgColor: "bg-emerald-500/10" },
    { name: "Settings", href: "/dashboard/settings", icon: Settings, color: "text-indigo-400", bgColor: "bg-indigo-500/10" },
  ];

  const handleNav = (href: string) => {
    router.push(href);
    setOpen(false);
  };

  const renderLinks = () =>
    links.map((link) => {
      const active = pathname.startsWith(link.href);
      const IconComponent = link.icon;
      return (
        <li key={link.name}>
          <button
            onClick={() => handleNav(link.href)}
            className={`group flex items-center gap-4 px-4 py-3.5 w-full text-left rounded-xl font-medium text-sm transition-all duration-300
              ${active
                ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white shadow-lg shadow-indigo-500/10"
                : "text-[#b3b3c6] hover:text-white hover:bg-[#252540]/80 hover:shadow-md"}`}
          >
            <div className={`flex-shrink-0 ${active ? link.color : 'text-[#6d6d85] group-hover:' + link.color} transition-colors duration-300`}>
              <IconComponent className="w-5 h-5" strokeWidth={2} />
            </div>
            <span className="tracking-wide">{link.name}</span>
          </button>
        </li>
      );
    });

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden bg-[#252540] text-white p-2.5 rounded-lg shadow-lg border border-[#29294d] hover:bg-[#2a2a55] transition-all duration-300"
        onClick={() => setOpen(true)}
        aria-label="Open sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-screen bg-[#1e1e2f] p-5 border-r border-[#29294d] z-40 fixed">
        <button
          onClick={() => handleNav('/dashboard')}
          className="flex items-center gap-3 mb-8 p-2 rounded-xl hover:bg-[#252540]/50 transition-all duration-300 group"
          aria-label="OnTime dashboard home"
        >
          <div className="w-10 h-10 relative rounded-lg overflow-hidden shadow-md bg-white flex-shrink-0">
            <Image
              src="/ontime_logo.png"
              alt="OnTime Logo"
              fill
              sizes="40px"
              priority
              className="object-contain p-1"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-white tracking-wide">
              OnTime
            </span>
            <span className="text-[10px] text-[#6d6d85] font-medium">Moderator Panel</span>
          </div>
        </button>
        
        <div className="mb-3 px-3">
          <span className="text-[10px] font-bold text-[#6d6d85] uppercase tracking-wider">Navigation</span>
        </div>
        
        <ul className="flex-1 space-y-1.5">
          {renderLinks()}
        </ul>
      </aside>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Sidebar overlay"
        ></div>
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#1e1e2f] p-5 z-50 transform transition-transform duration-300 ease-in-out border-r border-[#29294d]
          ${open ? "translate-x-0" : "-translate-x-full"} lg:hidden`}
      >
        <button
          className="absolute top-4 right-4 text-white bg-[#252540] hover:bg-red-500/20 p-2 rounded-lg transition-all duration-300 border border-[#29294d]"
          onClick={() => setOpen(false)}
          aria-label="Close sidebar"
        >
          <X className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => handleNav('/dashboard')}
          className="flex items-center gap-3 mb-8 mt-2 p-2 rounded-xl hover:bg-[#252540]/50 transition-all duration-300"
          aria-label="OnTime dashboard home"
        >
          <div className="w-10 h-10 relative rounded-lg overflow-hidden shadow-md bg-white flex-shrink-0">
            <Image
              src="/ontime_logo.png"
              alt="OnTime Logo"
              fill
              sizes="40px"
              className="object-contain p-1"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-white tracking-wide">
              OnTime
            </span>
            <span className="text-[10px] text-[#6d6d85] font-medium">Moderator Panel</span>
          </div>
        </button>
        
        <div className="mb-3 px-3">
          <span className="text-[10px] font-bold text-[#6d6d85] uppercase tracking-wider">Navigation</span>
        </div>
        
        <ul className="space-y-1.5 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
          {renderLinks()}
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;