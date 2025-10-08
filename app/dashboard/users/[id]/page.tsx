"use client";
import { useParams, useRouter } from "next/navigation";
import { FiAlertTriangle } from "react-icons/fi";
import { useEffect, useState } from "react";
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

export default function UserProfile() {
  const router = useRouter();
  const { id } = useParams();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!id || Array.isArray(id)) return;
    
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${id}`);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const json = await res.json();
        if (json.status === "success") {
          setUserData(json.data);
        }
      } catch (error) {
        console.error("Failed to load user:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load user profile. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, toast]);

  // Confirmation modal state
  const [showWarningConfirm, setShowWarningConfirm] = useState(false);
  const [showBanConfirm, setShowBanConfirm] = useState(false);

  // Make account status interactive
  const [accountStatus, setAccountStatus] = useState("Active");
  const statusOptions = ["Active", "Under Review", "Suspended", "Banned"];

  useEffect(() => {
    if (userData && userData.status) {
      setAccountStatus(userData.status);
    }
  }, [userData]);

  const handleWarning = () => {
    setShowWarningConfirm(false);
    toast({
      title: "Warning Issued",
      description: `Warning successfully issued to ${userData.full_name}`,
    });
  };

  const handleBan = () => {
    setShowBanConfirm(false);
    toast({
      variant: "destructive",
      title: "User Banned",
      description: `${userData.full_name} has been permanently banned from the platform.`,
    });
  };

  if (loading) {
    return (
      <div className="text-white text-center mt-20">
        Loading user profile...
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="text-white text-center mt-20">
        User not found.
        <Button
          variant="link"
          className="ml-4"
          onClick={() => router.back()}
        >
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-6 px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Card - Enhanced */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl blur-3xl"></div>
        <div className="relative bg-[#1f1f33] rounded-2xl border border-[#29294d] shadow-2xl overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Avatar */}
              <div className="w-28 h-28 rounded-2xl border-4 border-primary/20 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-white font-bold text-4xl shadow-xl flex-shrink-0">
                {userData.full_name.charAt(0).toUpperCase()}
              </div>
              
              {/* User Info */}
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{userData.full_name}</h1>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Badge variant={userData.status.toLowerCase() === 'active' ? 'success' : userData.status.toLowerCase() === 'suspended' ? 'destructive' : 'secondary'} className="text-sm px-3 py-1">
                    {userData.status}
                  </Badge>
                  <span className="text-sm text-[#b3b3c6] flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Member since {new Date(userData.joined_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="text-sm text-[#b3b3c6]">•</span>
                  <span className="text-sm text-[#b3b3c6]">ID: {userData.id?.substring(0, 8)}...</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-[#e0e0e0] bg-[#252540] px-3 py-2 rounded-lg">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="break-all text-sm">{userData.email || 'No email'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#e0e0e0] bg-[#252540] px-3 py-2 rounded-lg">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-sm">{userData.phone || "No phone"}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 w-full sm:w-auto">
                <Button
                  variant="default"
                  className="bg-amber-500 hover:bg-amber-600 w-full sm:w-auto shadow-lg"
                onClick={() => setShowWarningConfirm(true)}
              >
                <FiAlertTriangle className="mr-2" />
                Issue Warning
              </Button>
              <Button
                variant="destructive"
                className="w-full sm:w-auto"
                onClick={() => setShowBanConfirm(true)}
              >
                Ban User
              </Button>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Confirmation Dialogs */}
      <Dialog open={showWarningConfirm} onOpenChange={setShowWarningConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Warning</DialogTitle>
            <DialogDescription>
              Are you sure you want to issue a warning to{" "}
              <span className="font-bold text-white">{userData.full_name}</span>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWarningConfirm(false)}>
              Cancel
            </Button>
            <Button
              className="bg-orange-500 hover:bg-orange-600"
              onClick={handleWarning}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showBanConfirm} onOpenChange={setShowBanConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Ban</DialogTitle>
            <DialogDescription>
              Are you sure you want to{" "}
              <span className="font-bold text-red-400">permanently ban</span>{" "}
              <span className="font-bold text-white">{userData.full_name}</span>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBanConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBan}>
              Ban User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stats - Enhanced */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#1f1f33] to-[#252540] rounded-2xl p-6 shadow-xl border border-[#29294d] hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#9ca3af] text-sm font-medium uppercase tracking-wide">Reports Made</span>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <span className="text-4xl font-bold text-white">{userData.reports?.length || 0}</span>
          <p className="text-xs text-[#b3b3c6] mt-1">Filed reports</p>
        </div>
        <div className="bg-gradient-to-br from-[#1f1f33] to-[#252540] rounded-2xl p-6 shadow-xl border border-[#29294d] hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#9ca3af] text-sm font-medium uppercase tracking-wide">Warnings</span>
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <span className="text-4xl font-bold text-amber-400">{userData.warnings || 0}</span>
          <p className="text-xs text-[#b3b3c6] mt-1">Active warnings</p>
        </div>
        <div className="bg-gradient-to-br from-[#1f1f33] to-[#252540] rounded-2xl p-6 shadow-xl border border-[#29294d] hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#9ca3af] text-sm font-medium uppercase tracking-wide">Token Balance</span>
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <span className="text-4xl font-bold text-green-400">{userData.token_balance || 0}</span>
          <p className="text-xs text-[#b3b3c6] mt-1">Available tokens</p>
        </div>
        <div className="bg-gradient-to-br from-[#1f1f33] to-[#252540] rounded-2xl p-6 shadow-xl border border-[#29294d] hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#9ca3af] text-sm font-medium uppercase tracking-wide">Account Status</span>
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <Badge 
              variant={
                accountStatus.toLowerCase() === 'active' ? 'success' : 
                accountStatus.toLowerCase() === 'suspended' ? 'destructive' : 
                accountStatus.toLowerCase() === 'banned' ? 'destructive' : 
                'secondary'
              } 
              className="text-lg px-4 py-2 font-semibold"
            >
              {accountStatus}
            </Badge>
          </div>
          <p className="text-xs text-[#e0e0e0] mt-3">Current status</p>
        </div>
      </div>

      {/* Additional User Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Details */}
        <div className="bg-[#1f1f33] rounded-2xl border border-[#29294d] shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#29294d] bg-gradient-to-r from-primary/5 to-accent/5">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Account Details
            </h2>
          </div>
          <div className="px-6 py-4 space-y-3">
            <div className="flex justify-between items-center py-3 border-b border-[#29294d]">
              <span className="text-[#9ca3af] text-sm font-medium">Email Signup</span>
              <Badge variant={userData.is_email_signedup ? "success" : "secondary"}>
                {userData.is_email_signedup ? 'Verified' : 'Not Verified'}
              </Badge>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-[#29294d]">
              <span className="text-[#9ca3af] text-sm font-medium">User ID</span>
              <code className="text-white text-xs bg-[#252540] px-2 py-1 rounded font-mono">
                {userData.id}
              </code>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-[#9ca3af] text-sm font-medium">Account Age</span>
              <span className="text-white font-semibold">
                {Math.floor((new Date().getTime() - new Date(userData.joined_at).getTime()) / (1000 * 60 * 60 * 24))} days
              </span>
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="bg-[#1f1f33] rounded-2xl border border-[#29294d] shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#29294d] bg-gradient-to-r from-primary/5 to-accent/5">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Location Information
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <div className="text-[#9ca3af] text-xs uppercase tracking-wide">Address</div>
              <div className="text-white text-sm">{userData.address_line_1}</div>
              {userData.address_line_2 && (
                <div className="text-white text-sm">{userData.address_line_2}</div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#29294d]">
              <div>
                <div className="text-[#9ca3af] text-xs uppercase tracking-wide mb-1">City</div>
                <div className="text-white text-sm font-medium">{userData.city}</div>
              </div>
              <div>
                <div className="text-[#9ca3af] text-xs uppercase tracking-wide mb-1">State</div>
                <div className="text-white text-sm font-medium">{userData.state_province}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#29294d]">
              <div>
                <div className="text-[#9ca3af] text-xs uppercase tracking-wide mb-1">Postal Code</div>
                <div className="text-white text-sm font-medium">{userData.zip_postal_code}</div>
              </div>
              <div>
                <div className="text-[#9ca3af] text-xs uppercase tracking-wide mb-1">Country</div>
                <div className="text-white text-sm font-medium">{userData.country}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report History */}
      <div className="bg-[#1f1f33] rounded-xl border border-[#29294d] shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#29294d]">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Reports Made by User
          </h2>
        </div>
        <div className="p-6 space-y-3">
          {userData.reports && userData.reports.length > 0 ? (
            userData.reports.map((report: any) => (
              <div
                key={report.id}
                className="bg-[#252540] rounded-lg p-4 border border-[#29294d] hover:bg-[#2a2a55] transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-semibold mb-1">{report.report_reason || 'No reason provided'}</div>
                        <div className="text-sm text-[#b3b3c6] space-y-1">
                          <div>Listing ID: <span className="text-white font-mono">#{report.listing_id}</span></div>
                          {report.additional_detail && (
                            <div className="mt-2 text-[#b3b3c6] line-clamp-2">
                              {report.additional_detail}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={report.status === 'Resolved' ? 'success' : 'warning'}>
                      {report.status}
                    </Badge>
                    <div className="text-right text-xs text-[#b3b3c6]">
                      <div>{new Date(report.datetime).toLocaleDateString()}</div>
                      <div className="opacity-70">#{report.id}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-[#b3b3c6]">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p>No reports found</p>
            </div>
          )}
        </div>
      </div>

      {/* Moderation Actions */}
      <div className="bg-[#1f1f33] rounded-xl border border-[#29294d] shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#29294d]">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <FiAlertTriangle className="text-amber-500" />
            Moderation Actions
          </h2>
        </div>
        <div className="p-6 space-y-3">
          {userData.moderationLogs && userData.moderationLogs.length > 0 ? (
            userData.moderationLogs.map((action: any, idx: number) => (
              <div
                key={idx}
                className="bg-[#252540] rounded-lg p-4 border border-[#29294d] hover:bg-[#2a2a55] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <FiAlertTriangle className="text-amber-500" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">{action.action}</div>
                      <div className="text-sm text-[#b3b3c6]">By {action.performed_by}</div>
                    </div>
                  </div>
                  <div className="text-sm text-[#b3b3c6]">
                    {new Date(action.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-[#b3b3c6]">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p>No moderation actions found</p>
            </div>
          )}
        </div>
      </div>

      {/* Done Button */}
      <div className="flex justify-center sm:justify-end">
        <Button
          onClick={() => router.back()}
          size="lg"
          className="w-full sm:w-auto"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Users
        </Button>
      </div>
    </div>
  );
}