import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { subMonths, startOfMonth, endOfMonth, format } from 'date-fns';

export async function GET() {
  // Calculate the last 6 months (including current)
  const months: { label: string; start: Date; end: Date }[] = [];
  for (let i = 5; i >= 0; i--) {
    const date = subMonths(new Date(), i);
    months.push({
      label: format(date, 'MMM yyyy'),
      start: startOfMonth(date),
      end: endOfMonth(date),
    });
  }

  // Get dissatisfaction count for each month
  const data = await Promise.all(
    months.map(async (month) => {
      const count = await prisma.feedback.count({
        where: {
          overallRating: 'NOT_SATISFIED',
          timestamp: {
            gte: month.start,
            lte: month.end,
          },
        },
      });

      return {
        month: month.label,
        count,
      };
    })
  );

  return NextResponse.json({ data });
}

