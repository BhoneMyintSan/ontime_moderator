// app/api/reports/route.ts
import { NextResponse } from 'next/server'
import prisma from "../../../lib/prisma";
import { getAllReports } from "../../../lib/generated/prisma/sql/getAllReports";

export async function GET() {
  try {
    const reports = await prisma.$queryRawTyped(getAllReports());
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
