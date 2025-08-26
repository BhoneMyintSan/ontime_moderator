import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

/**
 * GET /api/users/:id
 */
export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const user = await prisma.users.findUnique({
      where: { id: params.id },
      select: {
        id: true, full_name: true, phone: true, status: true,
        address_line_1: true, address_line_2: true, city: true, state_province: true,
        zip_postal_code: true, country: true, joined_at: true, email: true
      },
    });
    if (!user) {
      return NextResponse.json({ status: "error", message: "User not found", data: null }, { status: 404 });
    }
    return NextResponse.json({ status: "success", message: "", data: user });
  } catch (error) {
    console.error("Error fetching user:", error);
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
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
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
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
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
