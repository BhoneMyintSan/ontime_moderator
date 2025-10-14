import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const serviceId = parseInt(params.id);

    const service = await prisma.service_listing.findUnique({
      where: {
        id: serviceId,
      },
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
            phone: true,
            status: true,
          },
        },
        warning: {
          orderBy: {
            created_at: 'desc',
          },
        },
        report: {
          include: {
            user: {
              select: {
                id: true,
                full_name: true,
                phone: true,
              },
            },
          },
          orderBy: {
            datetime: 'desc',
          },
        },
        _count: {
          select: {
            warning: true,
            report: true,
          },
        },
      },
    });

    if (!service) {
      return NextResponse.json(
        {
          status: "error",
          message: "Service not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: "success",
      data: service,
    });
  } catch (error) {
    console.error("Error fetching service:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to fetch service details",
      },
      { status: 500 }
    );
  }
}

// PUT: Update service status (suspend/activate)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const serviceId = parseInt(params.id);
    const body = await request.json();
    const { status, reason } = body;

    // Validate required fields
    if (!status) {
      return NextResponse.json(
        {
          status: "error",
          message: "Status is required",
        },
        { status: 400 }
      );
    }

    // Update service status
    const updatedService = await prisma.service_listing.update({
      where: {
        id: serviceId,
      },
      data: {
        status,
      },
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
          },
        },
      },
    });

    // If suspending and reason provided, add a warning
    if (status === "suspended" && reason) {
      await prisma.warning.create({
        data: {
          listing_id: serviceId,
          user_id: updatedService.posted_by,
          severity: "severe",
          comment: reason,
          reason: "Service Suspension",
          created_at: new Date(),
        },
      });
    }

    return NextResponse.json({
      status: "success",
      data: updatedService,
      message: `Service ${status} successfully`,
    });
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to update service",
      },
      { status: 500 }
    );
  }
}