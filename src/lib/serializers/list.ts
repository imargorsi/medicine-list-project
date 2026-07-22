import type { MedicineList, MedicineListItem } from "@/types/medicine";

import type { IList, IListItem } from "../models/list";

export function serializeListItem(
  item: IListItem,
  listId: string,
): MedicineListItem {
  return {
    id: item._id.toString(),
    list_id: listId,
    medicine_id: item.medicine_id.toString(),
    medicine_name: item.medicine_name,
    quantity: item.quantity,
  };
}

export function serializeList(list: IList): MedicineList {
  const id = list._id.toString();

  return {
    id,
    list_name: list.list_name,
    month: list.month,
    created_at: list.created_at.toISOString(),
    items: list.items.map((item) => serializeListItem(item, id)),
  };
}
