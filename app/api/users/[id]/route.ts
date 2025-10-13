import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

/**
 * GET /api/users/:id
 */
export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    
    if (!params || !params.id) {
      return NextResponse.json(
        { status: "error", message: "User ID is required", data: null }, 
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        report: true, // Reports made by this user
        warning: {
          orderBy: {
            created_at: 'desc'
          }
        }, // Warnings issued to this user
      },
    });
    if (!user) {
      return NextResponse.json({ status: "error", message: "User not found", data: null }, { status: 404 });
    }
    return NextResponse.json({ status: "success", message: "", data: user });
  } catch (error) {
    console.error("Error in GET /api/users/[id]:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch user", data: null },
      { status: 500 }
    );
  }
}


