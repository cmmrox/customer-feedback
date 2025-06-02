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

  // Get all staff
  const staff = await prisma.staff.findMany({
    select: { id: true, name: true },
  });

  // For each month, count selections per staff
  const data = await Promise.all(
    months.map(async (month) => {
      // Get FeedbackStaff for this month
      const feedbacks = await prisma.feedback.findMany({
        where: {
          timestamp: {
            gte: month.start,
            lte: month.end,
          },
        },
        select: { id: true },
      });
      const feedbackIds = feedbacks.map((f) => f.id);
      // Count selections per staff
      const counts: Record<string, number> = {};
      staff.forEach((s) => (counts[s.name] = 0));
      if (feedbackIds.length > 0) {
        const feedbackStaff = await prisma.feedbackStaff.findMany({
          where: {
            feedbackId: { in: feedbackIds },
          },
          select: { staffId: true },
        });
        feedbackStaff.forEach((fs) => {
          const staffName = staff.find((s) => s.id === fs.staffId)?.name;
          if (staffName) counts[staffName]++;
        });
      }
      return {
        month: month.label,
        ...counts,
      };
    })
  );

  // Also return staff names for chart legend
  const staffNames = staff.map((s) => s.name);

  return NextResponse.json({ data, staffNames });
} 