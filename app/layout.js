import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#23233a] text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
