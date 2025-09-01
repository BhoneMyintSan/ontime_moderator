import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const refunds = await prisma.payments.findMany({
      where: {
        status: "refunded",
      },
      include: {
        users: true, // Include the user who made the payment
      },
    });

    const transformedRefunds = refunds.map((refund) => ({
      id: `RF-${refund.id}`,
      user: refund.users.full_name,
      email: refund.users.email,
      amount: `${refund.amount_tokens} tickets`,
      status: "Approved", // Since we are fetching only refunded payments, we can consider them as approved refunds.
      date: refund.updated_at.toISOString().split("T")[0],
      reason: "N/A", // The current schema does not support a reason field.
    }));

    return NextResponse.json({
      status: "success",
      message: "Refunds retrieved successfully",
      data: transformedRefunds,
    });
  } catch (error) {
    console.error("Failed to fetch refunds:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to retrieve refunds",
      },
      { status: 500 }
    );
  }
}
