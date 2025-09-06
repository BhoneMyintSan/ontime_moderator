import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

/**
 * GET /api/reports/:id
 */
export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    
    if (!params || !params.id) {
      return NextResponse.json(
        { status: "error", message: "Report ID is required", data: null }, 
        { status: 400 }
      );
    }

    const reportId = parseInt(params.id);
    
    if (isNaN(reportId)) {
      return NextResponse.json(
        { status: "error", message: "Invalid report ID", data: null }, 
        { status: 400 }
      );
    }
    const report = await prisma.reports.findUnique({
      where: { id: reportId },
      include: {
        users: true, // Reporter information
        service_listings: {
          include: {
            users: true // Posted by user (the person being reported)
          }
        }
      },
    });
    
    if (!report) {
      return NextResponse.json({ status: "error", message: "Report not found", data: null }, { status: 404 });
    }
    
    return NextResponse.json({ status: "success", message: "", data: report });
  } catch (error) {
    console.error("Error in GET /api/reports/[id]:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch report", data: null },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/reports/:id
 * Update report status
 */
export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    
    if (!params || !params.id) {
      return NextResponse.json(
        { status: "error", message: "Report ID is required", data: null }, 
        { status: 400 }
      );
    }

    const reportId = parseInt(params.id);
    
    if (isNaN(reportId)) {
      return NextResponse.json(
        { status: "error", message: "Invalid report ID", data: null }, 
        { status: 400 }
      );
    }

    const body = await req.json();
    const updated = await prisma.reports.update({
      where: { id: reportId },
      data: body,
      include: {
        users: true, // Reporter information
        service_listings: {
          include: {
            users: true // Posted by user (the person being reported)
          }
        }
      },
    });
    return NextResponse.json({ status: "success", message: "Report updated", data: updated });
  } catch (error) {
    console.error("Error in PATCH /api/reports/[id]:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to update report", data: null },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/reports/:id
 */
export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    
    if (!params || !params.id) {
      return NextResponse.json(
        { status: "error", message: "Report ID is required", data: null }, 
        { status: 400 }
      );
    }

    const reportId = parseInt(params.id);
    
    if (isNaN(reportId)) {
      return NextResponse.json(
        { status: "error", message: "Invalid report ID", data: null }, 
        { status: 400 }
      );
    }

    await prisma.reports.delete({ where: { id: reportId } });
    return NextResponse.json({ status: "success", message: "Report deleted", data: {} });
  } catch (error) {
    console.error("Error in DELETE /api/reports/[id]:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to delete report", data: null },
      { status: 500 }
    );
  }
}
