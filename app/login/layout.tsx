export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#23233a] text-white min-h-screen flex items-center justify-center">
      {children}
    </div>
  );
}