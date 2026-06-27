import type { Medicine, MedicineList } from "@/types/medicine"

export const initialMedicines: Medicine[] = [
  {
    id: "med-1",
    name: "Extor 5/80",
    default_quantity: 2,
    created_at: "2026-01-15T10:00:00.000Z",
  },
  {
    id: "med-2",
    name: "Jentin Met 50/500",
    default_quantity: 4,
    created_at: "2026-01-15T10:00:00.000Z",
  },
  {
    id: "med-3",
    name: "Ascard Plus",
    default_quantity: 3,
    created_at: "2026-01-15T10:00:00.000Z",
  },
  {
    id: "med-4",
    name: "Concor 10 mg",
    default_quantity: 2,
    created_at: "2026-01-15T10:00:00.000Z",
  },
  {
    id: "med-5",
    name: "NovoTeph 20 mg",
    default_quantity: 1,
    created_at: "2026-01-15T10:00:00.000Z",
  },
  {
    id: "med-6",
    name: "Rovista 5 mg",
    default_quantity: 1,
    created_at: "2026-01-15T10:00:00.000Z",
  },
  {
    id: "med-7",
    name: "Amaryl 1 mg",
    default_quantity: 2,
    created_at: "2026-01-15T10:00:00.000Z",
  },
  {
    id: "med-8",
    name: "Glucophage 500 mg",
    default_quantity: 1,
    created_at: "2026-01-15T10:00:00.000Z",
  },
  {
    id: "med-9",
    name: "Ventacid Chewables",
    default_quantity: 1,
    created_at: "2026-01-15T10:00:00.000Z",
  },
]

export const initialMedicineLists: MedicineList[] = [
  {
    id: "list-1",
    list_name: "January Purchase",
    month: "2026-01",
    created_at: "2026-01-20T14:30:00.000Z",
    items: [
      { id: "item-1", list_id: "list-1", medicine_id: "med-1", quantity: 2 },
      { id: "item-2", list_id: "list-1", medicine_id: "med-2", quantity: 4 },
      { id: "item-3", list_id: "list-1", medicine_id: "med-3", quantity: 3 },
      { id: "item-4", list_id: "list-1", medicine_id: "med-4", quantity: 2 },
    ],
  },
]
