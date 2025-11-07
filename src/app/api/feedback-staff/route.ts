import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { feedbackId, staffId } = body;

    if (!feedbackId || !staffId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify feedback exists (should already be created from homepage)
    const feedback = await prisma.feedback.findUnique({
      where: { id: feedbackId }
    });

    if (!feedback) {
      return NextResponse.json(
        { error: 'Feedback not found. Please start from the homepage.' },
        { status: 404 }
      );
    }

    // Create or update the feedback staff entry
    const feedbackStaff = await prisma.feedbackStaff.upsert({
      where: {
        feedbackId_staffId: {
          feedbackId,
          staffId
        }
      },
      update: {},
      create: {
        feedbackId,
        staffId
      }
    });

    return NextResponse.json(feedbackStaff);
  } catch (error) {
    console.error('Error creating feedback staff:', error);
    return NextResponse.json(
      { error: 'Failed to create feedback staff entry' },
      { status: 500 }
    );
  }
} 