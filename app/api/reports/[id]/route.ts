import { prisma } from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request, context: { params: { id: string } }) {
  const params = await context.params;
  try {
    const report = await prisma.report.findUnique({
      where: { id: params.id },
      include: {
        reportedBy: true,
        reportedUser: true,
      },
    });

    if (!report) {
      return NextResponse.json({ status: 'error', message: 'Report not found' }, { status: 404 });
    }

    return NextResponse.json({ status: 'success', data: report });
  } catch (error) {
    console.error('Failed to fetch report:', error);
    return NextResponse.json({ status: 'error', message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: { params: { id: string } }) {
  const params = await context.params;
  try {
    const { status } = await request.json();
    const updatedReport = await prisma.report.update({
      where: { id: params.id },
      data: { status },
      include: {
        reportedBy: true,
        reportedUser: true,
      },
    });

    return NextResponse.json({ status: 'success', data: updatedReport });
  } catch (error) {
    console.error('Failed to update report:', error);
    return NextResponse.json({ status: 'error', message: 'Internal Server Error' }, { status: 500 });
  }
}