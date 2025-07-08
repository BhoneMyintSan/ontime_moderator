"use client";
import { SignIn } from "@clerk/nextjs";

export default function Login() {
  return (
    
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-[#23233a]/90 backdrop-blur-md flex flex-col items-center">
        <div className="mb-8 flex flex-col items-center">
          <div className="bg-[#6366f1] rounded-full w-16 h-16 flex items-center justify-center mb-3 shadow-lg">
            <span className="text-3xl font-bold text-white">⏰</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">
            OnTime Moderator
          </h1>
          <p className="text-[#b3b3c6] text-center text-base">
            Sign in to manage your community, volunteers, and reports.
          </p>
        </div>
        <SignIn
          redirectUrl="/dashboard"
          appearance={{
            variables: {
              colorPrimary: "#6366f1",
              colorBackground: "#23233a",
              colorInputBackground: "#18182c",
              colorText: "#e6e6f0",
              colorTextSecondary: "#b3b3c6",
              borderRadius: "1rem",
              fontSize: "16px",
              fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
              colorDanger: "#ef4444",
            },
            elements: {
              card: "bg-transparent border-none shadow-none rounded-2xl",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              formButtonPrimary:
                "bg-[#6366f1] hover:bg-[#4f46e5] text-white font-semibold rounded-lg py-2 mt-4 transition w-full",
              formFieldInput:
                "bg-[#18182c] text-white placeholder-[#b3b3c6] rounded-lg px-4 py-2 border border-[#29294d] focus:ring-2 focus:ring-[#6366f1] w-full",
              formFieldLabel: "text-[#b3b3c6] font-semibold",
              formFieldHintText: "text-[#b3b3c6] text-xs",
              formFieldErrorText: "text-red-500 text-xs",
              socialButtonsBlockButton: "hidden",
              alternativeMethodsBlock: "hidden",
              footerAction: "hidden",
            },
          }}
        />
      </div>
    
  );
}