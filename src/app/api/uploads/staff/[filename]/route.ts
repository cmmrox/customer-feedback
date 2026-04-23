import { NextRequest, NextResponse } from "next/server";

import { readStaffImage } from "@/lib/file-storage";

const CONTENT_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
};

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await context.params;
    const file = await readStaffImage(filename);
    const extension = filename.slice(filename.lastIndexOf(".")).toLowerCase();
    const contentType = CONTENT_TYPES[extension] || "application/octet-stream";

    return new NextResponse(file, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }
}
