"use client";
import { useState, useEffect } from "react";
import { useSignIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { FiMail, FiLock, FiEye, FiEyeOff, FiLoader } from "react-icons/fi";

export default function CustomSignIn() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { user } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Redirect if user is already signed in
  useEffect(() => {
    if (user) {
      router.replace('/dashboard');
    }
  }, [user, router]);

  const clearSession = async () => {
    try {
      await fetch('/api/auth/clear-session', { method: 'POST' });
      // Clear local storage
      localStorage.clear();
      sessionStorage.clear();
      // Reload page to ensure clean state
      window.location.reload();
    } catch (error) {
      console.error('Failed to clear session:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setIsLoading(true);
    setError("");

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace("/dashboard");
      }
    } catch (err: any) {
      // If session conflict, offer to clear session
      if (err.errors?.[0]?.code === "session_exists" || 
          err.errors?.[0]?.message?.includes("session")) {
        setError("Session conflict detected. Please clear your session and try again.");
      } else {
        setError(err.errors?.[0]?.message || "Sign in failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f1a] via-[#131322] to-[#1a1a2e] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-2xl mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome to OnTime
          </h1>
          <p className="text-[#b3b3c6] text-lg">
            Sign in to access the moderator dashboard
          </p>
        </div>

        {/* Sign In Form */}
        <div className="bg-[#1e1e2f] rounded-2xl shadow-2xl border border-[#29294d] p-8 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-[#b3b3c6] font-medium text-sm mb-2">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8b8ba3]" size={18} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#252540] border border-[#29294d] text-white placeholder-[#8b8ba3] pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-[#6366f1] transition-all duration-200"
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-[#b3b3c6] font-medium text-sm mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8b8ba3]" size={18} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#252540] border border-[#29294d] text-white placeholder-[#8b8ba3] pl-10 pr-12 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-[#6366f1] transition-all duration-200"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8b8ba3] hover:text-white transition-colors"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
                {error.includes("Session conflict") && (
                  <button
                    onClick={clearSession}
                    className="mt-2 text-blue-400 hover:text-blue-300 underline text-sm"
                  >
                    Clear Session & Reload
                  </button>
                )}
              </div>
            )}

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#5b5bd6] hover:to-[#7c3aed] disabled:from-[#4b5563] disabled:to-[#6b7280] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <FiLoader className="animate-spin" size={18} />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#29294d]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-[#1e1e2f] px-4 text-[#b3b3c6]">Or continue with</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-[#8b8ba3] text-sm">
            Secure authentication powered by{" "}
            <span className="text-[#6366f1] font-semibold">OnTime</span>
          </p>
          <div className="flex items-center justify-center mt-4 space-x-4 text-xs text-[#6b7280]">
            <span>Protected by enterprise-grade security</span>
          </div>
        </div>
      </div>
    </div>
  );
}
