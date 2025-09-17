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
    // Fetch ticket detail using Prisma relations instead of missing generated SQL
    const issue = await prisma.request_reports.findUnique({
      where: { id: ticketId },
      include: {
        users: {
          select: { id: true, full_name: true },
        },
        service_requests: {
          select: {
            id: true,
            listing_id: true,
            users_service_requests_provider_idTousers: { select: { id: true, full_name: true } },
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

    const data = {
      id: issue.id,
      ticket_id: issue.ticket_id,
      reporter_name: issue.users?.full_name ?? '',
      listing_id: issue.service_requests?.listing_id,
      listing_title: '', // Not available directly; could be fetched via service_listings if needed
      provider_id: issue.service_requests?.users_service_requests_provider_idTousers?.id ?? '',
      provider_name: issue.service_requests?.users_service_requests_provider_idTousers?.full_name ?? '',
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

    const updatedTicket = await prisma.service_requests.update({
      where: { id: ticketId },
      data: { 
        status_detail: dbStatus,
        updated_at: new Date()
      },
      include: {
        users_service_requests_requester_idTousers: {
          select: {
            id: true,
            full_name: true,
          }
        },
        users_service_requests_provider_idTousers: {
          select: {
            id: true,
            full_name: true,
          }
        }
      }
    });

    const transformedTicket = {
      id: updatedTicket.id.toString(),
      service: updatedTicket.listing_id.toString(),
      serviceDetails: null, // We don't need to fetch service details again for update
      by: updatedTicket.users_service_requests_requester_idTousers.full_name,
      byId: updatedTicket.users_service_requests_requester_idTousers.id,
      against: updatedTicket.users_service_requests_provider_idTousers.full_name,
      againstId: updatedTicket.users_service_requests_provider_idTousers.id,
      date: updatedTicket.created_at.toISOString().split('T')[0],
      updatedDate: updatedTicket.updated_at.toISOString().split('T')[0],
      status: uiStatus,
      activity: updatedTicket.activity,
      tokenReward: updatedTicket.token_reward
    };

    return NextResponse.json({ 
      status: 'success', 
      message: 'Ticket updated successfully',
      data: transformedTicket 
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
