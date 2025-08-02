import { prisma } from '../../../lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  console.log("Prisma loaded:", typeof prisma.user); // 
  const users = await prisma.user.findMany();         // This line fails if prisma.user is undefined

  return NextResponse.json({
    status: "success",
    message: "",
    data: users,
  });
}
