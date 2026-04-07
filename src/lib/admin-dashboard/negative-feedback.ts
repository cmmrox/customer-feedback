import { prisma } from "@/lib/db";

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;

export interface NegativeFeedbackListItem {
  id: string;
  timestamp: string;
  overallRating: string;
  reasons: string[];
}

export interface NegativeFeedbackListResult {
  items: NegativeFeedbackListItem[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export function normalizePositiveInteger(value: string | null, fallback: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  return Math.floor(parsed);
}

export async function getPaginatedNegativeFeedback(options: {
  page?: number;
  pageSize?: number;
} = {}): Promise<NegativeFeedbackListResult> {
  const page = options.page && options.page > 0 ? Math.floor(options.page) : 1;
  const requestedPageSize = options.pageSize && options.pageSize > 0 ? Math.floor(options.pageSize) : DEFAULT_PAGE_SIZE;
  const pageSize = Math.min(requestedPageSize, MAX_PAGE_SIZE);
  const now = new Date();

  const where = {
    overallRating: "NOT_SATISFIED",
    timestamp: {
      lte: now,
    },
  } as const;

  const totalItems = await prisma.feedback.count({ where });
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(page, totalPages);
  const skip = (safePage - 1) * pageSize;

  const feedback = await prisma.feedback.findMany({
    where,
    orderBy: [
      {
        timestamp: "desc",
      },
      {
        id: "desc",
      },
    ],
    skip,
    take: pageSize,
    select: {
      id: true,
      timestamp: true,
      overallRating: true,
      feedbackReasons: {
        select: {
          reason: {
            select: {
              description: true,
            },
          },
        },
      },
    },
  });

  return {
    items: feedback.map((item) => ({
      id: item.id,
      timestamp: item.timestamp.toISOString(),
      overallRating: item.overallRating,
      reasons: item.feedbackReasons.map((entry) => entry.reason.description),
    })),
    page: safePage,
    pageSize,
    totalItems,
    totalPages,
  };
}
