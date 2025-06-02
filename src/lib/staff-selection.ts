import { prisma } from "@/lib/db";
import { startOfMonth, endOfMonth } from "date-fns";

/**
 * Represents a staff selection count for a given month.
 */
export interface StaffSelection {
  id: string;
  name: string;
  count: number;
}

/**
 * Fetch staff selection counts for a given month.
 * @param monthString - e.g. 'June 2025'
 * @returns Array of staff selection counts
 */
export async function getStaffSelectionsByMonth(monthString: string): Promise<StaffSelection[]> {
  // Parse month string to date range (expects 'MMMM yyyy', e.g. 'June 2025')
  // Use Date constructor for parsing
  const parsed: Date = new Date(`${monthString} 01`);
  const from: Date = startOfMonth(parsed);
  const to: Date = endOfMonth(parsed);

  // Get feedback IDs for the month
  const feedbacks = await prisma.feedback.findMany({
    where: {
      timestamp: {
        gte: from,
        lte: to,
      },
    },
    select: { id: true },
  });
  const feedbackIds = feedbacks.map(f => f.id);
  if (feedbackIds.length === 0) return [];

  // Group FeedbackStaff by staffId for those feedbacks
  const results = await prisma.feedbackStaff.groupBy({
    by: ['staffId'],
    _count: { staffId: true },
    where: {
      feedbackId: { in: feedbackIds },
    },
  });

  // Get staff names
  const staffIds: string[] = results.map(r => r.staffId);
  const staffList = await prisma.staff.findMany({
    where: { id: { in: staffIds } },
    select: { id: true, name: true },
  });

  // Map results to include staff name
  return results.map(r => ({
    id: r.staffId,
    name: staffList.find(s => s.id === r.staffId)?.name ?? 'Unknown',
    count: r._count.staffId,
  }));
} 