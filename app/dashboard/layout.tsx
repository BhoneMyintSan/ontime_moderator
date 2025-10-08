import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';

export default function DashboardLayout({ 
  children 
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-[#131322] min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-64">
        <div className="sticky top-0 z-50 bg-[#131322] border-b border-[#29294d] px-4 py-3 shadow-lg">
          <Navbar />
        </div>
        <div className="p-4 sm:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}