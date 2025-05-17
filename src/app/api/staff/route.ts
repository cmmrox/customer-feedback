import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const staff = await prisma.staff.findMany({
      where: {
        status: true
      },
      select: {
        id: true,
        name: true,
        imageUrl: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(staff);
  } catch (error) {
    console.error('Error fetching staff:', error);
    return NextResponse.json(
      { error: 'Failed to fetch staff members' },
      { status: 500 }
    );
  }
} 