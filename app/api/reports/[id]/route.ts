import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

interface ReportUpdateData {
  status?: string;
}

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  
  try {
    const reportId = parseInt(params.id);
    
    if (isNaN(reportId)) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid report ID' }, 
        { status: 400 }
      );
    }

    const report = await prisma.reports.findUnique({
      where: { id: reportId },
      include: {
        users: {
          select: {
            id: true,
            full_name: true,
          }
        },
        service_listings: {
          select: {
            id: true,
            title: true,
            users: {
              select: {
                id: true,
                full_name: true,
              }
            }
          }
        }
      }
    });

    if (!report) {
      return NextResponse.json(
        { status: 'error', message: 'Report not found' }, 
        { status: 404 }
      );
    }

    // Transform data to match expected format
    const transformedReport = {
      id: report.id.toString(),
      listing_id: report.listing_id,
      reporter_name: report.users.full_name,
      offender_name: report.service_listings.users.full_name,
      datetime: report.datetime,
      report_reason: report.report_reason,
      status: report.status,
    };

    return NextResponse.json({ 
      status: 'success', 
      message: 'Report retrieved successfully',
      data: transformedReport 
    });
  } catch (error) {
    console.error('Failed to fetch report:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch report' }, 
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  
  try {
    const reportId = parseInt(params.id);
    
    if (isNaN(reportId)) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid report ID' }, 
        { status: 400 }
      );
    }

    const body: ReportUpdateData = await request.json();
    
    if (!body.status) {
      return NextResponse.json(
        { status: 'error', message: 'Status is required' }, 
        { status: 400 }
      );
    }

    // Validate status value
    const validStatuses = ['Resolved', 'Unresolved', 'Pending'];
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid status value' }, 
        { status: 400 }
      );
    }

    const updatedReport = await prisma.reports.update({
      where: { id: reportId },
      data: { status: body.status },
      include: {
        users: {
          select: {
            id: true,
            full_name: true,
          }
        },
        service_listings: {
          select: {
            id: true,
            title: true,
            users: {
              select: {
                id: true,
                full_name: true,
              }
            }
          }
        }
      }
    });

    // Transform data to match expected format
    const transformedReport = {
      id: updatedReport.id.toString(),
      listing_id: updatedReport.listing_id,
      reporter_name: updatedReport.users.full_name,
      offender_name: updatedReport.service_listings.users.full_name,
      datetime: updatedReport.datetime,
      report_reason: updatedReport.report_reason,
      status: updatedReport.status,
    };

    return NextResponse.json({ 
      status: 'success', 
      message: 'Report updated successfully',
      data: transformedReport 
    });
  } catch (error) {
    console.error('Failed to update report:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { status: 'error', message: 'Report not found' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { status: 'error', message: 'Failed to update report' }, 
      { status: 500 }
    );
  }
}