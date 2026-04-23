import { mkdir, writeFile, unlink, readFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const STAFF_UPLOAD_ROOT = process.env.UPLOAD_DIR?.trim() || path.join(process.cwd(), "uploads");
const STAFF_UPLOAD_DIR = path.join(STAFF_UPLOAD_ROOT, "staff");
const STAFF_UPLOAD_URL_PREFIX = "/api/uploads/staff";
const SAFE_FILE_NAME = /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/;

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

export function getStaffImageUrl(fileName: string) {
  return `${STAFF_UPLOAD_URL_PREFIX}/${fileName}`;
}

export function getStaffUploadAbsolutePath(fileName: string) {
  if (!SAFE_FILE_NAME.test(fileName)) {
    throw new Error("Invalid file name");
  }

  return path.join(STAFF_UPLOAD_DIR, fileName);
}

export async function readStaffImage(fileName: string) {
  const absolutePath = getStaffUploadAbsolutePath(fileName);
  return readFile(absolutePath);
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
    imageUrl: getStaffImageUrl(fileName),
    fileName,
    absolutePath,
  };
}

export async function removeStaffImageByUrl(imageUrl: string | null | undefined) {
  if (!imageUrl || !imageUrl.startsWith(`${STAFF_UPLOAD_URL_PREFIX}/`)) {
    return;
  }

  const fileName = imageUrl.replace(`${STAFF_UPLOAD_URL_PREFIX}/`, "");

  try {
    const absolutePath = getStaffUploadAbsolutePath(fileName);
    await unlink(absolutePath);
  } catch {
    // best effort cleanup only
  }
}
