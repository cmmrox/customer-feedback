import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { startOfMonth, endOfMonth } from 'date-fns';

function parseMonthYear(monthStr: string): Date {
  // Converts 'June 2025' to a Date object for '2025-06-01'
  return new Date(Date.parse(monthStr + ' 1'));
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const monthStr = searchParams.get('month'); // e.g., 'June 2025'
  if (!monthStr) {
    return NextResponse.json({ error: 'Month is required' }, { status: 400 });
  }

  let start: Date, end: Date;
  try {
    const parsedDate = parseMonthYear(monthStr);
    start = startOfMonth(parsedDate);
    end = endOfMonth(parsedDate);
  } catch {
    return NextResponse.json({ error: 'Invalid month format' }, { status: 400 });
  }

  // Get all NOT_SATISFIED feedbacks in this month
  const feedbacks = await prisma.feedback.findMany({
    where: {
      overallRating: 'NOT_SATISFIED',
      timestamp: {
        gte: start,
        lte: end,
      },
    },
    select: { id: true },
  });

  const feedbackIds = feedbacks.map(f => f.id);

  let pieData: { reason: string; value: number }[] = [];
  if (feedbackIds.length > 0) {
    // Count by reason
    const reasons = await prisma.feedbackReason.groupBy({
      by: ['reasonId'],
      where: { feedbackId: { in: feedbackIds } },
      _count: true,
    });

    // Get reason descriptions
    const reasonDetails = await prisma.dissatisfactionReason.findMany({
      where: { id: { in: reasons.map(r => r.reasonId) } },
      select: { id: true, description: true },
    });
    const reasonMap = Object.fromEntries(reasonDetails.map(r => [r.id, r.description]));
    pieData = reasons.map(r => ({
      reason: reasonMap[r.reasonId] || 'Unknown',
      value: r._count,
    }));
  }

  return NextResponse.json({
    count: feedbackIds.length,
    pieData,
  });
} 