"use client";
import { useState } from "react";
import { FiGrid, FiFileText, FiUsers, FiSettings, FiUserCheck, FiMenu, FiX } from "react-icons/fi";


const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const links = [
    { name: 'Ticket', href: '/dashboard/tickets', icon: <FiGrid /> },
    { name: 'Reports', href: '/dashboard/reports', icon: <FiFileText /> },
    { name: 'Volunteer ships', href: '/dashboard/volunteerships', icon: <FiUserCheck /> },
    { name: 'Users', href: '/dashboard/users', icon: <FiUsers /> },
    { name: 'Settings', href: '/dashboard/settings', icon: <FiSettings /> },
  ];

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 lg:hidden bg-[#23233a] p-2 rounded-md text-white shadow"
        onClick={() => setOpen(true)}
        aria-label="Open sidebar"
      >
        <FiMenu size={24} />
      </button>

      <aside className="w-64 h-screen fixed bg-[#1e1e2f] p-6 flex-col hidden lg:flex z-40">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-purple-500 rounded-full w-10 h-10 flex items-center justify-center text-white text-2xl font-bold">
            <span>⏰</span>
          </div>
          <span className="text-2xl font-bold text-white">OnTime</span>
        </div>
        <nav className="flex-1">
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg text-[#b3b3c6] hover:bg-[#23233a] hover:text-white transition"
                >
                  <span className="text-lg">{link.icon}</span>
                  <span>{link.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div
        className={`fixed inset-0 z-50 bg-black bg-opacity-40 transition-opacity ${open ? "block" : "hidden"} lg:hidden`}
        onClick={() => setOpen(false)}
        aria-label="Sidebar overlay"
      ></div>
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#1e1e2f] p-6 flex-col z-50 transform transition-transform duration-200 ${open ? "translate-x-0" : "-translate-x-full"
          } lg:hidden`}
      >
        <button
          className="absolute top-4 right-4 text-white"
          onClick={() => setOpen(false)}
          aria-label="Close sidebar"
        >
          <FiX size={24} />
        </button>
        <div className="flex items-center gap-3 mb-10 mt-2">
          <div className="bg-purple-500 rounded-full w-10 h-10 flex items-center justify-center text-white text-2xl font-bold">
            <span>⏰</span>
          </div>
          <span className="text-2xl font-bold text-white">OnTime</span>
        </div>
        <nav className="flex-1">
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg text-[#b3b3c6] hover:bg-[#23233a] hover:text-white transition"
                  onClick={() => setOpen(false)}
                >
                  <span className="text-lg">{link.icon}</span>
                  <span>{link.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
