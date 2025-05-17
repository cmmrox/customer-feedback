import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET endpoint to fetch all available ratings
export async function GET() {
  try {
    const ratings = await prisma.rating.findMany({
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(ratings);
  } catch (error) {
    console.error('Error fetching ratings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ratings' },
      { status: 500 }
    );
  }
} 