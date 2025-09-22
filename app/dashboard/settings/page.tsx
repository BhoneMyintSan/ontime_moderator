"use client";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { SignOutButton, SignedIn, SignedOut, RedirectToSignIn, useUser } from "@clerk/nextjs";
import { FiLogOut, FiSave, FiUser } from "react-icons/fi";

export default function Settings() {
  const { user } = useUser();
  const [notify, setNotify] = useState(true);
  const [language, setLanguage] = useState("English (US)");
  const [timezone, setTimezone] = useState("Pacific Time (PT)");
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<{ firstName: string; lastName: string; email: string; bio: string; profileImg: string } | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load user data from Clerk
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.emailAddresses?.[0]?.emailAddress || "");
      setProfileImg(user.imageUrl || "");
    }
  }, [user]);

  // Load saved preferences
  useEffect(() => {
    const savedImg = window.localStorage.getItem("profileImg");
    const savedBio = window.localStorage.getItem("userBio");
    const savedNotify = window.localStorage.getItem("notifications");
    const savedLang = window.localStorage.getItem("language");
    const savedTz = window.localStorage.getItem("timezone");
    
    if (savedImg) setProfileImg(savedImg);
    if (savedBio) setBio(savedBio);
    if (savedNotify) setNotify(savedNotify === "true");
    if (savedLang) setLanguage(savedLang);
    if (savedTz) setTimezone(savedTz);
  }, []);

  const handlePhotoClick = () => fileInputRef.current?.click();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result;
        if (typeof result === 'string') {
          setProfileImg(result);
          window.localStorage.setItem("profileImg", result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setProfileImg("");
    window.localStorage.removeItem("profileImg");
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSaveMessage("");
    
    try {
      // Save preferences to localStorage
      window.localStorage.setItem("userBio", bio);
      window.localStorage.setItem("notifications", notify.toString());
      window.localStorage.setItem("language", language);
      window.localStorage.setItem("timezone", timezone);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveMessage("Settings saved successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
      setIsEditing(false);
      setDraft(null);
    } catch (error) {
      setSaveMessage("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const startEditing = () => {
    setDraft({ firstName, lastName, email, bio, profileImg });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    if (draft) {
      setFirstName(draft.firstName);
      setLastName(draft.lastName);
      setEmail(draft.email);
      setBio(draft.bio);
      setProfileImg(draft.profileImg);
    }
    setIsEditing(false);
    setDraft(null);
  };

  return (
    <>
      <SignedOut>
        <RedirectToSignIn redirectUrl="/login" />
      </SignedOut>
      <SignedIn>
        <div className="max-w-6xl mx-auto mt-10 px-2 sm:px-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Settings</h1>
          <p className="text-[#b3b3c6] mb-8">Manage your account and system preferences</p>
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Profile Settings */}
            <div className="flex-1 bg-[#23233a] rounded-2xl p-4 sm:p-8 mb-8 lg:mb-0">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-6">Profile Settings</h2>
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
                <div className="rounded-full w-20 h-20 bg-[#18182c] flex items-center justify-center overflow-hidden border-2 border-[#444]">
                  {profileImg ? (
                    <Image
                      src={profileImg}
                      alt="profile"
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[#444] text-5xl select-none flex items-center justify-center w-full h-full" style={{ lineHeight: "1" }}>
                      +
                    </span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handlePhotoChange}
                />
                <div className="flex gap-3">
                  <button
                    className={`px-4 sm:px-5 py-2 rounded-lg text-white font-semibold shadow transition text-xs sm:text-base ${isEditing ? 'bg-[#6366f1] hover:bg-[#4f46e5]' : 'bg-[#2a2a4a] cursor-not-allowed'}`}
                    onClick={handlePhotoClick}
                    type="button"
                    disabled={!isEditing}
                  >
                    Upload New Photo
                  </button>
                  <button
                    className={`border px-4 sm:px-5 py-2 rounded-lg text-white font-semibold shadow transition text-xs sm:text-base ${isEditing ? 'bg-[#23233a] border-[#444] hover:bg-[#252540]' : 'bg-[#2a2a4a] border-[#3a3a5a] cursor-not-allowed'}`}
                    onClick={handleRemovePhoto}
                    type="button"
                    disabled={!isEditing}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[#b3b3c6] mb-1">First Name</label>
                  <input
                    className={`w-full bg-[#18182c] text-white rounded-lg px-4 py-2 mb-2 ${!isEditing ? 'opacity-70' : ''}`}
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-[#b3b3c6] mb-1">Last Name</label>
                  <input
                    className={`w-full bg-[#18182c] text-white rounded-lg px-4 py-2 mb-2 ${!isEditing ? 'opacity-70' : ''}`}
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-[#b3b3c6] mb-1">Email</label>
                <input
                  className={`w-full bg-[#18182c] text-white rounded-lg px-4 py-2 mb-2 ${!isEditing ? 'opacity-70' : ''}`}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="mb-6">
                <label className="block text-[#b3b3c6] mb-1">Bio</label>
                <textarea
                  className={`w-full bg-[#18182c] text-white rounded-lg px-4 py-2 ${!isEditing ? 'opacity-70' : ''}`}
                  rows={2}
                  style={{ minHeight: "48px", maxHeight: "160px" }}
                  placeholder="Write a short bio..."
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              
              {/* Edit / Save / Cancel Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  {!isEditing ? (
                    <button
                      onClick={startEditing}
                      type="button"
                      className="bg-[#23233a] border border-[#444] hover:bg-[#252540] px-6 py-2 rounded-lg text-white font-semibold shadow transition"
                    >
                      Edit Details
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={cancelEditing}
                        type="button"
                        className="bg-[#2a2a4a] hover:bg-[#34345a] px-5 py-2 rounded-lg text-white font-semibold shadow transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveSettings}
                        disabled={isSaving}
                        className="bg-[#6366f1] hover:bg-[#4f46e5] disabled:bg-[#4b5563] px-6 py-2 rounded-lg text-white font-semibold shadow transition flex items-center gap-2"
                      >
                        <FiSave size={16} />
                        {isSaving ? "Saving..." : "Save Changes"}
                      </button>
                    </>
                  )}
                </div>
                {saveMessage && (
                  <span className={`text-sm ${saveMessage.includes("success") ? "text-green-400" : "text-red-400"}`}>
                    {saveMessage}
                  </span>
                )}
              </div>
            </div>

            {/* Preferences */}
            <div className="w-full lg:w-96 bg-[#23233a] rounded-2xl p-4 sm:p-8 h-fit">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Preferences</h2>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">Notifications</span>
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
              <div className="mt-8 space-y-4">
                <div className="border-t border-[#29294d] pt-6">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <FiUser size={16} />
                    Account Actions
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-[#18182c] p-4 rounded-lg border border-[#29294d]">
                      <p className="text-[#b3b3c6] text-sm mb-3">
                        Signed in as <span className="text-white font-medium">{user?.fullName || "User"}</span>
                      </p>
                      <SignOutButton redirectUrl="/login">
                        <button
                          type="button"
                          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white font-semibold shadow transition flex items-center gap-2 text-sm"
                        >
                          <FiLogOut size={16} />
                          Sign Out
                        </button>
                      </SignOutButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SignedIn>
    </>
  );
}