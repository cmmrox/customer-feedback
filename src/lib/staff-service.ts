import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";
import { removeStaffImageByUrl } from "@/lib/file-storage";
import { getStaffImageUrl } from "@/lib/image-utils";
import type { AdminStaffListQuery, StaffMutationInput } from "@/lib/staff-validation";

const adminStaffSelect = {
  id: true,
  name: true,
  imageUrl: true,
  position: true,
  contactInfo: true,
  status: true,
  updatedAt: true,
} satisfies Prisma.StaffSelect;

function buildAdminWhere(query: AdminStaffListQuery): Prisma.StaffWhereInput {
  const where: Prisma.StaffWhereInput = {};

  if (query.status === "active") where.status = true;
  if (query.status === "inactive") where.status = false;

  if (query.search) {
    where.OR = [
      { name: { contains: query.search } },
      { position: { contains: query.search } },
      { contactInfo: { contains: query.search } },
    ];
  }

  return where;
}

function mapAdminStaff(member: {
  id: string;
  name: string;
  imageUrl: string | null;
  position: string | null;
  contactInfo: string | null;
  status: boolean;
  updatedAt: Date;
}) {
  return {
    ...member,
    imageUrl: getStaffImageUrl(member.imageUrl),
    position: member.position ?? "",
    contactInfo: member.contactInfo ?? "",
    updatedAt: member.updatedAt.toISOString(),
  };
}

export async function listAdminStaff(query: AdminStaffListQuery) {
  const rows = await prisma.staff.findMany({
    where: buildAdminWhere(query),
    select: adminStaffSelect,
    orderBy: [{ status: "desc" }, { name: "asc" }],
  });

  return rows.map(mapAdminStaff);
}

export async function createStaff(input: StaffMutationInput) {
  const created = await prisma.staff.create({
    data: {
      name: input.name,
      position: input.position,
      contactInfo: input.contactInfo,
      status: input.status,
      imageUrl: input.imageUrl,
    },
    select: adminStaffSelect,
  });

  return mapAdminStaff(created);
}

export async function updateStaff(id: string, input: StaffMutationInput) {
  const existing = await prisma.staff.findUnique({
    where: { id },
    select: { imageUrl: true },
  });

  const updated = await prisma.staff.update({
    where: { id },
    data: {
      name: input.name,
      position: input.position,
      contactInfo: input.contactInfo,
      status: input.status,
      imageUrl: input.imageUrl,
    },
    select: adminStaffSelect,
  });

  if (existing?.imageUrl && input.imageUrl && existing.imageUrl !== input.imageUrl) {
    await removeStaffImageByUrl(existing.imageUrl);
  }

  return mapAdminStaff(updated);
}

export async function deleteOrDeactivateStaff(id: string) {
  const existing = await prisma.staff.findUnique({
    where: { id },
    select: { imageUrl: true },
  });

  const feedbackCount = await prisma.feedbackStaff.count({ where: { staffId: id } });

  if (feedbackCount > 0) {
    const updated = await prisma.staff.update({
      where: { id },
      data: { status: false },
      select: adminStaffSelect,
    });

    return {
      mode: "deactivated" as const,
      staff: mapAdminStaff(updated),
      feedbackCount,
    };
  }

  const deleted = await prisma.staff.delete({
    where: { id },
    select: adminStaffSelect,
  });

  if (existing?.imageUrl) {
    await removeStaffImageByUrl(existing.imageUrl);
  }

  return {
    mode: "deleted" as const,
    staff: mapAdminStaff(deleted),
    feedbackCount: 0,
  };
}

export async function getStaffById(id: string) {
  const row = await prisma.staff.findUnique({
    where: { id },
    select: adminStaffSelect,
  });

  return row ? mapAdminStaff(row) : null;
}
