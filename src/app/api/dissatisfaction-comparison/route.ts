import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

function parseMonthYear(monthStr: string): Date {
  // Converts 'June 2025' to a Date object for '2025-06-01'
  return new Date(Date.parse(monthStr + ' 1'));
}

interface ReasonCount {
  reason: string;
  value: number;
}

interface TrendData {
  reason: string;
  currentCount: number;
  previousCount: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  change: number;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const monthStr = searchParams.get('month'); // e.g., 'January 2025'
  if (!monthStr) {
    return NextResponse.json({ error: 'Month is required' }, { status: 400 });
  }

  let currentStart: Date, currentEnd: Date, previousStart: Date, previousEnd: Date;
  try {
    const parsedDate = parseMonthYear(monthStr);
    currentStart = startOfMonth(parsedDate);
    currentEnd = endOfMonth(parsedDate);

    const previousMonth = subMonths(parsedDate, 1);
    previousStart = startOfMonth(previousMonth);
    previousEnd = endOfMonth(previousMonth);
  } catch {
    return NextResponse.json({ error: 'Invalid month format' }, { status: 400 });
  }

  // Helper function to get dissatisfaction data for a date range
  async function getDissatisfactionData(start: Date, end: Date): Promise<ReasonCount[]> {
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

    const feedbackIds = feedbacks.map((f: { id: string }) => f.id);

    if (feedbackIds.length === 0) {
      return [];
    }

    // Count by reason
    const reasons = await prisma.feedbackReason.groupBy({
      by: ['reasonId'],
      where: { feedbackId: { in: feedbackIds } },
      _count: true,
    });

    // Get reason descriptions
    const reasonDetails = await prisma.dissatisfactionReason.findMany({
      where: { id: { in: reasons.map((r: { reasonId: string }) => r.reasonId) } },
      select: { id: true, description: true },
    });

    const reasonMap = Object.fromEntries(
      reasonDetails.map((r: { id: string; description: string }) => [r.id, r.description])
    );

    return reasons.map((r: { reasonId: string; _count: number }) => ({
      reason: reasonMap[r.reasonId] || 'Unknown',
      value: r._count,
    }));
  }

  // Fetch data for both months
  const currentData = await getDissatisfactionData(currentStart, currentEnd);
  const previousData = await getDissatisfactionData(previousStart, previousEnd);

  // Build a map for previous month data
  const previousMap = new Map<string, number>();
  previousData.forEach((item) => {
    previousMap.set(item.reason, item.value);
  });

  // Calculate trends
  const trends: TrendData[] = currentData.map((item) => {
    const previousCount = previousMap.get(item.reason) || 0;
    const currentCount = item.value;
    const change = currentCount - previousCount;

    let trend: 'increasing' | 'decreasing' | 'stable';
    if (change > 0) {
      trend = 'increasing';
    } else if (change < 0) {
      trend = 'decreasing';
    } else {
      trend = 'stable';
    }

    return {
      reason: item.reason,
      currentCount,
      previousCount,
      trend,
      change,
    };
  });

  // Also include reasons that were in previous month but not in current month
  previousData.forEach((item) => {
    const existsInCurrent = currentData.some((c) => c.reason === item.reason);
    if (!existsInCurrent) {
      trends.push({
        reason: item.reason,
        currentCount: 0,
        previousCount: item.value,
        trend: 'decreasing',
        change: -item.value,
      });
    }
  });

  return NextResponse.json({
    currentMonth: currentData,
    previousMonth: previousData,
    trends,
  });
}
