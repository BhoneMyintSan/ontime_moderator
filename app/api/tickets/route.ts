import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { getAllTickets } from "../../../lib/generated/prisma/sql/getAllTickets";

interface TicketData {
  id:number;
  reporter_id: string;
  reporter_name: string;
  request_id: number;
  created_at:string;
  ticket_id:string;
  status?: string;
}

export async function GET() {
  try {
    const rows = await prisma.$queryRawTyped(getAllTickets());

    const transformed = (rows as any[]).map((r) => {
      const rawStatus = (r.status ?? r.status_detail ?? '').toString().toLowerCase();
      const status = rawStatus
        ? (['resolved', 'completed', 'closed'].includes(rawStatus) ? 'resolved' : 'ongoing')
        : undefined;

      const idNum = typeof r.id === 'number' ? r.id : parseInt(r.id ?? '0', 10);
      const requestIdNum = typeof r.request_id === 'number'
        ? r.request_id
        : (typeof r.report_id === 'number' ? r.report_id : parseInt(r.report_id ?? r.request_id ?? '0', 10));

      return {
        id: idNum,
        reporter_id: r.reporter_id ?? '',
        reporter_name: r.reporter_name ?? '',
        request_id: requestIdNum,
        created_at: r.created_at ? new Date(r.created_at).toISOString() : '',
        ticket_id: (r.ticket_id ?? String(idNum)) as string,
        status,
      };
    });

    return NextResponse.json({
      status: 'success',
      message: 'Tickets retrieved successfully',
      data: transformed,
    });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch tickets', data: [] },
      { status: 500 }
    );
  }
}


