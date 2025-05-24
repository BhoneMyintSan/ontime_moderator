"use client";
import { useState } from "react";

export default function Settings() {
  const [notify, setNotify] = useState(true);
  const [language, setLanguage] = useState("English (US)");
  const [timezone, setTimezone] = useState("Pacific Time (PT)");
  const [firstName, setFirstName] = useState("Jhon");
  const [lastName, setLastName] = useState("Morrison");
  const [email, setEmail] = useState("Jhon.morri@gmail.com");
  const [bio, setBio] = useState("");

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <h1 className="text-3xl font-bold text-white mb-1">Settings</h1>
      <p className="text-[#b3b3c6] mb-8">Manage your account and system preferences</p>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Profile Settings */}
        <div className="flex-1 bg-[#23233a] rounded-2xl p-8 mb-8 lg:mb-0">
          <h2 className="text-xl font-bold text-white mb-6">Profile Settings</h2>
          <div className="flex items-center gap-6 mb-6">
            <img
              src="https://i.pravatar.cc/80"
              alt="profile"
              className="rounded-xl w-20 h-20 object-cover"
            />
            <div className="flex gap-3">
              <button className="bg-[#6366f1] hover:bg-[#4f46e5] px-5 py-2 rounded-lg text-white font-semibold shadow transition">
                Upload New Photo
              </button>
              <button className="bg-[#23233a] border border-[#444] px-5 py-2 rounded-lg text-white font-semibold shadow transition">
                Remove
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[#b3b3c6] mb-1">First Name</label>
              <input
                className="w-full bg-[#18182c] text-white rounded-lg px-4 py-2 mb-2"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[#b3b3c6] mb-1">Last Name</label>
              <input
                className="w-full bg-[#18182c] text-white rounded-lg px-4 py-2 mb-2"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-[#b3b3c6] mb-1">Email</label>
            <input
              className="w-full bg-[#18182c] text-white rounded-lg px-4 py-2 mb-2"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[#b3b3c6] mb-1">Bio</label>
            <textarea
              className="w-full bg-[#18182c] text-white rounded-lg px-4 py-2"
              rows={2}
              placeholder="Write a short bio..."
              value={bio}
              onChange={e => setBio(e.target.value)}
            />
          </div>
        </div>
        {/* Preferences */}
        <div className="w-full lg:w-96 bg-[#23233a] rounded-2xl p-8 h-fit">
          <h2 className="text-xl font-bold text-white mb-4">Preferences</h2>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-white">Notifications</span>
              {/* Fixed notification slider */}
              <button
                type="button"
                onClick={() => setNotify(!notify)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  notify ? "bg-blue-600" : "bg-gray-600"
                }`}
                aria-pressed={notify}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                    notify ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <span className="text-[#b3b3c6] text-sm">Receive Notification</span>
          </div>
          <div className="mb-4">
            <label className="block text-[#b3b3c6] mb-1">Language</label>
            <select
              className="w-full bg-[#18182c] text-white rounded-lg px-4 py-2"
              value={language}
              onChange={e => setLanguage(e.target.value)}
            >
              <option>English (US)</option>
              <option>Thai (TH)</option>
              <option>Spanish (ES)</option>
            </select>
          </div>
          <div>
            <label className="block text-[#b3b3c6] mb-1">Timezone</label>
            <select
              className="w-full bg-[#18182c] text-white rounded-lg px-4 py-2"
              value={timezone}
              onChange={e => setTimezone(e.target.value)}
            >
              <option>Pacific Time (PT)</option>
              <option>Eastern Time (ET)</option>
              <option>Central European Time (CET)</option>
            </select>
          </div>
        </div>
      </div>
      {/* Danger Zone */}
      <div className="bg-[#23233a] rounded-2xl p-8 mt-8">
        <h2 className="text-xl font-bold text-white mb-2">Danger Zone</h2>
        <div className="mb-4">
          <span className="font-semibold text-white">Delete Account</span>
          <p className="text-[#b3b3c6] text-sm">Permanently delete your account and all data</p>
        </div>
        <button className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg float-right transition">
          Delete Account
        </button>
      </div>
    </div>
  );
}