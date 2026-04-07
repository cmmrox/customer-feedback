import { z } from "zod";

const emptyToUndefined = (value: unknown) => {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
};

export const staffStatusEnum = z.enum(["all", "active", "inactive"]);

export const adminStaffListQuerySchema = z.object({
  search: z.preprocess(emptyToUndefined, z.string().max(120).optional()),
  status: z.preprocess(emptyToUndefined, staffStatusEnum.optional()),
});

export const staffMutationSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(120, "Name is too long"),
  position: z.preprocess(emptyToUndefined, z.string().max(120, "Position is too long").optional()),
  contactInfo: z.preprocess(emptyToUndefined, z.string().max(160, "Contact info is too long").optional()),
  status: z.boolean().default(true),
  imageUrl: z.preprocess(emptyToUndefined, z.string().max(500, "Image URL is too long").optional()),
  cropLabel: z.preprocess(emptyToUndefined, z.string().max(160, "Crop label is too long").optional()),
});

export type AdminStaffListQuery = z.infer<typeof adminStaffListQuerySchema>;
export type StaffMutationInput = z.infer<typeof staffMutationSchema>;
