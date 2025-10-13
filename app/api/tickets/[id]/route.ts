import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

interface TicketUpdateData {
  status?: string;
}

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    if (!params || !params.id) {
      return NextResponse.json(
        { status: 'error', message: 'Ticket ID is required' },
        { status: 400 }
      );
    }

    const ticketId = parseInt(params.id, 10);
    if (isNaN(ticketId)) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid ticket ID' },
        { status: 400 }
      );
    }
    // Fetch ticket detail using Prisma relations and additional lookup for listing title
    const issue = await prisma.request_report.findUnique({
      where: { id: ticketId },
      select: {
        id: true,
        ticket_id: true,
        reporter_id: true,
        created_at: true,
        status: true,
        request_id: true,
        user: { select: { id: true, full_name: true } },
        service_request: {
          select: {
            id: true,
            listing_id: true,
            status_detail: true,
            user_service_request_provider_idTouser: { select: { id: true, full_name: true } },
          },
        },
      },
    });

    if (!issue) {
      return NextResponse.json(
        { status: 'error', message: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Fetch listing title separately (no direct relation on service_request model)
    const listingId = issue.service_request?.listing_id ?? null;
    let listingTitle: string = '';
    if (listingId !== null) {
      const listing = await prisma.service_listing.findUnique({
        where: { id: listingId },
        select: { id: true, title: true },
      });
      listingTitle = listing?.title ?? '';
    }

    const rawStatus = (issue.status ?? issue.service_request?.status_detail ?? '').toString().toLowerCase();
    const status = rawStatus && ['resolved', 'completed', 'closed'].includes(rawStatus) ? 'resolved' : 'ongoing';

    const data = {
      id: issue.id,
      ticket_id: issue.ticket_id,
      reporter_id: issue.reporter_id,
      reporter_name: issue.user?.full_name ?? '',
      request_id: issue.request_id,
      listing_id: listingId ?? 0,
      listing_title: listingTitle,
      provider_id: issue.service_request?.user_service_request_provider_idTouser?.id ?? '',
      provider_name: issue.service_request?.user_service_request_provider_idTouser?.full_name ?? '',
      created_at: issue.created_at ? new Date(issue.created_at).toISOString() : '',
      status,
    };

    return NextResponse.json({
      status: 'success',
      message: 'Ticket retrieved successfully',
      data
    });
  } catch (error) {
    console.error('Error in GET /api/tickets/[id]:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch ticket' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    
    if (!params || !params.id) {
      return NextResponse.json(
        { status: 'error', message: 'Ticket ID is required' }, 
        { status: 400 }
      );
    }

    const ticketId = parseInt(params.id);
    
    if (isNaN(ticketId)) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid ticket ID' }, 
        { status: 400 }
      );
    }

    const body: TicketUpdateData = await request.json();
    
    if (!body.status) {
      return NextResponse.json(
        { status: 'error', message: 'Status is required' }, 
        { status: 400 }
      );
    }

    // Map frontend status to database status
    const statusMapping: { [key: string]: 'completed' | 'pending' } = {
      'resolved': 'completed',
      'ongoing': 'pending'
    };

    const uiStatus = body.status.toLowerCase();
    const dbStatus = statusMapping[uiStatus];
    if (!dbStatus) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid status value' }, 
        { status: 400 }
      );
    }

    // First, get the request_report to find the actual service_request ID
    const requestReport = await prisma.request_report.findUnique({
      where: { id: ticketId },
      select: { request_id: true }
    });

    if (!requestReport) {
      return NextResponse.json(
        { status: 'error', message: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Update the actual service_request, not the request_report
    const updatedTicket = await prisma.service_request.update({
      where: { id: requestReport.request_id },
      data: { 
        status_detail: dbStatus,
        updated_at: new Date()
      },
      include: {
        user_service_request_requester_idTouser: {
          select: {
            id: true,
            full_name: true,
          }
        },
        user_service_request_provider_idTouser: {
          select: {
            id: true,
            full_name: true,
          }
        }
      }
    });

    // Also update the request_report status to match
    await prisma.request_report.update({
      where: { id: ticketId },
      data: { status: uiStatus }
    });

    // Re-fetch the issue to build consistent response shape
    const updatedIssue = await prisma.request_report.findUnique({
      where: { id: ticketId },
      select: {
        id: true,
        ticket_id: true,
        reporter_id: true,
        created_at: true,
        status: true,
        request_id: true,
        user: { select: { id: true, full_name: true } },
        service_request: {
          select: {
            id: true,
            listing_id: true,
            status_detail: true,
            user_service_request_provider_idTouser: { select: { id: true, full_name: true } },
          },
        },
      },
    });

    if (!updatedIssue) {
      return NextResponse.json(
        { status: 'error', message: 'Ticket not found after update' },
        { status: 404 }
      );
    }

    const updatedListingId = updatedIssue.service_request?.listing_id ?? null;
    let updatedListingTitle: string = '';
    if (updatedListingId !== null) {
      const listing = await prisma.service_listing.findUnique({
        where: { id: updatedListingId },
        select: { id: true, title: true },
      });
      updatedListingTitle = listing?.title ?? '';
    }

    const mappedStatus = uiStatus; // Already mapped and saved; UI expects 'resolved' | 'ongoing'

    const responseData = {
      id: updatedIssue.id,
      ticket_id: updatedIssue.ticket_id,
      reporter_id: updatedIssue.reporter_id,
      reporter_name: updatedIssue.user?.full_name ?? '',
      request_id: updatedIssue.request_id,
      listing_id: updatedListingId ?? 0,
      listing_title: updatedListingTitle,
      provider_id: updatedIssue.service_request?.user_service_request_provider_idTouser?.id ?? '',
      provider_name: updatedIssue.service_request?.user_service_request_provider_idTouser?.full_name ?? '',
      created_at: updatedIssue.created_at ? new Date(updatedIssue.created_at).toISOString() : '',
      status: mappedStatus,
    };

    return NextResponse.json({
      status: 'success',
      message: 'Ticket updated successfully',
      data: responseData,
    });
  } catch (error) {
    console.error('Error in PATCH /api/tickets/[id]:', error);
    
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { status: 'error', message: 'Ticket not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { status: 'error', message: 'Failed to update ticket' },
      { status: 500 }
    );
  }
}
