"use client";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  FiGrid,
  FiFileText,
  FiUsers,
  FiSettings,
  FiUserCheck,
  FiMenu,
  FiX,
} from "react-icons/fi";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const links = [
    { name: "Ticket", href: "/dashboard/tickets", icon: <FiGrid /> },
    { name: "Reports", href: "/dashboard/reports", icon: <FiFileText /> },
    { name: "Volunteer ships", href: "/dashboard/volunteerships", icon: <FiUserCheck /> },
    { name: "Users", href: "/dashboard/users", icon: <FiUsers /> },
    { name: "Refund", href: "/dashboard/refund", icon: <FiFileText /> },
    { name: "Settings", href: "/dashboard/settings", icon: <FiSettings /> },
  ];

  const handleNav = (href) => {
    router.push(href);
    setOpen(false);
  };

  const renderLinks = () =>
    links.map((link) => {
      const active = pathname.startsWith(link.href);
      return (
        <li key={link.name}>
          <button
            onClick={() => handleNav(link.href)}
            className={`group flex items-center gap-3 px-4 py-2 w-full text-left rounded-lg font-medium text-sm transition
              ${active
                ? "bg-purple-600/20 text-white border-l-4 border-blue-500"
                : "text-[#b3b3c6] hover:text-white hover:bg-[#29294d]/50"}`
            }
          >
            <span className="text-lg text-blue-400 group-hover:text-purple-300">{link.icon}</span>
            <span>{link.name}</span>
          </button>
        </li>
      );
    });

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden bg-[#1e1e2f] text-white p-2 rounded-full shadow-lg ring-1 ring-white/10"
        onClick={() => setOpen(true)}
        aria-label="Open sidebar"
      >
        <FiMenu size={20} />
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-screen bg-[#1e1e2f] p-6 border-r border-[#29294d] z-40 fixed">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-blue-500 rounded-full w-10 h-10 flex items-center justify-center text-white text-xl font-bold shadow-inner">
            ⏰
          </div>
          <span className="text-xl font-semibold text-white">OnTime</span>
        </div>
        <ul className="flex-1 space-y-2">{renderLinks()}</ul>
      </aside>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Sidebar overlay"
        ></div>
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#1e1e2f] p-6 z-50 transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"} lg:hidden`}
      >
        <button
          className="absolute top-4 right-4 text-white"
          onClick={() => setOpen(false)}
          aria-label="Close sidebar"
        >
          <FiX size={22} />
        </button>
        <div className="flex items-center gap-3 mb-8 mt-2">
          <div className="bg-blue-500 rounded-full w-10 h-10 flex items-center justify-center text-white text-xl font-bold">
          </div>
          <span className="text-xl font-semibold text-white">OnTime</span>
        </div>
        <ul className="space-y-2">{renderLinks()}</ul>
      </aside>
    </>
  );
};

export default Sidebar;
