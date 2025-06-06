"use client";
import { useRouter } from "next/navigation";

export default function GetStarted() {
  const router = useRouter();

  return (
    <div className="bg-[#1e1e2f] rounded-2xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 text-center">Welcome to OnTime Moderator</h1>
      <p className="text-[#b3b3c6] mb-8 text-center max-w-md">
        Manage your community, volunteers, and reports efficiently.<br />
        Get started by logging in to your account.
      </p>
      <button
        className="bg-[#6366f1] hover:bg-[#4f46e5] px-8 py-3 rounded-lg text-white font-semibold text-lg shadow transition w-full"
        onClick={() => router.push("/login")}
      >
        Get Started
      </button>
    </div>
  );
}