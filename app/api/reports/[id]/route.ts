import { NextResponse } from 'next/server';
import mockReports from '../../../../data/mockReports.js';

// Use context: { params: any } for compatibility with Next.js App Router
export async function GET(request: Request, context: any) {
  const params = await context.params;
  try {
    // TODO: Replace with actual database query when report model is created
    // const report = await prisma.reports.findUnique({
    //   where: { id: params.id },
    //   include: {
    //     reportedBy: true,
    //     reportedUser: true,
    //   },
    // });

    const report = mockReports.find(r => r.id === params.id);

    if (!report) {
      return NextResponse.json({ status: 'error', message: 'Report not found' }, { status: 404 });
    }

    return NextResponse.json({ status: 'success', data: report });
  } catch (error) {
    console.error('Failed to fetch report:', error);
    return NextResponse.json({ status: 'error', message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: any) {
  const params = await context.params;
  try {
    const { status } = await request.json();
    
    // TODO: Replace with actual database query when report model is created
    // const updatedReport = await prisma.reports.update({
    //   where: { id: params.id },
    //   data: { status },
    //   include: {
    //     reportedBy: true,
    //     reportedUser: true,
    //   },
    // });

    const report = mockReports.find(r => r.id === params.id);
    if (!report) {
      return NextResponse.json({ status: 'error', message: 'Report not found' }, { status: 404 });
    }

    // Update the mock data (in a real app, this would persist to database)
    report.status = status;

    return NextResponse.json({ status: 'success', data: report });
  } catch (error) {
    console.error('Failed to update report:', error);
    return NextResponse.json({ status: 'error', message: 'Internal Server Error' }, { status: 500 });
  }
}