import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { staffId, type, sessionId } = body;

    if (!staffId || !type || !sessionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const rating = await prisma.rating.create({
      data: {
        staffId,
        type,
        sessionId
      }
    });

    return NextResponse.json(rating);
  } catch (error) {
    console.error('Error creating rating:', error);
    return NextResponse.json(
      { error: 'Failed to create rating' },
      { status: 500 }
    );
  }
}

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