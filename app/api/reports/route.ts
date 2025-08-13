// app/api/reports/route.ts
import { prisma } from '../../../lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const reports = await prisma.report.findMany({
      include: {
        reportedBy: true,
        reportedUser: true,
      }
    });
    return NextResponse.json({
      status: "success",
      message: "",
      data: reports,
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch reports", data: [] },
      { status: 500 }
    );
  }
}
