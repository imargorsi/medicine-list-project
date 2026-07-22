import type { CreateListSchema } from "@/lib/validators/list";

import { connectDb } from "../db/mongoose";
import List from "../models/list";
import Medicine from "../models/medicine";
import { serializeList } from "../serializers/list";

export async function createList(input: CreateListSchema) {
  await connectDb();

  const medicineIds = input.items.map((item) => item.medicine_id);
  const uniqueMedicineIds = [...new Set(medicineIds)];

  const medicines = await Medicine.find({
    _id: { $in: uniqueMedicineIds },
  });

  if (medicines.length !== uniqueMedicineIds.length) {
    throw new Error("One or more medicines not found");
  }

  const medicineMap = new Map(
    medicines.map((medicine) => [medicine._id.toString(), medicine.name]),
  );

  const items = input.items.map((item) => {
    const medicine_name = medicineMap.get(item.medicine_id);
    if (!medicine_name) {
      throw new Error("One or more medicines not found");
    }

    return {
      medicine_id: item.medicine_id,
      medicine_name,
      quantity: item.quantity,
    };
  });

  const list = await List.create({
    list_name: input.list_name,
    month: input.month,
    items,
  });

  return serializeList(list);
}
