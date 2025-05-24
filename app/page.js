"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#23233a] px-4">
      <div className="bg-[#1e1e2f] rounded-2xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 text-center">
          Welcome to OnTime Moderator
        </h1>
        <p className="text-[#b3b3c6] mb-8 text-center max-w-md">
          Manage your community, volunteers, and reports efficiently.
          <br />
          Get started by logging in to your account.
        </p>
        <button
          className="bg-[#6366f1] hover:bg-[#4f46e5] px-8 py-3 rounded-lg text-white font-semibold text-lg shadow transition w-full"
          onClick={() => router.push("/login")}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export function DashboardHome() {
  return (
    <div className="text-2xl sm:text-3xl font-bold text-center mt-32 sm:mt-40 px-2">
      Welcome to the OnTime Moderator Panel
    </div>
  );
}
