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
    const report = await prisma.report.findUnique({
      where: { id: reportId },
      select: {
        id: true,
        listing_id: true,
        reporter_id: true,
        datetime: true,
        report_reason: true,
        status: true,
        additional_detail: true,
  user: { select: { id: true, full_name: true } },
        service_listing: {
          select: {
            id: true,
            title: true,
            description: true,
            user: { select: { id: true, full_name: true } },
          },
        },
      },
    });
    
    if (!report) {
      return NextResponse.json({ status: "error", message: "Report not found", data: null }, { status: 404 });
    }
    
    // Transform to include explicit names and maintain UI-compatible aliases
    const data = {
      id: report.id,
      listing_id: report.listing_id,
      reporter_id: report.reporter_id,
      datetime: report.datetime,
      report_reason: report.report_reason,
      status: report.status,
      additional_detail: report.additional_detail,
      // Explicit fields requested
      reporter_full_name: report.user?.full_name ?? null,
      listing_title: report.service_listing?.title ?? null,
      lister_full_name: report.service_listing?.user?.full_name ?? null,
      // Aliases to match UI usage (report.users, report.service_listings)
      users: report.user
        ? {
            id: report.user.id,
            full_name: report.user.full_name,
          }
        : null,
      service_listings: report.service_listing
        ? {
            id: report.service_listing.id,
            title: report.service_listing.title,
            description: report.service_listing.description,
            users: report.service_listing.user
              ? {
                  id: report.service_listing.user.id,
                  full_name: report.service_listing.user.full_name,
                }
              : null,
          }
        : null,
    };

    return NextResponse.json({ status: "success", message: "", data });
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
    const updated = await prisma.report.update({
      where: { id: reportId },
      data: body,
      select: {
        id: true,
        listing_id: true,
        reporter_id: true,
        datetime: true,
        report_reason: true,
        status: true,
        additional_detail: true,
        user: { select: { id: true, full_name: true } },
        service_listing: {
          select: {
            id: true,
            title: true,
            description: true,
            user: { select: { id: true, full_name: true } },
          },
        },
      },
    });

    const data = {
      id: updated.id,
      listing_id: updated.listing_id,
      reporter_id: updated.reporter_id,
      datetime: updated.datetime,
      report_reason: updated.report_reason,
      status: updated.status,
      additional_detail: updated.additional_detail,
      reporter_full_name: updated.user?.full_name ?? null,
      listing_title: updated.service_listing?.title ?? null,
      lister_full_name: updated.service_listing?.user?.full_name ?? null,
      users: updated.user
        ? { id: updated.user.id, full_name: updated.user.full_name }
        : null,
      service_listings: updated.service_listing
        ? {
            id: updated.service_listing.id,
            title: updated.service_listing.title,
            description: updated.service_listing.description,
            users: updated.service_listing.user
              ? {
                  id: updated.service_listing.user.id,
                  full_name: updated.service_listing.user.full_name,
                }
              : null,
          }
        : null,
    };

    return NextResponse.json({ status: "success", message: "Report updated", data });
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

    await prisma.report.delete({ where: { id: reportId } });
    return NextResponse.json({ status: "success", message: "Report deleted", data: {} });
  } catch (error) {
    console.error("Error in DELETE /api/reports/[id]:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to delete report", data: null },
      { status: 500 }
    );
  }
}
