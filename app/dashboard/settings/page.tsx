"use client";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { SignOutButton, SignedIn, SignedOut, RedirectToSignIn, useUser } from "@clerk/nextjs";
import { LogOut, Save, User, Settings as SettingsIcon, Bell, Globe, Clock, Camera, Trash2, Edit, X, Check } from "lucide-react";

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
        <div className="min-h-screen bg-[#23233a] p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Header Card */}
            <div className="relative bg-gradient-to-br from-[#1f1f33] to-[#252540] rounded-2xl border border-[#29294d] p-6 sm:p-8 shadow-xl overflow-hidden">
              {/* Gradient Glow Effects */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl -z-10"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-500/20 to-indigo-500/20 rounded-full blur-3xl -z-10"></div>

              <div className="flex items-start justify-between gap-4 relative z-10">
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/30">
                    <SettingsIcon className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-400" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">Settings</h1>
                    <p className="text-[#e0e0e0] text-sm sm:text-base">Manage your account and system preferences</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">

            {/* Profile Settings */}
            <div className="flex-1 bg-gradient-to-br from-[#1f1f33] to-[#252540] rounded-2xl border border-[#29294d] p-6 sm:p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-indigo-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Profile Settings</h2>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-6 p-6 bg-[#1f1f33] rounded-2xl border border-[#29294d]">
                <div className="rounded-full w-24 h-24 bg-[#252540] flex items-center justify-center overflow-hidden border-2 border-[#29294d] shadow-lg">
                  {profileImg ? (
                    <Image
                      src={profileImg}
                      alt="profile"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="w-10 h-10 text-[#9ca3af]" />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handlePhotoChange}
                />
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button
                    className={`px-5 py-2.5 rounded-xl text-white font-semibold shadow transition-all duration-300 text-sm flex items-center justify-center gap-2 ${isEditing ? 'bg-indigo-500 hover:bg-indigo-600 hover:scale-105 shadow-indigo-500/30' : 'bg-[#2a2a4a] cursor-not-allowed opacity-50'}`}
                    onClick={handlePhotoClick}
                    type="button"
                    disabled={!isEditing}
                  >
                    <Camera className="w-4 h-4" />
                    Upload Photo
                  </button>
                  <button
                    className={`border px-5 py-2.5 rounded-xl text-white font-semibold shadow transition-all duration-300 text-sm flex items-center justify-center gap-2 ${isEditing ? 'bg-[#1f1f33] border-red-500/50 text-red-400 hover:bg-red-500/10 hover:scale-105' : 'bg-[#2a2a4a] border-[#3a3a5a] cursor-not-allowed opacity-50'}`}
                    onClick={handleRemovePhoto}
                    type="button"
                    disabled={!isEditing}
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[#9ca3af] mb-2 text-sm font-medium uppercase tracking-wide">First Name</label>
                  <input
                    className={`w-full bg-[#1f1f33] text-[#e0e0e0] rounded-xl px-4 py-3 border border-[#29294d] focus:border-indigo-500/50 focus:outline-none transition-colors ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-[#9ca3af] mb-2 text-sm font-medium uppercase tracking-wide">Last Name</label>
                  <input
                    className={`w-full bg-[#1f1f33] text-[#e0e0e0] rounded-xl px-4 py-3 border border-[#29294d] focus:border-indigo-500/50 focus:outline-none transition-colors ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-[#9ca3af] mb-2 text-sm font-medium uppercase tracking-wide">Email</label>
                <input
                  className={`w-full bg-[#1f1f33] text-[#e0e0e0] rounded-xl px-4 py-3 border border-[#29294d] focus:border-indigo-500/50 focus:outline-none transition-colors ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="mb-6">
                <label className="block text-[#9ca3af] mb-2 text-sm font-medium uppercase tracking-wide">Bio</label>
                <textarea
                  className={`w-full bg-[#1f1f33] text-[#e0e0e0] rounded-xl px-4 py-3 border border-[#29294d] focus:border-indigo-500/50 focus:outline-none transition-colors ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  rows={3}
                  style={{ minHeight: "80px", maxHeight: "160px" }}
                  placeholder="Write a short bio..."
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              
              {/* Edit / Save / Cancel Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#1f1f33] rounded-2xl border border-[#29294d]">
                <div className="flex gap-3 w-full sm:w-auto">
                  {!isEditing ? (
                    <button
                      onClick={startEditing}
                      type="button"
                      className="flex-1 sm:flex-none bg-indigo-500 hover:bg-indigo-600 hover:scale-105 px-6 py-3 rounded-xl text-white font-semibold shadow-lg shadow-indigo-500/30 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Details
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={cancelEditing}
                        type="button"
                        className="flex-1 sm:flex-none bg-[#252540] hover:bg-[#2a2a55] hover:scale-105 px-5 py-3 rounded-xl text-white font-semibold shadow transition-all duration-300 flex items-center justify-center gap-2 border border-[#29294d]"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveSettings}
                        disabled={isSaving}
                        className="flex-1 sm:flex-none bg-green-500 hover:bg-green-600 hover:scale-105 disabled:bg-[#4b5563] disabled:cursor-not-allowed px-6 py-3 rounded-xl text-white font-semibold shadow-lg shadow-green-500/30 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        {isSaving ? "Saving..." : "Save Changes"}
                      </button>
                    </>
                  )}
                </div>
                {saveMessage && (
                  <div className={`flex items-center gap-2 text-sm font-medium ${saveMessage.includes("success") ? "text-green-400" : "text-red-400"}`}>
                    {saveMessage.includes("success") ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    {saveMessage}
                  </div>
                )}
              </div>
            </div>

            {/* Preferences */}
            <div className="w-full lg:w-96 space-y-6">
              {/* Preferences Card */}
              <div className="bg-gradient-to-br from-[#1f1f33] to-[#252540] rounded-2xl border border-[#29294d] p-6 sm:p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <SettingsIcon className="w-5 h-5 text-purple-400" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Preferences</h2>
                </div>
                
                <div className="space-y-6">
                  {/* Notifications */}
                  <div className="p-4 bg-[#1f1f33] rounded-xl border border-[#29294d]">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <Bell className="w-4 h-4 text-blue-400" />
                        </div>
                        <span className="font-semibold text-white">Notifications</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNotify(!notify)}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none shadow-inner ${
                          notify ? "bg-indigo-500" : "bg-[#252540]"
                        }`}
                        aria-pressed={notify}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${
                            notify ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                    <span className="text-[#9ca3af] text-xs">Receive push notifications</span>
                  </div>

                  {/* Language */}
                  <div>
                    <label className="flex items-center gap-2 text-[#9ca3af] mb-3 text-sm font-medium uppercase tracking-wide">
                      <Globe className="w-4 h-4" />
                      Language
                    </label>
                    <select
                      className="w-full bg-[#1f1f33] text-[#e0e0e0] rounded-xl px-4 py-3 border border-[#29294d] focus:border-indigo-500/50 focus:outline-none transition-colors"
                      value={language}
                      onChange={e => setLanguage(e.target.value)}
                    >
                      <option>English (US)</option>
                      <option>Thai (TH)</option>
                      <option>Spanish (ES)</option>
                    </select>
                  </div>

                  {/* Timezone */}
                  <div>
                    <label className="flex items-center gap-2 text-[#9ca3af] mb-3 text-sm font-medium uppercase tracking-wide">
                      <Clock className="w-4 h-4" />
                      Timezone
                    </label>
                    <select
                      className="w-full bg-[#1f1f33] text-[#e0e0e0] rounded-xl px-4 py-3 border border-[#29294d] focus:border-indigo-500/50 focus:outline-none transition-colors"
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

              {/* Account Actions Card */}
              <div className="bg-gradient-to-br from-[#1f1f33] to-[#252540] rounded-2xl border border-[#29294d] p-6 sm:p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Account Actions</h3>
                </div>
                
                <div className="bg-[#1f1f33] p-5 rounded-xl border border-[#29294d]">
                  <p className="text-[#9ca3af] text-sm mb-4">
                    Signed in as <span className="text-white font-semibold">{user?.fullName || "User"}</span>
                  </p>
                  <SignOutButton redirectUrl="/login">
                    <button
                      type="button"
                      className="w-full bg-red-500 hover:bg-red-600 hover:scale-105 px-5 py-3 rounded-xl text-white font-semibold shadow-lg shadow-red-500/30 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </SignOutButton>
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