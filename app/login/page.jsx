"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Add authentication logic here
    router.push("/dashboard"); // Redirect to dashboard after login
  };

  return (
    <div className="bg-[#1e1e2f] rounded-2xl shadow-lg p-8 w-full max-w-md">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">Login to OnTime Moderator</h1>
      <form className="space-y-6" onSubmit={handleLogin}>
        <div>
          <label className="block text-[#b3b3c6] mb-2">Email</label>
          <input
            type="email"
            className="w-full bg-[#18182c] text-white px-4 py-3 rounded-lg focus:outline-none"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-[#b3b3c6] mb-2">Password</label>
          <input
            type="password"
            className="w-full bg-[#18182c] text-white px-4 py-3 rounded-lg focus:outline-none"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#6366f1] hover:bg-[#4f46e5] py-3 rounded-lg text-white font-semibold text-lg shadow transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}