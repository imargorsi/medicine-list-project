import { z } from "zod";

export const createMedicineSchema = z.object({
  name: z.string().trim().min(1).max(255),
  default_quantity: z.number().min(1).int(),
});

export type CreateMedicineSchema = z.infer<typeof createMedicineSchema>;
