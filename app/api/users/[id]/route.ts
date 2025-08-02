import { prisma } from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        reportsFiled: true,
        reportsReceived: true,
        moderationLogs: true,
      },
    });

    if (!user) {
      return NextResponse.json({ status: 'error', message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ status: 'success', data: user });
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return NextResponse.json({ status: 'error', message: 'Internal Server Error' }, { status: 500 });
  }
}
