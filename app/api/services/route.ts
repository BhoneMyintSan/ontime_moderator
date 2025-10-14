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
      orderBy: {
        posted_at: 'desc',
      },
    });

    return NextResponse.json({
      status: "success",
      data: services,
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
    
    const { listing_id, user_id, severity, comment, reason } = body;

    // Validate required fields
    if (!listing_id || !user_id || !severity || !comment || !reason) {
      console.log("Missing fields:", { listing_id, user_id, severity, comment, reason });
      return NextResponse.json(
        {
          status: "error",
          message: "Missing required fields: listing_id, user_id, severity, comment, and reason",
        },
        { status: 400 }
      );
    }

    // Create warning
    console.log("Creating warning with data:", {
      listing_id: parseInt(listing_id),
      user_id,
      severity,
      comment,
      reason,
    });

    const warning = await prisma.warning.create({
      data: {
        listing_id: parseInt(listing_id),
        user_id,
        severity,
        comment,
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
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to create warning",
      },
      { status: 500 }
    );
  }
}