import { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth-admin";
import { getPaginatedNegativeFeedback, normalizePositiveInteger } from "@/lib/admin-dashboard/negative-feedback";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin();

    if (!auth.ok) {
      return auth.response;
    }

    const { searchParams } = new URL(request.url);
    const page = normalizePositiveInteger(searchParams.get("page"), 1);
    const pageSize = normalizePositiveInteger(searchParams.get("pageSize"), 10);

    const result = await getPaginatedNegativeFeedback({ page, pageSize });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch negative feedback dashboard data:", error);
    return NextResponse.json({ error: "Failed to fetch negative feedback records" }, { status: 500 });
  }
}
