import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid medicine id");

export const createListItemSchema = z.object({
  medicine_id: objectIdSchema,
  quantity: z.number().int().min(1),
});

export const createListSchema = z
  .object({
    list_name: z.string().trim().min(1).max(255),
    month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Month must be YYYY-MM"),
    items: z.array(createListItemSchema).min(1),
  })
  .refine(
    (data) => {
      const ids = data.items.map((item) => item.medicine_id);
      return new Set(ids).size === ids.length;
    },
    { message: "Duplicate medicines are not allowed", path: ["items"] },
  );

export type CreateListSchema = z.infer<typeof createListSchema>;
