"use client";
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
import { Gift, Ticket, Check, Package, AlertCircle } from "lucide-react";

interface CouponCode {
  id: number;
  coupon_code: string;
  is_claimed: boolean;
}

interface RedeemedReward {
  id: number;
  redeemed_at: string;
  users: {
    id: string;
    full_name: string;
    phone: string;
  };
}

interface Reward {
  id: number;
  title: string;
  description: string;
  cost: number;
  image_url: string | null;
  created_date: string;
  coupon_codes: CouponCode[];
  redeemed_rewards: RedeemedReward[];
  total_coupons: number;
  claimed_coupons: number;
  available_coupons: number;
  total_redeemed: number;
}

export default function RewardManagement() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [showCouponsDialog, setShowCouponsDialog] = useState(false);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    cost: "",
    image_url: "",
    coupon_codes: "",
  });

  const fetchRewards = async () => {
    try {
      const res = await fetch("/api/reward");
      const json = await res.json();
      if (json.status === "success") {
        setRewards(json.data);
      }
    } catch (error) {
      console.error("Error fetching rewards:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load rewards",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRewards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddReward = async () => {
    if (!formData.title || !formData.description || !formData.cost || !formData.coupon_codes) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields",
      });
      return;
    }

    try {
      // Split coupon codes by comma or newline
      const couponArray = formData.coupon_codes
        .split(/[,\n]/)
        .map(c => c.trim())
        .filter(c => c.length > 0);

      if (couponArray.length === 0) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please provide at least one coupon code",
        });
        return;
      }

      const res = await fetch("/api/reward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          coupon_codes: couponArray,
        }),
      });

      const json = await res.json();

      if (json.status === "success") {
        toast({
          title: "Success",
          description: "Reward created successfully",
        });
        setShowAddDialog(false);
        setFormData({
          title: "",
          description: "",
          cost: "",
          image_url: "",
          coupon_codes: "",
        });
        fetchRewards();
      } else {
        throw new Error(json.message);
      }
    } catch (error) {
      console.error("Error creating reward:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create reward",
      });
    }
  };

  const handleDeleteReward = async () => {
    if (!selectedReward) return;

    try {
      const res = await fetch(`/api/reward?id=${selectedReward.id}`, {
        method: "DELETE",
      });

      const json = await res.json();

      if (json.status === "success") {
        toast({
          title: "Success",
          description: "Reward deleted successfully",
        });
        setShowDeleteDialog(false);
        setSelectedReward(null);
        fetchRewards();
      } else {
        throw new Error(json.message);
      }
    } catch (error) {
      console.error("Error deleting reward:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete reward",
      });
    }
  };

  // Calculate overall stats
  const totalRewards = rewards.length;
  const totalCoupons = rewards.reduce((sum, r) => sum + r.total_coupons, 0);
  const usedCoupons = rewards.reduce((sum, r) => sum + r.claimed_coupons, 0);
  const availableCoupons = rewards.reduce((sum, r) => sum + r.available_coupons, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#23233a] p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#6366f1] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#e0e0e0] mt-4">Loading rewards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#23233a] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Card with Gradient */}
        <div className="relative bg-gradient-to-br from-[#1f1f33] to-[#252540] rounded-2xl p-6 sm:p-8 border border-[#29294d] overflow-hidden">
          {/* Gradient Glow Effect */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/30">
                <Gift className="w-7 h-7 sm:w-8 sm:h-8 text-purple-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Reward Management</h1>
                <p className="text-[#e0e0e0] text-sm sm:text-base mt-1">
                  Manage rewards and coupon codes for users
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowAddDialog(true)}
              className="bg-[#6366f1] hover:bg-[#4f46e5] px-6 py-3 rounded-lg text-white font-medium shadow-lg shadow-indigo-500/30 transition-all hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Reward
            </Button>
          </div>
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#1f1f33] to-[#252540] rounded-2xl p-6 border border-[#29294d] hover:scale-[1.02] transition-all duration-300 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#9ca3af] text-sm font-medium uppercase tracking-wide">Total Rewards</span>
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Gift className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <div className="text-4xl font-bold text-white">{totalRewards}</div>
          <p className="text-xs text-[#e0e0e0] mt-1">Active rewards</p>
        </div>

        <div className="bg-gradient-to-br from-[#1f1f33] to-[#252540] rounded-2xl p-6 border border-[#29294d] hover:scale-[1.02] transition-all duration-300 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#9ca3af] text-sm font-medium uppercase tracking-wide">Total Coupons</span>
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Ticket className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div className="text-4xl font-bold text-white">{totalCoupons}</div>
          <p className="text-xs text-[#e0e0e0] mt-1">All coupon codes</p>
        </div>

        <div className="bg-gradient-to-br from-[#1f1f33] to-[#252540] rounded-2xl p-6 border border-[#29294d] hover:scale-[1.02] transition-all duration-300 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#9ca3af] text-sm font-medium uppercase tracking-wide">Used Coupons</span>
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Check className="w-5 h-5 text-green-400" />
            </div>
          </div>
          <div className="text-4xl font-bold text-green-400">{usedCoupons}</div>
          <p className="text-xs text-[#e0e0e0] mt-1">
            {totalCoupons > 0 ? ((usedCoupons / totalCoupons) * 100).toFixed(1) : 0}% claimed
          </p>
        </div>

        <div className="bg-gradient-to-br from-[#1f1f33] to-[#252540] rounded-2xl p-6 border border-[#29294d] hover:scale-[1.02] transition-all duration-300 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#9ca3af] text-sm font-medium uppercase tracking-wide">Available Coupons</span>
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div className="text-4xl font-bold text-amber-400">{availableCoupons}</div>
          <p className="text-xs text-[#e0e0e0] mt-1">Ready to claim</p>
        </div>
      </div>

      {/* Rewards List */}
      <div className="bg-gradient-to-br from-[#1f1f33] to-[#252540] rounded-2xl border border-[#29294d] shadow-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-[#29294d]">
          <h2 className="text-2xl font-bold text-white">All Rewards</h2>
        </div>
        <div className="p-6">
          {rewards.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                <Gift className="w-12 h-12 text-purple-400" />
              </div>
              <p className="text-[#e0e0e0] text-xl font-semibold mb-2">No rewards yet</p>
              <p className="text-[#9ca3af] text-sm">Click &quot;Add New Reward&quot; to create your first reward</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {rewards.map((reward) => (
                <div
                  key={reward.id}
                  className="bg-gradient-to-br from-[#252540] to-[#1f1f33] rounded-2xl border border-[#29294d] hover:scale-[1.02] hover:border-purple-500/50 transition-all duration-300 shadow-lg hover:shadow-purple-500/20 overflow-hidden flex flex-col"
                >
                  {/* Reward Image */}
                  {reward.image_url ? (
                    <div className="h-52 bg-[#1f1f33] flex items-center justify-center overflow-hidden relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={reward.image_url}
                        alt={reward.title}
                        className="h-full w-full object-contain p-4"
                      />
                    </div>
                  ) : (
                    <div className="h-52 bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                      <Gift className="w-20 h-20 text-purple-400" />
                    </div>
                  )}

                  {/* Reward Details */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-4 gap-3">
                      <h3 className="text-xl font-bold text-white line-clamp-2 flex-1">{reward.title}</h3>
                      <Badge variant="default" className="flex-shrink-0 whitespace-nowrap bg-purple-500/20 text-purple-300 border-purple-500/50">
                        {reward.cost} tokens
                      </Badge>
                    </div>

                    <p className="text-[#e0e0e0] text-sm mb-5 line-clamp-3 flex-1">
                      {reward.description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-5 text-center">
                      <div className="bg-[#1f1f33] rounded-xl p-4 border border-[#29294d]">
                        <div className="text-xs text-[#9ca3af] font-medium mb-1.5 uppercase tracking-wide">Total</div>
                        <div className="text-2xl font-bold text-blue-400">{reward.total_coupons}</div>
                      </div>
                      <div className="bg-[#1f1f33] rounded-xl p-4 border border-[#29294d]">
                        <div className="text-xs text-[#9ca3af] font-medium mb-1.5 uppercase tracking-wide">Used</div>
                        <div className="text-2xl font-bold text-green-400">{reward.claimed_coupons}</div>
                      </div>
                      <div className="bg-[#1f1f33] rounded-xl p-4 border border-[#29294d]">
                        <div className="text-xs text-[#9ca3af] font-medium mb-1.5 uppercase tracking-wide">Left</div>
                        <div className="text-2xl font-bold text-amber-400">{reward.available_coupons}</div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hover:scale-105 transition-all duration-300"
                        onClick={() => {
                          setSelectedReward(reward);
                          setShowCouponsDialog(true);
                        }}
                      >
                        <Ticket className="w-4 h-4 mr-2" />
                        View Coupons
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="hover:scale-105 transition-all duration-300"
                        onClick={() => {
                          setSelectedReward(reward);
                          setShowDeleteDialog(true);
                        }}
                      >
                        <AlertCircle className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Created Date */}
                    <div className="text-xs text-[#9ca3af] mt-4 text-center pt-4 border-t border-[#29294d]">
                      Created {new Date(reward.created_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Reward Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#1f1f33] border-[#29294d]">
          <DialogHeader>
            <DialogTitle className="text-white">Add New Reward</DialogTitle>
            <DialogDescription className="text-[#b3b3c6]">
              Create a new reward with coupon codes for users to redeem
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-white block mb-2">
                Reward Title *
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-[#1f1f33] border border-[#29294d] rounded-lg text-white placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="e.g., Starbucks Gift Card"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-white block mb-2">
                Description *
              </label>
              <textarea
                className="w-full px-4 py-3 bg-[#1f1f33] border border-[#29294d] rounded-lg text-white placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                placeholder="Describe the reward..."
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-white block mb-2">
                Token Cost *
              </label>
              <input
                type="number"
                className="w-full px-4 py-3 bg-[#1f1f33] border border-[#29294d] rounded-lg text-white placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="e.g., 100"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-white block mb-2">
                Image URL (Optional)
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-[#1f1f33] border border-[#29294d] rounded-lg text-white placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="https://example.com/image.jpg"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-white block mb-2">
                Coupon Codes * (one per line or comma-separated)
              </label>
              <textarea
                className="w-full px-4 py-3 bg-[#1f1f33] border border-[#29294d] rounded-lg text-white placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-mono text-sm resize-none"
                placeholder="ABC123XYZ&#10;DEF456UVW&#10;GHI789RST"
                rows={5}
                value={formData.coupon_codes}
                onChange={(e) => setFormData({ ...formData, coupon_codes: e.target.value })}
              />
              <p className="text-xs text-[#9ca3af] mt-1">
                Enter coupon codes separated by commas or new lines
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddReward}>Create Reward</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-[#1f1f33] border-[#29294d]">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Reward</DialogTitle>
            <DialogDescription className="text-[#b3b3c6]">
              Are you sure you want to delete{" "}
              <span className="font-bold text-white">{selectedReward?.title}</span>?
              This will also delete all associated coupon codes and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteReward}>
              Delete Reward
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Coupons Dialog */}
      <Dialog open={showCouponsDialog} onOpenChange={setShowCouponsDialog}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col bg-[#1f1f33] border-[#29294d]">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">{selectedReward?.title} - Coupon Codes</DialogTitle>
            <DialogDescription className="text-base text-[#b3b3c6]">
              Total: <span className="font-semibold text-white">{selectedReward?.total_coupons}</span> | 
              Used: <span className="font-semibold text-green-400">{selectedReward?.claimed_coupons}</span> | 
              Available: <span className="font-semibold text-amber-400">{selectedReward?.available_coupons}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 py-4 px-1">
            <div className="space-y-3">
              {selectedReward?.coupon_codes.map((coupon) => (
                <div
                  key={coupon.id}
                  className="flex items-center justify-between p-4 bg-[#1f1f33] rounded-lg border border-[#29294d] hover:bg-[#252540] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <code className="text-white font-mono text-base bg-[#252540] px-4 py-2 rounded border border-[#29294d]">
                      {coupon.coupon_code}
                    </code>
                  </div>
                  <Badge variant={coupon.is_claimed ? "success" : "secondary"} className="text-sm px-3 py-1">
                    {coupon.is_claimed ? "Claimed" : "Available"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button onClick={() => setShowCouponsDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}
