"use client";
import { SignIn } from "@clerk/nextjs";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#23233a] to-[#18182c]">
      <SignIn
        redirectUrl="/dashboard"
        appearance={{
          variables: {
            colorPrimary: "#6366f1", // Your accent color
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
            card: "bg-[#23233a] border-none shadow-2xl rounded-2xl",
            headerTitle: "text-white text-2xl font-bold",
            headerSubtitle: "text-[#b3b3c6]",
            formButtonPrimary: "bg-[#6366f1] hover:bg-[#4f46e5] text-white font-semibold rounded-lg py-2 mt-4 transition",
            formFieldInput: "bg-[#18182c] text-white rounded-lg px-4 py-2 border border-[#29294d] focus:ring-2 focus:ring-[#6366f1]",
            formFieldLabel: "text-[#b3b3c6] font-semibold",
            formFieldHintText: "text-[#b3b3c6] text-xs",
            formFieldErrorText: "text-red-500 text-xs",
            socialButtonsBlockButton: { display: "none" },
            alternativeMethodsBlock: { display: "none" },
            footerAction: { display: "none" },
          },
        }}
      />
    </div>
  );
}