import { supabase } from "@/lib/supabase"
import type { MedicineList, MedicineListItem } from "@/types/medicine"

type MedicineJoin = { name: string } | { name: string }[] | null

function getMedicineName(medicines: MedicineJoin) {
  if (!medicines) return "Unknown medicine"
  if (Array.isArray(medicines)) return medicines[0]?.name ?? "Unknown medicine"
  return medicines.name
}

export async function fetchMedicineLists(): Promise<MedicineList[]> {
  const { data: lists, error: listsError } = await supabase
    .from("medicine_lists")
    .select("*")
    .order("created_at", { ascending: false })

  if (listsError) throw listsError
  if (!lists?.length) return []

  const { data: items, error: itemsError } = await supabase
    .from("medicine_list_items")
    .select("id, list_id, medicine_id, quantity")

  if (itemsError) throw itemsError

  return lists.map((list) => ({
    ...list,
    items: (items ?? []).filter((item) => item.list_id === list.id),
  }))
}

export async function fetchListItemsWithNames(listId: string) {
  const { data, error } = await supabase
    .from("medicine_list_items")
    .select("id, list_id, medicine_id, quantity, medicines ( name )")
    .eq("list_id", listId)

  if (error) throw error

  return (data ?? []).map((item) => ({
    id: item.id,
    list_id: item.list_id,
    medicine_id: item.medicine_id,
    quantity: item.quantity,
    medicine_name: getMedicineName(item.medicines as MedicineJoin),
  }))
}

export async function saveMedicineList(
  listName: string,
  month: string,
  items: Pick<MedicineListItem, "medicine_id" | "quantity">[],
): Promise<MedicineList> {
  const { data: list, error: listError } = await supabase
    .from("medicine_lists")
    .insert({ list_name: listName, month })
    .select()
    .single()

  if (listError) throw listError

  const { data: savedItems, error: itemsError } = await supabase
    .from("medicine_list_items")
    .insert(
      items.map((item) => ({
        list_id: list.id,
        medicine_id: item.medicine_id,
        quantity: item.quantity,
      })),
    )
    .select()

  if (itemsError) throw itemsError

  return {
    ...list,
    items: savedItems ?? [],
  }
}
