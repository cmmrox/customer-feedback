import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const feedbackReasonSchema = z.object({
  feedbackId: z.string().min(1),
  reasonId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = feedbackReasonSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Ensure Feedback exists
    let feedback = await prisma.feedback.findUnique({
      where: { id: parsed.data.feedbackId },
    });
    if (!feedback) {
      feedback = await prisma.feedback.create({
        data: {
          id: parsed.data.feedbackId,
          overallRating: 'NOT_SATISFIED',
        },
      });
    }

    await prisma.feedbackReason.create({
      data: {
        feedbackId: parsed.data.feedbackId,
        reasonId: parsed.data.reasonId,
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save feedback reason:', error);
    return NextResponse.json({ error: 'Failed to save feedback reason' }, { status: 500 });
  }
} 