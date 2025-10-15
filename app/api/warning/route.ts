import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { emit } from "../../../lib/pusher";

// POST /api/warning
// body: { user_id: string, severity: 'mild' | 'severe', reason: string, comment?: string }
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user_id, severity, reason, comment,listing_id,created_at } = body || {};

    if (!user_id || !severity || !reason) {
      return NextResponse.json(
        { status: "error", message: "Missing required fields: user_id, severity, reason", data: null },
        { status: 400 }
      );
    }

    if (!['mild', 'severe'].includes(severity)) {
      return NextResponse.json(
        { status: "error", message: "Invalid severity. Must be 'mild' or 'severe'", data: null },
        { status: 400 }
      );
    }

    const created = await prisma.warning.create({
      data: {
        user_id,
        severity,
        reason,
        listing_id:listing_id,
        created_at: created_at,
      },
    });

    // Emit realtime events for warnings and the affected user
    await emit('warnings', 'created', created);
    await emit(`user-${user_id}`, 'warning-created', created);

    return NextResponse.json({ status: 'success', message: 'Warning issued', data: created }, { status: 201 });
  } catch (error) {
    console.error('Error issuing warning:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to issue warning', data: null },
      { status: 500 }
    );
  }
}
