"use client";
import { SignIn } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function Login() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-[#23233a]/90 backdrop-blur-md flex flex-col items-center">
        <div className="animate-pulse">
          <div className="bg-[#6366f1] rounded-full w-16 h-16 flex items-center justify-center mb-3 shadow-lg">
            <span className="text-3xl font-bold text-white">⏰</span>
          </div>
          <div className="h-8 bg-[#18182c] rounded mb-2"></div>
          <div className="h-4 bg-[#18182c] rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-[#23233a]/90 backdrop-blur-md border border-[#29294d]/50">
        <div className="mb-8 flex flex-col items-center">
          <div className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-full w-16 h-16 flex items-center justify-center mb-4 shadow-lg transform hover:scale-105 transition-transform">
            <span className="text-3xl font-bold text-white">⏰</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 text-center">
            OnTime Moderator
          </h1>
          <p className="text-[#b3b3c6] text-center text-base leading-relaxed">
            Welcome back! Sign in to manage your community, volunteers, and reports.
          </p>
        </div>
        
        <SignIn
          redirectUrl="/dashboard"
          appearance={{
            variables: {
              colorPrimary: "#6366f1",
              colorBackground: "#23233a",
              colorInputBackground: "#18182c",
              colorInputText: "#e6e6f0",
              colorText: "#e6e6f0",
              colorTextSecondary: "#b3b3c6",
              borderRadius: "0.75rem",
              fontSize: "16px",
              fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
              colorDanger: "#ef4444",
              colorSuccess: "#10b981",
            },
            elements: {
              card: "bg-transparent border-none shadow-none rounded-2xl",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              formButtonPrimary:
                "bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#4f46e5] hover:to-[#7c3aed] text-white font-semibold rounded-lg py-3 mt-6 transition-all duration-200 w-full shadow-lg hover:shadow-xl transform hover:scale-[1.02]",
              formFieldInput:
                "bg-[#18182c] text-white placeholder-[#b3b3c6] rounded-lg px-4 py-3 border border-[#29294d] focus:ring-2 focus:ring-[#6366f1] focus:border-transparent w-full transition-all duration-200",
              formFieldLabel: "text-[#e6e6f0] font-semibold mb-2",
              formFieldHintText: "text-[#b3b3c6] text-sm mt-1",
              formFieldErrorText: "text-red-400 text-sm mt-1",
              socialButtonsBlockButton: "bg-[#18182c] border border-[#29294d] text-white hover:bg-[#252540] rounded-lg py-3 mb-3 transition-all duration-200",
              alternativeMethodsBlock: "mt-6",
              footerAction: "text-center mt-6",
              footerActionText: "text-[#b3b3c6]",
              footerActionLink: "text-[#6366f1] hover:text-[#8b5cf6] font-semibold transition-colors",
            },
          }}
        />
        
        <div className="mt-8 text-center">
          <p className="text-[#b3b3c6] text-sm">
            Secure authentication powered by{" "}
            <span className="text-[#6366f1] font-semibold">Clerk</span>
          </p>
        </div>
      </div>
    </div>
  );
}