import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

/**
 * GET /api/users
 * Returns: { status, message, data: [...] }
 */
export async function GET() {
  try {
    const users = await prisma.user.findMany({ 
      orderBy: { joined_at: "desc" },
      select: {
        id: true,
        full_name: true,
        is_email_signedup: true,
        phone: true,
        status: true,
        address_line_1: true,
        address_line_2: true,
        city: true,
        state_province: true,
        zip_postal_code: true,
        country: true,
        joined_at: true,
        token_balance: true,

      },
    });


    return NextResponse.json({ status: "success", message: "", data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch users", data: [] },
      { status: 500 }
    );
  }
}

/**
 * POST /api/users
 */
export async function POST(req: Request) {
  const body = await req.json();

  const required = [
    "id","full_name","phone","status","address_line_1","address_line_2",
    "city","state_province","zip_postal_code","country","joined_at","email","token_balance"
  ];
  for (const k of required) if (body[k] === undefined) {
    return NextResponse.json({ status: "error", message: `Missing field: ${k}`, data: null }, { status: 400 });
  }

  const created = await prisma.user.create({ data: body });
  return NextResponse.json({ status: "success", message: "User created", data: created }, { status: 201 });
}
