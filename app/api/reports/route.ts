// app/api/reports/route.ts
import { NextResponse } from 'next/server'
import prisma from "../../../lib/prisma";

export async function GET() {
  try {
    const reports = await prisma.$queryRaw`
      SELECT r.id, r.listing_id, r.reporter_id, r.status, r.datetime, r.report_reason,
             u1.full_name as reporter_name,
             u2.full_name as offender_name
      FROM report r
      JOIN "user" u1 ON u1.id = r.reporter_id
      JOIN service_listing l ON l.id = r.listing_id
      JOIN "user" u2 ON u2.id = l.posted_by
      ORDER BY r.datetime DESC
    `;
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
