import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Fetch all service listings with warnings and reports count
export async function GET(request: NextRequest) {
  try {
    const services = await prisma.service_listing.findMany({
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
            phone: true,
          },
        },
        warning: true,
        report: {
          include: {
            user: {
              select: {
                id: true,
                full_name: true,
              },
            },
          },
          orderBy: {
            datetime: 'desc',
          },
        },
        _count: {
          select: {
            report: true,
          },
        },
      },
      orderBy: {
        posted_at: 'desc',
      },
    });

    // Fetch ticket counts for each service
    const servicesWithTickets = await Promise.all(
      services.map(async (service) => {
        const serviceRequests = await prisma.service_request.findMany({
          where: { listing_id: service.id },
          include: {
            request_report: true,
          },
        });

        const ticketCount = serviceRequests.reduce(
          (total, request) => total + request.request_report.length, 
          0
        );

        return {
          ...service,
          _count: {
            ...service._count,
            warning: service.warning ? 1 : 0,
            issue_ticket: ticketCount,
          },
        };
      })
    );

    return NextResponse.json({
      status: "success",
      data: servicesWithTickets,
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to fetch services",
      },
      { status: 500 }
    );
  }
}

// POST: Add a warning to a service listing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Received warning creation request:", body);
    
    const { listing_id, user_id, severity, reason } = body;

    // Validate required fields
    if (!listing_id || !user_id || !severity || !reason) {
      console.log("Missing fields:", { listing_id, user_id, severity, reason });
      return NextResponse.json(
        {
          status: "error",
          message: "Missing required fields: listing_id, user_id, severity, and reason",
        },
        { status: 400 }
      );
    }

    // Check if warning already exists for this listing
    const existingWarning = await prisma.warning.findUnique({
      where: { listing_id: parseInt(listing_id) }
    });

    if (existingWarning) {
      return NextResponse.json(
        {
          status: "error",
          message: "Warning already exists for this service. Each service can only have one warning at a time.",
        },
        { status: 409 }
      );
    }

    // Create warning
    console.log("Creating warning with data:", {
      listing_id: parseInt(listing_id),
      user_id,
      severity,
      reason,
    });

    const warning = await prisma.warning.create({
      data: {
        listing_id: parseInt(listing_id),
        user_id,
        severity,
        reason,
        created_at: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
          },
        },
        service_listing: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    console.log("Warning created successfully:", warning);

    return NextResponse.json({
      status: "success",
      data: warning,
      message: "Warning added successfully",
    });
  } catch (error) {
    console.error("Error creating warning:", error);
    
    // Handle Prisma unique constraint violation
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as any;
      if (prismaError.code === 'P2002' && prismaError.meta?.target?.includes('listing_id')) {
        return NextResponse.json(
          {
            status: "error",
            message: "Warning already exists for this service. Each service can only have one warning at a time.",
          },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to create warning",
      },
      { status: 500 }
    );
  }
}