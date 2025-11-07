import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const feedbackSchema = z.object({
  overallRating: z.enum(['GOOD', 'NOT_SATISFIED']),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = feedbackSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input. overallRating must be GOOD or NOT_SATISFIED' },
        { status: 400 }
      );
    }

    const feedback = await prisma.feedback.create({
      data: {
        overallRating: parsed.data.overallRating,
      },
    });

    return NextResponse.json(
      { feedbackId: feedback.id, success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create feedback:', error);
    return NextResponse.json(
      { error: 'Failed to create feedback' },
      { status: 500 }
    );
  }
}
