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

    const user = await prisma.users.findUnique({
      where: { id: params.id },
      include: {
        reports: true, // Reports made by this user
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

/**
 * PATCH /api/users/:id
 * Allows partial updates; only fields present will be updated.
 */
export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  try {
    const body = await req.json();
    const updated = await prisma.users.update({
      where: { id: params.id },
      data: body,
    });
    return NextResponse.json({ status: "success", message: "User updated", data: updated });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to update user", data: null },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/users/:id
 */
export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  try {
    await prisma.users.delete({ where: { id: params.id } });
    return NextResponse.json({ status: "success", message: "User deleted", data: {} });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to delete user", data: null },
      { status: 500 }
    );
  }
}