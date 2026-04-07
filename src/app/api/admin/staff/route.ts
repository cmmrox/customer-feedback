import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { requireAdmin } from "@/lib/auth-admin";
import { createStaff, listAdminStaff } from "@/lib/staff-service";
import { adminStaffListQuerySchema, staffMutationSchema } from "@/lib/staff-validation";

function handleZodError(error: ZodError) {
  return NextResponse.json(
    {
      error: "Validation failed",
      details: error.flatten(),
    },
    { status: 400 }
  );
}

export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    const url = new URL(request.url);
    const query = adminStaffListQuerySchema.parse({
      search: url.searchParams.get("search") ?? undefined,
      status: url.searchParams.get("status") ?? undefined,
    });

    const staff = await listAdminStaff(query);
    return NextResponse.json(staff);
  } catch (error) {
    if (error instanceof ZodError) {
      return handleZodError(error);
    }

    console.error("Error listing admin staff:", error);
    return NextResponse.json({ error: "Failed to fetch staff list" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const input = staffMutationSchema.parse(body);
    const staff = await createStaff(input);
    return NextResponse.json(staff, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return handleZodError(error);
    }

    console.error("Error creating staff:", error);
    return NextResponse.json({ error: "Failed to create staff member" }, { status: 500 });
  }
}
