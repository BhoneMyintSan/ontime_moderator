import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex bg-[#131322] min-h-screen">
      <Sidebar />
      <main className="w-full p-2 sm:p-4 lg:ml-64">
        <Navbar />
        {children}
      </main>
    </div>
  );
}