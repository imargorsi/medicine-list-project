import { supabase } from "@/lib/supabase"
import type { Medicine } from "@/types/medicine"

export async function fetchMedicines(): Promise<Medicine[]> {
  const { data, error } = await supabase
    .from("medicines")
    .select("*")
    .order("name")

  if (error) throw error
  return data ?? []
}

export async function createMedicine(input: {
  name: string
  default_quantity: number
}): Promise<Medicine> {
  const { data, error } = await supabase
    .from("medicines")
    .insert({
      name: input.name,
      default_quantity: input.default_quantity,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateMedicine(
  id: string,
  input: { name: string; default_quantity: number },
): Promise<Medicine> {
  const { data, error } = await supabase
    .from("medicines")
    .update({
      name: input.name,
      default_quantity: input.default_quantity,
    })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteMedicine(id: string): Promise<void> {
  const { error } = await supabase.from("medicines").delete().eq("id", id)
  if (error) throw error
}
