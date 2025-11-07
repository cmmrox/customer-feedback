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

  // Count ALL GOOD feedbacks in this month
  const count = await prisma.feedback.count({
    where: {
      overallRating: 'GOOD',
      timestamp: {
        gte: start,
        lte: end,
      },
    },
  });

  return NextResponse.json({ count });
}

