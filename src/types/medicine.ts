export type Medicine = {
  id: string
  name: string
  default_quantity: number
  created_at: string
}

export type MedicineListItem = {
  id: string
  list_id: string
  medicine_id: string
  quantity: number
}

export type MedicineList = {
  id: string
  list_name: string
  month: string
  created_at: string
  items: MedicineListItem[]
}

export type ListItemRow = MedicineListItem & {
  medicine_name: string
}
