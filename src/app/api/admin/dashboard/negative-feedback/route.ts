import { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth-admin";
import {
  getPaginatedNegativeFeedback,
  InvalidNegativeFeedbackMonthError,
  normalizePositiveInteger,
} from "@/lib/admin-dashboard/negative-feedback";

function normalizeMonth(value: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin();

    if (!auth.ok) {
      return auth.response;
    }

    const { searchParams } = new URL(request.url);
    const page = normalizePositiveInteger(searchParams.get("page"), 1);
    const pageSize = normalizePositiveInteger(searchParams.get("pageSize"), 10);
    const month = normalizeMonth(searchParams.get("month"));

    const result = await getPaginatedNegativeFeedback({ page, pageSize, month });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof InvalidNegativeFeedbackMonthError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error("Failed to fetch negative feedback dashboard data:", error);
    return NextResponse.json({ error: "Failed to fetch negative feedback records" }, { status: 500 });
  }
}
