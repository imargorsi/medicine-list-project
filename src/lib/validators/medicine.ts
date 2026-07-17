import { z } from "zod";

export const createMedicineSchema = z.object({
  name: z.string().trim().min(1).max(255),
  default_quantity: z.number().min(1).int(),
});

export type CreateMedicineSchema = z.infer<typeof createMedicineSchema>;


export const updateMedicineSchema = createMedicineSchema.partial().refine((data) => data.name !== undefined || data.default_quantity !== undefined, {
  message: "At least one of name or default_quantity must be present",
});

export type UpdateMedicineSchema = z.infer<typeof updateMedicineSchema>;