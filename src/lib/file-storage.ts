import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const STAFF_UPLOAD_ROOT = process.env.UPLOAD_DIR?.trim() || path.join(process.cwd(), "public", "uploads");
const STAFF_UPLOAD_DIR = path.join(STAFF_UPLOAD_ROOT, "staff");

function parseDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:(image\/(png|jpeg|jpg|webp));base64,(.+)$/);
  if (!match) {
    throw new Error("Invalid image payload");
  }

  const mimeType = match[1];
  const format = match[2] === "jpg" ? "jpeg" : match[2];
  const base64 = match[3];

  return { mimeType, format, base64 };
}

export async function saveStaffImageFromDataUrl(dataUrl: string, staffId?: string) {
  const { format, base64 } = parseDataUrl(dataUrl);
  const buffer = Buffer.from(base64, "base64");

  if (buffer.byteLength > 5 * 1024 * 1024) {
    throw new Error("Image payload too large");
  }

  await mkdir(STAFF_UPLOAD_DIR, { recursive: true });

  const safeId = staffId?.trim() || crypto.randomUUID();
  const fileName = `${safeId}-${Date.now()}.${format}`;
  const absolutePath = path.join(STAFF_UPLOAD_DIR, fileName);

  await writeFile(absolutePath, buffer);

  return {
    imageUrl: `/uploads/staff/${fileName}`,
    fileName,
    absolutePath,
  };
}

export async function removeStaffImageByUrl(imageUrl: string | null | undefined) {
  if (!imageUrl || !imageUrl.startsWith("/uploads/staff/")) {
    return;
  }

  const relativePath = imageUrl.replace(/^\/uploads\//, "");
  const absolutePath = path.join(STAFF_UPLOAD_ROOT, relativePath);

  try {
    await unlink(absolutePath);
  } catch {
    // best effort cleanup only
  }
}
