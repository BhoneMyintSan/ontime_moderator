import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Fetch all rewards with their coupon codes and redemption stats
export async function GET(request: NextRequest) {
  try {
    const rewards = await prisma.reward.findMany({
      include: {
        coupon_code: {
          select: {
            id: true,
            coupon_code: true,
            is_claimed: true,
          },
        },
        redeemed_reward: {
          include: {
            user: {
              select: {
                id: true,
                full_name: true,
                phone: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_date: 'desc',
      },
    });

    // Calculate stats for each reward
    const rewardsWithStats = rewards.map((reward: any) => ({
      ...reward,
      total_coupons: reward.coupon_code.length,
      claimed_coupons: reward.coupon_code.filter((c: any) => c.is_claimed).length,
      available_coupons: reward.coupon_code.filter((c: any) => !c.is_claimed).length,
      total_redeemed: reward.redeemed_reward.length,
    }));

    return NextResponse.json({
      status: "success",
      data: rewardsWithStats,
    });
  } catch (error) {
    console.error("Error fetching rewards:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to fetch rewards",
      },
      { status: 500 }
    );
  }
}

// POST: Create a new reward with coupon codes
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, cost, image_url, coupon_codes } = body;

    // Validate required fields
    if (!title || !description || !cost || !coupon_codes || coupon_codes.length === 0) {
      return NextResponse.json(
        {
          status: "error",
          message: "Missing required fields: title, description, cost, and at least one coupon code",
        },
        { status: 400 }
      );
    }

    // Create reward with coupon codes
    const reward = await prisma.reward.create({
      data: {
        title,
        description,
        cost: parseInt(cost),
        image_url: image_url || null,
        created_date: new Date(),
        coupon_code: {
          create: coupon_codes.map((code: string) => ({
            coupon_code: code.trim(),
            is_claimed: false,
          })),
        },
      },
      include: {
        coupon_code: true,
      },
    });

    return NextResponse.json({
      status: "success",
      data: reward,
      message: "Reward created successfully",
    });
  } catch (error) {
    console.error("Error creating reward:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to create reward",
      },
      { status: 500 }
    );
  }
}

// DELETE: Delete a reward
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          status: "error",
          message: "Reward ID is required",
        },
        { status: 400 }
      );
    }

    await prisma.reward.delete({
      where: {
        id: parseInt(id),
      },
    });

    return NextResponse.json({
      status: "success",
      message: "Reward deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting reward:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to delete reward",
      },
      { status: 500 }
    );
  }
}
