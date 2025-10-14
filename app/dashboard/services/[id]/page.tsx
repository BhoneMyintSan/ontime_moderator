"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ServiceListing } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowLeft,
  AlertTriangle,
  Users,
  Clock,
  Phone,
  MapPin,
  DollarSign,
  Eye,
  Ban,
  CheckCircle,
  Plus,
} from "lucide-react";

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const serviceId = params.id as string;

  const [service, setService] = useState<ServiceListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [suspendReason, setSuspendReason] = useState("");
  const [warningData, setWarningData] = useState({
    severity: "mild" as "mild" | "severe",
    reason: "",
    comment: "",
  });

  const fetchService = useCallback(async () => {
    if (!serviceId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/services/${serviceId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch service details");
      }
      const data = await response.json();
      
      // Ensure the service object has proper structure
      const serviceData = data.data;
      if (serviceData) {
        // Handle potential field name mismatches from Prisma
        serviceData.warnings = serviceData.warnings || serviceData.warning || [];
        serviceData.reports = serviceData.reports || serviceData.report || [];
        
        // Ensure _count exists with proper structure
        if (!serviceData._count) {
          serviceData._count = {
            warnings: serviceData.warnings?.length || 0,
            reports: serviceData.reports?.length || 0,
          };
        }
      }
      
      setService(serviceData);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, [serviceId]);

  useEffect(() => {
    fetchService();
  }, [fetchService]);

  const handleSuspendService = async () => {
    if (!suspendReason.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide a reason for suspension",
      });
      return;
    }

    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "suspended",
          reason: suspendReason,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to suspend service");
      }

      toast({
        title: "Success",
        description: "Service has been suspended successfully",
      });

      setShowSuspendDialog(false);
      setSuspendReason("");
      fetchService();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to suspend service",
      });
    }
  };

  const handleActivateService = async () => {
    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "active",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to activate service");
      }

      toast({
        title: "Success",
        description: "Service has been activated successfully",
      });

      fetchService();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to activate service",
      });
    }
  };

  const handleAddWarning = async () => {
    if (!warningData.reason.trim() || !warningData.comment.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all warning fields",
      });
      return;
    }

    if (!service?.posted_by) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Service provider information not available",
      });
      return;
    }

    try {
      const requestData = {
        listing_id: parseInt(serviceId),
        user_id: service?.posted_by,
        severity: warningData.severity,
        reason: warningData.reason,
        comment: warningData.comment,
      };

      console.log("Creating warning with data:", requestData);

      const response = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const responseData = await response.json();
      console.log("Warning API response:", responseData);

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to add warning");
      }

      toast({
        title: "Success",
        description: "Warning added successfully",
      });

      setShowWarningDialog(false);
      setWarningData({
        severity: "mild",
        reason: "",
        comment: "",
      });
      fetchService();
    } catch (error) {
      console.error("Error adding warning:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add warning",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return "bg-green-500";
      case "suspended": return "bg-red-500";
      case "pending": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const getSeverityColor = (severity: string) => {
    return severity === "severe" ? "text-red-400" : "text-yellow-400";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#23233a] p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#6366f1] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#e0e0e0] mt-4">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-[#23233a] p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Service Not Found</h2>
          <p className="text-[#b3b3c6] mb-4">{error || "The requested service could not be found."}</p>
          <Button onClick={() => router.push("/dashboard/services")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#23233a] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            onClick={() => router.push("/dashboard/services")}
            variant="outline"
            className="border-[#6366f1] text-white bg-[#6366f1]/20 hover:bg-[#6366f1] hover:text-white hover:border-[#6366f1] transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Service Details</h1>
            <p className="text-[#b3b3c6]">Service ID: {service.id}</p>
          </div>
        </div>

        {/* Service Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Service Info */}
          <div className="lg:col-span-2 bg-[#1f1f33] rounded-2xl border border-[#29294d] p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">{service.title}</h2>
                <p className="text-[#b3b3c6] mb-4">{service.description}</p>
                <div className="flex items-center gap-4 mb-4">
                  <Badge variant="secondary" className="capitalize">
                    {service.category}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(service.status)}`}></div>
                    <span className="capitalize text-white font-medium">{service.status}</span>
                  </div>
                </div>
              </div>
              {service.image_url && (
                <div className="ml-4">
                  <Image
                    src={service.image_url}
                    alt={service.title || "Service image"}
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-lg object-cover"
                    onError={(e) => {
                      console.error("Image failed to load:", service.image_url);
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Service Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-green-400" />
                <div>
                  <span className="text-[#b3b3c6] text-sm">Token Reward</span>
                  <div className="font-semibold text-green-400">{service.token_reward} tokens</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-400" />
                <div>
                  <span className="text-[#b3b3c6] text-sm">Posted Date</span>
                  <div className="font-medium text-white">
                    {new Date(service.posted_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              {service.contact_method && (
                <div className="flex items-center gap-3 md:col-span-2">
                  <Phone className="w-5 h-5 text-purple-400" />
                  <div>
                    <span className="text-[#b3b3c6] text-sm">Contact Method</span>
                    <div className="font-medium text-white">{service.contact_method}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-[#29294d]">
              <Button
                onClick={() => setShowWarningDialog(true)}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Warning
              </Button>
              {service.status === "active" ? (
                <Button
                  onClick={() => setShowSuspendDialog(true)}
                  variant="destructive"
                >
                  <Ban className="w-4 h-4 mr-2" />
                  Suspend Service
                </Button>
              ) : (
                <Button
                  onClick={handleActivateService}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Activate Service
                </Button>
              )}
            </div>
          </div>

          {/* Provider Info */}
          <div className="bg-[#1f1f33] rounded-2xl border border-[#29294d] p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Provider Information</h3>
            <div className="space-y-4">
              <div>
                <span className="text-[#b3b3c6] text-sm">Name</span>
                <div className="font-medium text-white">{service.user.full_name}</div>
              </div>
              <div>
                <span className="text-[#b3b3c6] text-sm">Phone</span>
                <div className="font-medium text-white">{service.user.phone}</div>
              </div>
              <div>
                <span className="text-[#b3b3c6] text-sm">User ID</span>
                <div className="font-mono text-sm text-[#b3b3c6]">{service.user.id}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#1f1f33] rounded-2xl border border-[#29294d] p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-400">{service._count?.warnings || service._count?.warning || 0}</div>
            <div className="text-sm text-[#b3b3c6]">Total Warnings</div>
          </div>
          <div className="bg-[#1f1f33] rounded-2xl border border-[#29294d] p-6 text-center">
            <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-400">{service._count?.reports || service._count?.report || 0}</div>
            <div className="text-sm text-[#b3b3c6]">Total Reports</div>
          </div>
          <div className="bg-[#1f1f33] rounded-2xl border border-[#29294d] p-6 text-center">
            <Eye className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-400 capitalize">{service.status}</div>
            <div className="text-sm text-[#b3b3c6]">Current Status</div>
          </div>
        </div>

        {/* Warnings Section */}
        <div className="bg-[#1f1f33] rounded-2xl border border-[#29294d] p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Warnings History</h3>
          {(service.warnings || service.warning) && (service.warnings?.length || service.warning?.length || 0) > 0 ? (
            <div className="space-y-4">
              {(service.warnings || service.warning || []).map((warning) => (
                <div
                  key={warning.id}
                  className="bg-[#252540] rounded-lg border border-[#29294d] p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={`w-4 h-4 ${getSeverityColor(warning.severity)}`} />
                      <span className={`font-medium capitalize ${getSeverityColor(warning.severity)}`}>
                        {warning.severity} Warning
                      </span>
                    </div>
                    <span className="text-sm text-[#b3b3c6]">
                      {new Date(warning.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="font-medium text-white">Reason: </span>
                    <span className="text-[#e0e0e0]">{warning.reason}</span>
                  </div>
                  <div>
                    <span className="font-medium text-white">Comment: </span>
                    <span className="text-[#b3b3c6]">{warning.comment}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertTriangle className="w-12 h-12 text-[#6b7280] mx-auto mb-3" />
              <p className="text-[#e0e0e0] font-medium">No warnings issued</p>
              <p className="text-[#9ca3af] text-sm">This service has a clean record</p>
            </div>
          )}
        </div>

        {/* Reports Section */}
        <div className="bg-[#1f1f33] rounded-2xl border border-[#29294d] p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Reports History</h3>
          {(service.reports || service.report) && (service.reports?.length || service.report?.length || 0) > 0 ? (
            <div className="space-y-4">
              {(service.reports || service.report || []).map((report) => (
                <div
                  key={report.id}
                  className="bg-[#252540] rounded-lg border border-[#29294d] p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      <span className="font-medium text-white">Report #{report.id}</span>
                      <Badge variant={report.status === "Resolved" ? "default" : "destructive"} className="text-xs">
                        {report.status}
                      </Badge>
                    </div>
                    <span className="text-sm text-[#b3b3c6]">
                      {new Date(report.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="font-medium text-white">Reporter: </span>
                    <span className="text-[#e0e0e0]">{report.reporter_name}</span>
                  </div>
                  {report.reason && (
                    <div>
                      <span className="font-medium text-white">Reason: </span>
                      <span className="text-[#b3b3c6]">{report.reason}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-[#6b7280] mx-auto mb-3" />
              <p className="text-[#e0e0e0] font-medium">No reports filed</p>
              <p className="text-[#9ca3af] text-sm">No user reports for this service</p>
            </div>
          )}
        </div>
      </div>

      {/* Suspend Service Dialog */}
      <Dialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
        <DialogContent className="bg-[#1f1f33] border-[#29294d]">
          <DialogHeader>
            <DialogTitle className="text-white">Suspend Service</DialogTitle>
            <DialogDescription className="text-[#b3b3c6]">
              Are you sure you want to suspend &quot;{service?.title}&quot;? 
              Please provide a reason for this action.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <textarea
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              placeholder="Enter reason for suspension..."
              className="w-full h-24 px-4 py-3 bg-[#252540] border border-[#29294d] rounded-lg text-white placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowSuspendDialog(false)}
              className="border-[#29294d] text-[#0f0e0e] hover:bg-[#29294d] hover:text-white"
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleSuspendService}>
              Suspend Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Warning Dialog */}
      <Dialog open={showWarningDialog} onOpenChange={setShowWarningDialog}>
        <DialogContent className="bg-[#1f1f33] border-[#29294d]">
          <DialogHeader>
            <DialogTitle className="text-white">Add Warning</DialogTitle>
            <DialogDescription className="text-[#b3b3c6]">
              Add a warning to &quot;{service?.title}&quot; and notify the provider.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-white block mb-2">
                Severity Level
              </label>
              <select
                value={warningData.severity}
                onChange={(e) => setWarningData({...warningData, severity: e.target.value as "mild" | "severe"})}
                className="w-full px-4 py-3 bg-[#252540] border border-[#29294d] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              >
                <option value="mild">Mild Warning</option>
                <option value="severe">Severe Warning</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-white block mb-2">
                Warning Reason
              </label>
              <input
                type="text"
                value={warningData.reason}
                onChange={(e) => setWarningData({...warningData, reason: e.target.value})}
                placeholder="e.g., Inappropriate content, Policy violation..."
                className="w-full px-4 py-3 bg-[#252540] border border-[#29294d] rounded-lg text-white placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-white block mb-2">
                Detailed Comment
              </label>
              <textarea
                value={warningData.comment}
                onChange={(e) => setWarningData({...warningData, comment: e.target.value})}
                placeholder="Provide detailed explanation of the warning..."
                rows={4}
                className="w-full px-4 py-3 bg-[#252540] border border-[#29294d] rounded-lg text-white placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowWarningDialog(false)}
              className="border-[#29294d] text-[#201e1e] hover:bg-[#29294d] hover:text-white"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddWarning}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              Add Warning
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
