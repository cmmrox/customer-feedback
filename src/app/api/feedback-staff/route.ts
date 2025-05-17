import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { feedbackId, staffId, ratingId } = body;

    if (!feedbackId || !staffId || !ratingId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // First, ensure the feedback record exists
    let feedback = await prisma.feedback.findUnique({
      where: { id: feedbackId }
    });

    // If feedback doesn't exist, create it
    if (!feedback) {
      feedback = await prisma.feedback.create({
        data: {
          id: feedbackId,
          overallRating: 'GOOD'
        }
      });
    }

    // Create or update the feedback staff rating
    const feedbackStaff = await prisma.feedbackStaff.upsert({
      where: {
        feedbackId_staffId: {
          feedbackId,
          staffId
        }
      },
      update: {
        ratingId
      },
      create: {
        feedbackId,
        staffId,
        ratingId
      }
    });

    return NextResponse.json(feedbackStaff);
  } catch (error) {
    console.error('Error creating feedback staff:', error);
    return NextResponse.json(
      { error: 'Failed to create feedback staff rating' },
      { status: 500 }
    );
  }
} 