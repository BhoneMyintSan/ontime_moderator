import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { emit } from "@/lib/pusher";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const serviceId = parseInt(resolvedParams.id);

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
        warning: true,
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

    // Fetch related tickets through service requests
    const serviceRequests = await prisma.service_request.findMany({
      where: {
        listing_id: serviceId,
      },
      include: {
        request_report: {
          orderBy: {
            created_at: 'desc',
          },
        },
      },
    });

    // Extract all tickets from service requests
    const tickets = serviceRequests.flatMap(request => 
      request.request_report.map(ticket => ({
        ...ticket,
        listing_id: serviceId,
        request_id: request.id,
        requester_name: null, // Will need to fetch user data if needed
        provider_name: null,
      }))
    );

    // Add tickets to service data
    const serviceWithTickets = {
      ...service,
      issue_ticket: tickets,
      _count: {
        ...service._count,
        warning: service.warning ? 1 : 0,
        issue_ticket: tickets.length,
      },
    };

    return NextResponse.json({
      status: "success",
      data: serviceWithTickets,
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

// POST: Issue warning or update service status
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const serviceId = parseInt(resolvedParams.id);
    const body = await request.json();
    const { status, reason, severity } = body;

    // Validate: need either status or reason
    if (!status && !reason) {
      return NextResponse.json(
        {
          status: "error",
          message: "Either status or reason is required",
        },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const service = await tx.service_listing.findUnique({
        where: { id: serviceId },
        include: {
          user: {
            select: {
              id: true,
              full_name: true,
            },
          },
        },
      });

      if (!service) {
        throw new Error("Service not found");
      }

      let updatedService = service;


      if (status === "suspended") {
        updatedService = await tx.service_listing.update({
          where: { id: serviceId },
          data: { status: "suspended" },
          include: {
            user: {
              select: {
                id: true,
                full_name: true,
              },
            },
          },
        });
      }


      if (reason) {
        const warningSeverity = severity || (status === "suspended" ? "severe" : "mild");
        const eventDescription = status === "suspended" ? "suspension" : "warning";

        console.log("Creating event with data:", {
          target_id: serviceId,
          type: "listing",
          description: eventDescription,
        });

        try {
          const event = await tx.event.create({
            data: {
              target_id: serviceId,
              type: "listing",
              description: eventDescription,
              created_at: new Date(),
            },
          });

          console.log("Event created:", event);

          console.log("Creating warning with data:", {
            listing_id: serviceId,
            user_id: service.posted_by,
            severity: warningSeverity,
            reason: reason,
          });

          const warning = await tx.warning.create({
            data: {
              listing_id: serviceId,
              user_id: service.posted_by,
              severity: warningSeverity,
              reason: reason,
              created_at: new Date(),
            },
          });

          console.log("Warning created:", warning);

          const notificationMessage = status === "suspended"
            ? `Your service listing "${service.title}" has been suspended. Reason: ${reason}`
            : `Your service listing "${service.title}" has received a warning. Reason: ${reason}`;

          console.log("Creating notification with data:", {
            message: notificationMessage,
            recipient_user_id: service.posted_by,
            event_id: event.id,
          });

          const notification = await tx.notification.create({
            data: {
              message: notificationMessage,
              recipient_user_id: service.posted_by,
              action_user_id: null,
              event_id: event.id,
              is_read: false,
            },
          });

          console.log("Notification created:", notification);

          // Return data for Pusher emit (will be done outside transaction)
          return { 
            updatedService, 
            pusherData: {
              userId: service.posted_by,
              message: notificationMessage,
              eventType: eventDescription,
              serviceId: serviceId,
              severity: warningSeverity,
            }
          };
        } catch (innerError) {
          console.error("Error in transaction inner block:", innerError);
          throw innerError;
        }
      }

      return { updatedService, pusherData: null };
    });

    // Emit Pusher events after transaction is committed
    if (result.pusherData) {
      try {
        await emit(`user-${result.pusherData.userId}`, "new-notification", {
          message: result.pusherData.message,
          event_type: result.pusherData.eventType,
          service_id: result.pusherData.serviceId,
          severity: result.pusherData.severity,
        });
        console.log("Pusher event emitted successfully");
      } catch (pusherError) {
        console.error("Failed to emit Pusher event:", pusherError);
        // Don't fail the request if Pusher fails
      }
    }

    return NextResponse.json({
      status: "success",
      data: result.updatedService,
      message: status === "suspended" 
        ? "Service suspended successfully" 
        : "Warning issued successfully",
    });
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error && error.message === "Service not found"
          ? "Service not found"
          : "Failed to update service",
      },
      { status: error instanceof Error && error.message === "Service not found" ? 404 : 500 }
    );
  }
}