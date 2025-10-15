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
  FileText,
  Ticket,
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
        // Convert single warning object to array format
        if (serviceData.warning && !Array.isArray(serviceData.warning)) {
          serviceData.warnings = [serviceData.warning];
        } else {
          serviceData.warnings = serviceData.warnings || [];
        }
        
        serviceData.reports = serviceData.reports || serviceData.report || [];
        serviceData.tickets =
          serviceData.tickets ||
          serviceData.ticket ||
          serviceData.issue_ticket ||
          [];

        // Ensure _count exists with proper structure
        if (!serviceData._count) {
          serviceData._count = {
            warnings: serviceData.warnings?.length || 0,
            reports: serviceData.reports?.length || 0,
            tickets: serviceData.tickets?.length || 0,
          };
        } else {
          // Update warning count based on actual warnings array
          serviceData._count.warnings = serviceData.warnings?.length || 0;
          serviceData._count.tickets =
            serviceData._count.tickets ||
            serviceData._count.ticket ||
            serviceData._count.issue_ticket ||
            0;
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
        method: "POST",
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
        method: "POST",
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
    if (!warningData.reason.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in the warning reason",
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

    // Check if service already has a warning
    if (service.warning || (service.warnings && service.warnings.length > 0)) {
      toast({
        variant: "destructive",
        title: "Warning Already Exists",
        description:
          "This service already has a warning. Each service can only have one warning at a time.",
      });
      return;
    }

    try {
      const requestData = {
        severity: warningData.severity,
        reason: warningData.reason,
      };

      console.log("Creating warning with data:", requestData);

      const response = await fetch(`/api/services/${serviceId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const responseData = await response.json();
      console.log("Warning API response:", responseData);

      if (!response.ok) {
        // Handle specific error cases
        if (
          response.status === 409 ||
          responseData.message?.includes("unique") ||
          responseData.message?.includes("already exists")
        ) {
          toast({
            variant: "destructive",
            title: "Warning Already Exists",
            description:
              "This service already has a warning. Each service can only have one warning at a time.",
          });
        } else {
          throw new Error(responseData.message || "Failed to add warning");
        }
        return;
      }

      toast({
        title: "Success",
        description: "Warning added successfully",
      });

      setShowWarningDialog(false);
      setWarningData({
        severity: "mild",
        reason: "",
      });
      fetchService();
    } catch (error) {
      console.error("Error adding warning:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to add warning",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500";
      case "suspended":
        return "bg-red-500";
      case "pending":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
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
          <h2 className="text-2xl font-bold text-white mb-2">
            Service Not Found
          </h2>
          <p className="text-[#b3b3c6] mb-4">
            {error || "The requested service could not be found."}
          </p>
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
                <h2 className="text-2xl font-bold text-white mb-2">
                  {service.title}
                </h2>
                <p className="text-[#b3b3c6] mb-4">{service.description}</p>
                <div className="flex items-center gap-4 mb-4">
                  <Badge variant="secondary" className="capitalize">
                    {service.category}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${getStatusColor(
                        service.status
                      )}`}
                    ></div>
                    <span className="capitalize text-white font-medium">
                      {service.status}
                    </span>
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
                      (e.target as HTMLImageElement).style.display = "none";
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
                  <div className="font-semibold text-green-400">
                    {service.token_reward} tokens
                  </div>
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
                    <span className="text-[#b3b3c6] text-sm">
                      Contact Method
                    </span>
                    <div className="font-medium text-white">
                      {service.contact_method}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-[#29294d]">
              <Button
                onClick={() => setShowWarningDialog(true)}
                disabled={
                  !!(
                    service.warning ||
                    (service.warnings && service.warnings.length > 0)
                  )
                }
                className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4 mr-2" />
                {service.warning ||
                (service.warnings && service.warnings.length > 0)
                  ? "Warning Exists"
                  : "Add Warning"}
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
            <h3 className="text-lg font-semibold text-white mb-4">
              Provider Information
            </h3>
            <div className="space-y-4">
              <div>
                <span className="text-[#b3b3c6] text-sm">Name</span>
                <div className="font-medium text-white">
                  {service.user.full_name}
                </div>
              </div>
              <div>
                <span className="text-[#b3b3c6] text-sm">Phone</span>
                <div className="font-medium text-white">
                  {service.user.phone}
                </div>
              </div>
              <div>
                <span className="text-[#b3b3c6] text-sm">User ID</span>
                <div className="font-mono text-sm text-[#b3b3c6]">
                  {service.user.id}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#1f1f33] rounded-2xl border border-[#29294d] p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-400">
              {service._count?.warnings || service._count?.warning || 0}
            </div>
            <div className="text-sm text-[#b3b3c6]">Total Warnings</div>
          </div>
          <div className="bg-[#1f1f33] rounded-2xl border border-[#29294d] p-6 text-center">
            <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-400">
              {service._count?.reports || service._count?.report || 0}
            </div>
            <div className="text-sm text-[#b3b3c6]">Total Reports</div>
          </div>
          <div className="bg-[#1f1f33] rounded-2xl border border-[#29294d] p-6 text-center">
            <Ticket className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-400">
              {service._count?.tickets || service._count?.ticket || 0}
            </div>
            <div className="text-sm text-[#b3b3c6]">Issue Tickets</div>
          </div>
          <div className="bg-[#1f1f33] rounded-2xl border border-[#29294d] p-6 text-center">
            <Eye className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-400 capitalize">
              {service.status}
            </div>
            <div className="text-sm text-[#b3b3c6]">Current Status</div>
          </div>
        </div>

        {/* Warnings Section */}
        <div className="bg-[#1f1f33] rounded-2xl border border-[#29294d] p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">
              Warnings History
            </h3>
            <div className="flex items-center gap-2 text-sm text-[#b3b3c6]">
              <AlertTriangle className="w-4 h-4" />
              <span>
                {service.warnings?.length || 0} Warning{service.warnings?.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          
          {service.warnings && service.warnings.length > 0 ? (
            <div className="space-y-4">
              {service.warnings.map((warning: any, index: number) => (
                <div
                  key={warning.id}
                  className="bg-gradient-to-r from-[#252540] to-[#2a2550] rounded-lg border border-[#29294d] hover:border-[#383862] transition-all duration-200 p-5"
                >
                  {/* Warning Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${warning.severity === 'severe' ? 'bg-red-500/20' : 'bg-yellow-500/20'} flex items-center justify-center`}>
                        <AlertTriangle
                          className={`w-4 h-4 ${getSeverityColor(warning.severity)}`}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold capitalize ${getSeverityColor(warning.severity)}`}>
                            {warning.severity} Warning
                          </span>
                          <Badge
                            variant="outline"
                            className={`text-xs px-2 py-1 ${
                              warning.severity === 'severe'
                                ? "bg-red-500/20 border-red-500/50 text-red-300"
                                : "bg-yellow-500/20 border-yellow-500/50 text-yellow-300"
                            }`}
                          >
                            {warning.severity === 'severe' ? 'High Priority' : 'Low Priority'}
                          </Badge>
                        </div>
                        <p className="text-xs text-[#9ca3af] mt-1">
                          Issued on{" "}
                          {new Date(warning.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}{" "}
                          at{" "}
                          {new Date(warning.created_at).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Warning Content */}
                  <div className="bg-[#1f1f33] rounded-lg p-4 border border-[#29294d]">
                    <div className="flex items-start gap-2">
                      <FileText className="w-4 h-4 text-indigo-400 mt-0.5" />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-white block mb-1">
                          Reason for Warning:
                        </span>
                        <p className="text-sm text-[#b3b3c6] leading-relaxed">
                          {warning.reason || "No reason provided"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Warning Footer */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#29294d]">
                    <div className="flex items-center gap-4 text-xs text-[#9ca3af]">
                      <span>Warning ID: {warning.id}</span>
                      <span>•</span>
                      <span>Issued to User ID: {warning.user_id}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <p className="text-[#e0e0e0] font-semibold text-lg mb-2">
                No Warnings Issued
              </p>
              <p className="text-[#9ca3af] text-sm max-w-md mx-auto">
                This service has a clean record with no warnings from moderators.
              </p>
            </div>
          )}
        </div>

        {/* Reports Section */}
        <div className="bg-[#1f1f33] rounded-2xl border border-[#29294d] p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">
              Reports History
            </h3>
            <div className="flex items-center gap-2 text-sm text-[#b3b3c6]">
              <Users className="w-4 h-4" />
              <span>
                {service.reports?.length || service.report?.length || 0} Reports
              </span>
            </div>
          </div>

          {(service.reports || service.report) &&
          (service.reports?.length || service.report?.length || 0) > 0 ? (
            <div className="space-y-4">
              {(service.reports || service.report || []).map(
                (report, index) => (
                  <div
                    key={report.id}
                    className="bg-gradient-to-r from-[#252540] to-[#2a2550] rounded-lg border border-[#29294d] hover:border-[#383862] transition-all duration-200 p-5"
                  >
                    {/* Report Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                          <span className="text-red-400 font-bold text-sm">
                            #{index + 1}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white">
                              Report #{report.id}
                            </span>
                            <Badge
                              variant={
                                report.status === "Resolved"
                                  ? "default"
                                  : "destructive"
                              }
                              className={`text-xs px-2 py-1 ${
                                report.status === "Resolved"
                                  ? "bg-green-500/20 border-green-500/50 text-green-300 hover:bg-green-500/30"
                                  : "bg-red-500/20 border-red-500/50 text-red-300 hover:bg-red-500/30"
                              }`}
                            >
                              {report.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-[#9ca3af] mt-1">
                            Submitted on{" "}
                            {new Date(
                              (report as any).created_at ||
                                (report as any).datetime ||
                                new Date()
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}{" "}
                            at{" "}
                            {new Date(
                              (report as any).created_at ||
                                (report as any).datetime ||
                                new Date()
                            ).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(`/dashboard/reports/${report.id}`)
                        }
                        className="border-[#29294d] text-[#050505] hover:bg-[#29294d] hover:text-white hover:border-[#383862] transition-all duration-200"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View Details
                      </Button>
                    </div>

                    {/* Report Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-400" />
                          <span className="text-sm font-medium text-white">
                            Reporter Information
                          </span>
                        </div>
                        <div className="pl-6 space-y-1">
                          <div className="text-sm">
                            <span className="text-[#9ca3af]">Name: </span>
                            <span className="text-[#e0e0e0] font-medium">
                              {report.reporter_name ||
                                (report as any).users?.full_name ||
                                "Unknown User"}
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="text-[#9ca3af]">ID: </span>
                            <span className="text-[#b3b3c6] font-mono text-xs">
                              {(report as any).reporter_id || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-400" />
                          <span className="text-sm font-medium text-white">
                            Report Classification
                          </span>
                        </div>
                        <div className="pl-6 space-y-1">
                          <div className="text-sm">
                            <span className="text-[#9ca3af]">Category: </span>
                            <span className="text-[#e0e0e0] font-medium">
                              {report.reason ||
                                (report as any).report_reason ||
                                "General Report"}
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="text-[#9ca3af]">Priority: </span>
                            <span
                              className={`font-medium ${
                                report.status === "Resolved"
                                  ? "text-green-400"
                                  : "text-orange-400"
                              }`}
                            >
                              {report.status === "Resolved"
                                ? "Resolved"
                                : "Pending Review"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Details */}
                    {(report as any).additional_detail && (
                      <div className="mt-4 p-3 bg-[#1f1f33] rounded-lg border border-[#29294d]">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-4 h-4 text-indigo-400" />
                          <span className="text-sm font-medium text-white">
                            Additional Details
                          </span>
                        </div>
                        <p className="text-sm text-[#b3b3c6] leading-relaxed pl-6">
                          {(report as any).additional_detail}
                        </p>
                      </div>
                    )}

                    {/* Report Actions */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#29294d]">
                      <div className="flex items-center gap-4 text-xs text-[#9ca3af]">
                        <span>Report ID: {report.id}</span>
                        <span>•</span>
                        <span>
                          Listing ID: {(report as any).listing_id || service.id}
                        </span>
                      </div>

                      {report.status !== "Resolved" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs border-green-500/50 text-green-400 hover:bg-green-500/20 hover:border-green-500"
                          onClick={async () => {
                            // Handle quick resolve action
                            try {
                              const response = await fetch(
                                `/api/reports/${report.id}`,
                                {
                                  method: "PATCH",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({ status: "Resolved" }),
                                }
                              );
                              if (response.ok) {
                                toast({
                                  title: "Success",
                                  description: "Report marked as resolved",
                                });
                                fetchService(); // Refresh the data
                              }
                            } catch (error) {
                              toast({
                                variant: "destructive",
                                title: "Error",
                                description: "Failed to update report status",
                              });
                            }
                          }}
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Mark Resolved
                        </Button>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-400" />
              </div>
              <p className="text-[#e0e0e0] font-semibold text-lg mb-2">
                Clean Record
              </p>
              <p className="text-[#9ca3af] text-sm max-w-md mx-auto">
                This service has no user reports. The provider maintains a good
                standing with no reported issues.
              </p>
            </div>
          )}
        </div>

        {/* Tickets Section */}
        <div className="bg-[#1f1f33] rounded-2xl border border-[#29294d] p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">
              Issue Tickets History
            </h3>
            <div className="flex items-center gap-2 text-sm text-[#b3b3c6]">
              <Ticket className="w-4 h-4" />
              <span>
                {service.tickets?.length ||
                  service.ticket?.length ||
                  (service as any).issue_ticket?.length ||
                  0}{" "}
                Tickets
              </span>
            </div>
          </div>

          {(service.tickets ||
            service.ticket ||
            (service as any).issue_ticket) &&
          (service.tickets?.length ||
            service.ticket?.length ||
            (service as any).issue_ticket?.length ||
            0) > 0 ? (
            <div className="space-y-4">
              {(
                service.tickets ||
                service.ticket ||
                (service as any).issue_ticket ||
                []
              ).map((ticket: any, index: number) => (
                <div
                  key={ticket.id}
                  className="bg-gradient-to-r from-[#252540] to-[#2a2550] rounded-lg border border-[#29294d] hover:border-[#383862] transition-all duration-200 p-5"
                >
                  {/* Ticket Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <span className="text-purple-400 font-bold text-sm">
                          #{index + 1}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">
                            Ticket #{ticket.id}
                          </span>
                          <Badge
                            variant={
                              ticket.status === "resolved"
                                ? "default"
                                : "destructive"
                            }
                            className={`text-xs px-2 py-1 ${
                              ticket.status === "resolved"
                                ? "bg-green-500/20 border-green-500/50 text-green-300 hover:bg-green-500/30"
                                : "bg-orange-500/20 border-orange-500/50 text-orange-300 hover:bg-orange-500/30"
                            }`}
                          >
                            {ticket.status === "resolved"
                              ? "Resolved"
                              : "Ongoing"}
                          </Badge>
                        </div>
                        <p className="text-xs text-[#9ca3af] mt-1">
                          Created on{" "}
                          {new Date(
                            (ticket as any).created_at || new Date()
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}{" "}
                          at{" "}
                          {new Date(
                            (ticket as any).created_at || new Date()
                          ).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        router.push(`/dashboard/tickets/${ticket.id}`)
                      }
                      className="border-[#29294d] text-[#000000] hover:bg-[#29294d] hover:text-white hover:border-[#383862] transition-all duration-200"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View Details
                    </Button>
                  </div>

                  {/* Ticket Content */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-medium text-white">
                          Reporter (Requester)
                        </span>
                      </div>
                      <div className="pl-6 space-y-1">
                        <div className="text-sm">
                          <span className="text-[#9ca3af]">Name: </span>
                          <span className="text-[#e0e0e0] font-medium">
                            {(ticket as any).reporter_name ||
                              (ticket as any).requester_name ||
                              "Unknown User"}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-[#9ca3af]">ID: </span>
                          <span className="text-[#b3b3c6] font-mono text-xs">
                            {(ticket as any).reporter_id || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-medium text-white">
                          Provider
                        </span>
                      </div>
                      <div className="pl-6 space-y-1">
                        <div className="text-sm">
                          <span className="text-[#9ca3af]">Name: </span>
                          <span className="text-[#e0e0e0] font-medium">
                            {(ticket as any).provider_name ||
                              service.user?.full_name ||
                              "Unknown Provider"}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-[#9ca3af]">ID: </span>
                          <span className="text-[#b3b3c6] font-mono text-xs">
                            {(ticket as any).provider_id ||
                              service.posted_by ||
                              "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ticket Description */}
                  {(ticket as any).description && (
                    <div className="mt-4 p-3 bg-[#1f1f33] rounded-lg border border-[#29294d]">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-indigo-400" />
                        <span className="text-sm font-medium text-white">
                          Issue Description
                        </span>
                      </div>
                      <p className="text-sm text-[#b3b3c6] leading-relaxed pl-6">
                        {(ticket as any).description}
                      </p>
                    </div>
                  )}

                  {/* Ticket Actions */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#29294d]">
                    <div className="flex items-center gap-4 text-xs text-[#9ca3af]">
                      <span>Ticket ID: {ticket.id}</span>
                      <span>•</span>
                      <span>Service ID: {service.id}</span>
                    </div>

                    {ticket.status !== "resolved" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs border-green-500/50 text-green-400 hover:bg-green-500/20 hover:border-green-500"
                        onClick={async () => {
                          // Handle quick resolve action
                          try {
                            const response = await fetch(
                              `/api/tickets/${ticket.id}`,
                              {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ status: "resolved" }),
                              }
                            );
                            if (response.ok) {
                              toast({
                                title: "Success",
                                description: "Ticket marked as resolved",
                              });
                              fetchService(); // Refresh the data
                            }
                          } catch (error) {
                            toast({
                              variant: "destructive",
                              title: "Error",
                              description: "Failed to update ticket status",
                            });
                          }
                        }}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Mark Resolved
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ticket className="w-8 h-8 text-green-400" />
              </div>
              <p className="text-[#e0e0e0] font-semibold text-lg mb-2">
                No Issue Tickets
              </p>
              <p className="text-[#9ca3af] text-sm max-w-md mx-auto">
                This service has no reported issues or tickets. All service
                transactions have been completed successfully.
              </p>
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
              Add a warning to &quot;{service?.title}&quot; and notify the
              provider.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-white block mb-2">
                Severity Level
              </label>
              <select
                value={warningData.severity}
                onChange={(e) =>
                  setWarningData({
                    ...warningData,
                    severity: e.target.value as "mild" | "severe",
                  })
                }
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
                onChange={(e) =>
                  setWarningData({ ...warningData, reason: e.target.value })
                }
                placeholder="e.g., Inappropriate content, Policy violation..."
                className="w-full px-4 py-3 bg-[#252540] border border-[#29294d] rounded-lg text-white placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
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
