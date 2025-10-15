import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

interface TicketData {
  id:number;
  reporter_id: string;
  reporter_name: string;
  provider_name: string;
  provider_id: string;
  request_id: number;
  created_at:string;
  ticket_id:string;
  status?: string;
  refund_approved?: boolean;
}

export async function GET() {
  try {
    // Use raw SQL query to get tickets with provider information and refund status
    const rows = await prisma.$queryRaw`
      SELECT r.*,
             u1.full_name as reporter_name,
             u2.full_name as provider_name,
             sr.provider_id,
             sr.status_detail,
             p.status as payment_status
      FROM request_report r
      JOIN "user" u1 ON u1.id = r.reporter_id
      JOIN service_request sr ON sr.id = r.request_id
      JOIN "user" u2 ON u2.id = sr.provider_id
      LEFT JOIN payment p ON p.service_request_id = sr.id
      ORDER BY r.created_at DESC
    `;

    const transformed = (rows as any[]).map((r) => {
      const rawStatus = (r.status ?? r.status_detail ?? '').toString().toLowerCase();
      const status = rawStatus
        ? (['resolved', 'completed', 'closed'].includes(rawStatus) ? 'resolved' : 'ongoing')
        : undefined;

      const idNum = typeof r.id === 'number' ? r.id : parseInt(r.id ?? '0', 10);
      const requestIdNum = typeof r.request_id === 'number'
        ? r.request_id
        : (typeof r.report_id === 'number' ? r.report_id : parseInt(r.report_id ?? r.request_id ?? '0', 10));

      // Determine refund status based on payment status
      let refund_approved: boolean | undefined = undefined;
      if (r.payment_status) {
        const paymentStatus = r.payment_status.toString().toLowerCase();
        if (paymentStatus === 'refunded') {
          refund_approved = true; // Refund was approved
        } else if (paymentStatus === 'released') {
          refund_approved = false; // Refund was denied
        }
        // If payment_status is 'holding' or 'initiated', refund_approved stays undefined (pending)
      }

      return {
        id: idNum,
        reporter_id: r.reporter_id ?? '',
        reporter_name: r.reporter_name ?? '',
        provider_name: r.provider_name ?? '',
        provider_id: r.provider_id ?? '',
        request_id: requestIdNum,
        created_at: r.created_at ? new Date(r.created_at).toISOString() : '',
        ticket_id: (r.ticket_id ?? String(idNum)) as string,
        status,
        refund_approved,
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


