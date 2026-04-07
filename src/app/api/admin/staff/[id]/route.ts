import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

import { requireAdmin } from "@/lib/auth-admin";
import { deleteOrDeactivateStaff, getStaffById, updateStaff } from "@/lib/staff-service";
import { staffMutationSchema } from "@/lib/staff-validation";

function handleZodError(error: ZodError) {
  return NextResponse.json(
    {
      error: "Validation failed",
      details: error.flatten(),
    },
    { status: 400 }
  );
}

export async function GET(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await context.params;
  const staff = await getStaffById(id);

  if (!staff) {
    return NextResponse.json({ error: "Staff member not found" }, { status: 404 });
  }

  return NextResponse.json(staff);
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    const { id } = await context.params;
    const body = await request.json();
    const input = staffMutationSchema.parse(body);
    const staff = await updateStaff(id, input);
    return NextResponse.json(staff);
  } catch (error) {
    if (error instanceof ZodError) {
      return handleZodError(error);
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ error: "Staff member not found" }, { status: 404 });
    }

    console.error("Error updating staff:", error);
    return NextResponse.json({ error: "Failed to update staff member" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    const { id } = await context.params;
    const result = await deleteOrDeactivateStaff(id);

    return NextResponse.json({
      message:
        result.mode === "deleted"
          ? "Staff member deleted"
          : "Staff member had feedback history and was deactivated instead",
      mode: result.mode,
      feedbackCount: result.feedbackCount,
      staff: result.staff,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ error: "Staff member not found" }, { status: 404 });
    }

    console.error("Error deleting/deactivating staff:", error);
    return NextResponse.json({ error: "Failed to delete staff member" }, { status: 500 });
  }
}
