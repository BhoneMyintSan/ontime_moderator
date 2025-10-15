"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ServiceListing } from "@/lib/types";
import SearchAndFilter from "../SearchAndFilter";
import Pagination from "../Pagination";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, Users, Ticket } from "lucide-react";

interface ServiceTableProps {
  services: ServiceListing[];
}

const ServiceTable: React.FC<ServiceTableProps> = ({ services }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    severity: "",
  });
  const itemsPerPage = 10;

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesSearch = !searchQuery || 
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = !filters.status || service.status === filters.status;
      const matchesCategory = !filters.category || service.category === filters.category;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [services, searchQuery, filters]);

  const paginatedServices = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredServices.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredServices, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return "bg-green-500";
      case "suspended": return "bg-red-500";
      case "pending": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const getSeverityColor = (count: number) => {
    if (count === 0) return "text-green-400";
    if (count <= 2) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="space-y-6">
      <SearchAndFilter
        searchPlaceholder="Search services by title, provider, category, or description..."
        onSearchChange={setSearchQuery}
      />

      {/* Desktop Table */}
      <div className="hidden md:block bg-[#1f1f33] rounded-2xl border border-[#29294d] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#252540] border-b border-[#29294d]">
              <tr>
                <th className="text-left py-4 px-6 text-[#e0e0e0] font-semibold">Service</th>
                <th className="text-left py-4 px-6 text-[#e0e0e0] font-semibold">Provider</th>
                <th className="text-left py-4 px-6 text-[#e0e0e0] font-semibold">Category</th>
                <th className="text-left py-4 px-6 text-[#e0e0e0] font-semibold">Status</th>
                <th className="text-left py-4 px-6 text-[#e0e0e0] font-semibold">Warnings</th>
                <th className="text-left py-4 px-6 text-[#e0e0e0] font-semibold">Reports</th>
                <th className="text-left py-4 px-6 text-[#e0e0e0] font-semibold">Tickets</th>
                <th className="text-left py-4 px-6 text-[#e0e0e0] font-semibold">Posted</th>
              </tr>
            </thead>
            <tbody>
              {paginatedServices.map((service, index) => (
                <tr 
                  key={service.id} 
                  onClick={() => router.push(`/dashboard/services/${service.id}`)}
                  className={`border-b border-[#29294d] hover:bg-[#252540] transition-colors cursor-pointer ${
                    index % 2 === 0 ? 'bg-[#1f1f33]' : 'bg-[#232340]'
                  }`}
                >
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-semibold text-white mb-1">{service.title}</div>
                      <div className="text-sm text-[#b3b3c6] line-clamp-2">{service.description}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-green-400 font-medium">{service.token_reward} tokens</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-white">{service.user.full_name}</div>
                      <div className="text-sm text-[#b3b3c6]">{service.user.phone}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant="secondary" className="capitalize">
                      {service.category}
                    </Badge>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(service.status)}`}></div>
                      <span className="capitalize text-white">{service.status}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={`w-4 h-4 ${getSeverityColor((service._count?.warnings || service._count?.warning || 0))}`} />
                      <span className={`font-medium ${getSeverityColor((service._count?.warnings || service._count?.warning || 0))}`}>
                        {service._count?.warnings || service._count?.warning || 0}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      <span className="font-medium text-blue-400">
                        {service._count?.reports || service._count?.report || 0}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Ticket className="w-4 h-4 text-purple-400" />
                      <span className="font-medium text-purple-400">
                        {(service._count as any)?.issue_ticket || 0}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-[#b3b3c6]">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">
                        {new Date(service.posted_at).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {paginatedServices.map((service) => (
          <div 
            key={service.id} 
            onClick={() => router.push(`/dashboard/services/${service.id}`)}
            className="bg-[#1f1f33] rounded-2xl border border-[#29294d] p-4 cursor-pointer hover:bg-[#252540] transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">{service.title}</h3>
                <p className="text-sm text-[#b3b3c6] mb-2 line-clamp-2">{service.description}</p>
                <div className="flex items-center gap-2">
                  <span className="text-green-400 font-medium text-sm">{service.token_reward} tokens</span>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(service.status)}`}></div>
                <Badge variant="secondary" className="capitalize text-xs">
                  {service.status}
                </Badge>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[#b3b3c6]">Provider:</span>
                <span className="text-white font-medium">{service.user.full_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#b3b3c6]">Category:</span>
                <Badge variant="secondary" className="capitalize text-xs">
                  {service.category}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#b3b3c6]">Warnings:</span>
                <div className="flex items-center gap-1">
                  <AlertTriangle className={`w-4 h-4 ${getSeverityColor((service._count?.warnings || service._count?.warning || 0))}`} />
                  <span className={`font-medium ${getSeverityColor((service._count?.warnings || service._count?.warning || 0))}`}>
                    {service._count?.warnings || service._count?.warning || 0}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#b3b3c6]">Reports:</span>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span className="font-medium text-blue-400">{service._count?.reports || service._count?.report || 0}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#b3b3c6]">Tickets:</span>
                <div className="flex items-center gap-1">
                  <Ticket className="w-4 h-4 text-purple-400" />
                  <span className="font-medium text-purple-400">{(service._count as any)?.issue_ticket || 0}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#b3b3c6]">Posted:</span>
                <span className="text-white text-sm">
                  {new Date(service.posted_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        totalItems={filteredServices.length}
      />
    </div>
  );
};

export default ServiceTable;
