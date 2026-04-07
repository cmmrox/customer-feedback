import { NextRequest, NextResponse } from "next/server";
import { ZodError, z } from "zod";

import { requireAdmin } from "@/lib/auth-admin";
import { saveStaffImageFromDataUrl } from "@/lib/file-storage";

const imageUploadSchema = z.object({
  imageDataUrl: z.string().min(1, "Image data is required"),
  staffId: z.string().trim().min(1).optional(),
});

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const input = imageUploadSchema.parse(body);
    const result = await saveStaffImageFromDataUrl(input.imageDataUrl, input.staffId);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.flatten() },
        { status: 400 }
      );
    }

    console.error("Error uploading staff image:", error);
    return NextResponse.json({ error: "Failed to upload staff image" }, { status: 500 });
  }
}
