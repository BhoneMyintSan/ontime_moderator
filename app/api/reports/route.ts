// app/api/reports/route.ts
import { prisma } from '../../../lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
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
}
