import type { Medicine } from "@/types/medicine";

import type { IMedicine } from "../models/medicine";

export function serializeMedicine(doc: IMedicine): Medicine {
  return {
    id: doc._id.toString(),
    name: doc.name,
    default_quantity: doc.default_quantity,
    created_at: doc.created_at.toISOString(),
  };
}
