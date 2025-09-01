import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

interface TicketCreateData {
  listing_id: number;
  reporter_id: string;
  report_reason?: string;
  status?: string;
}

export async function GET() {
  try {
    // Get all service requests that can be considered as "tickets"
    const tickets = await prisma.service_requests.findMany({
      orderBy: { created_at: 'desc' },
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

    // Transform data to match expected ticket format
    const transformedTickets = tickets.map(ticket => ({
      id: ticket.id.toString(),
      service: ticket.listing_id.toString(),
      by: ticket.users_service_requests_requester_idTousers.full_name,
      against: ticket.users_service_requests_provider_idTousers.full_name,
      date: ticket.created_at.toISOString().split('T')[0],
      status: ticket.status_detail === 'completed' ? 'Resolved' : 'Unresolved'
    }));

    return NextResponse.json({
      status: 'success',
      message: 'Tickets retrieved successfully',
      data: transformedTickets,
    });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch tickets', data: [] },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body: TicketCreateData = await request.json();

    const required = ['listing_id', 'reporter_id'];
    for (const field of required) {
      if (body[field as keyof TicketCreateData] === undefined) {
        return NextResponse.json(
          { status: 'error', message: `Missing field: ${field}`, data: null },
          { status: 400 }
        );
      }
    }

    // Create a new service request as a ticket
    const newTicket = await prisma.service_requests.create({
      data: {
        listing_id: body.listing_id,
        requester_id: body.reporter_id,
        provider_id: body.reporter_id, // For tickets, this might be the same
        status_detail: 'pending',
        activity: 'active',
        token_reward: 0,
        created_at: new Date(),
        updated_at: new Date(),
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
      id: newTicket.id.toString(),
      service: newTicket.listing_id.toString(),
      by: newTicket.users_service_requests_requester_idTousers.full_name,
      against: newTicket.users_service_requests_provider_idTousers.full_name,
      date: newTicket.created_at.toISOString().split('T')[0],
      status: 'Unresolved'
    };

    return NextResponse.json(
      { status: 'success', message: 'Ticket created successfully', data: transformedTicket },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating ticket:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to create ticket', data: null },
      { status: 500 }
    );
  }
}
