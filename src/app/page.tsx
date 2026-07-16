"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"

import { CreateListSection } from "@/components/monthly-list/create-list-section"
import { SavedListsSection } from "@/components/monthly-list/saved-lists-section"
import { MedicinesSection } from "@/components/medicines/medicines-section"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Medicine, MedicineList, MedicineListItem } from "@/types/medicine"

// NOTE: This page currently manages all state in memory on the client.
// There is no backend wired up yet — swap these handlers for real API calls
// (REST route handlers, server actions, a database, etc.) when the backend
// is ready. Nothing here persists across a page refresh.

function createId() {
  return crypto.randomUUID()
}

function getCurrentMonthValue() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  return `${now.getFullYear()}-${month}`
}

export default function Home() {
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [savedLists, setSavedLists] = useState<MedicineList[]>([])
  const [activeTab, setActiveTab] = useState("create-list")
  const [isSavingList, setIsSavingList] = useState(false)

  const [listName, setListName] = useState("")
  const [month, setMonth] = useState(getCurrentMonthValue())
  const [draftItems, setDraftItems] = useState<MedicineListItem[]>([])

  const resetDraft = () => {
    setListName("")
    setMonth(getCurrentMonthValue())
    setDraftItems([])
  }

  const handleAddMedicine = (data: { name: string; default_quantity: number }) => {
    const medicine: Medicine = {
      id: createId(),
      name: data.name,
      default_quantity: data.default_quantity,
      created_at: new Date().toISOString(),
    }
    setMedicines((current) =>
      [...current, medicine].sort((a, b) => a.name.localeCompare(b.name)),
    )
    toast.success("Medicine added.")
  }

  const handleEditMedicine = (
    id: string,
    data: { name: string; default_quantity: number },
  ) => {
    setMedicines((current) =>
      current
        .map((item) => (item.id === id ? { ...item, ...data } : item))
        .sort((a, b) => a.name.localeCompare(b.name)),
    )
    toast.success("Medicine updated.")
  }

  const handleDeleteMedicine = (id: string) => {
    setMedicines((current) => current.filter((medicine) => medicine.id !== id))
    toast.success("Medicine deleted.")
  }

  const handleAddDraftItem = (medicineId: string, quantity: number) => {
    setDraftItems((current) => {
      const existingItem = current.find((item) => item.medicine_id === medicineId)
      if (existingItem) {
        return current.map((item) =>
          item.medicine_id === medicineId ? { ...item, quantity } : item,
        )
      }

      return [
        ...current,
        {
          id: createId(),
          list_id: "draft",
          medicine_id: medicineId,
          quantity,
        },
      ]
    })
  }

  const handleRemoveDraftItem = (itemId: string) => {
    setDraftItems((current) => current.filter((item) => item.id !== itemId))
  }

  const handleSaveList = () => {
    if (!listName.trim() || !month || draftItems.length === 0) return

    setIsSavingList(true)
    const newList: MedicineList = {
      id: createId(),
      list_name: listName.trim(),
      month,
      created_at: new Date().toISOString(),
      items: draftItems.map((item) => ({
        ...item,
        id: createId(),
      })),
    }

    setSavedLists((current) => [newList, ...current])
    resetDraft()
    setActiveTab("saved-lists")
    toast.success("List saved successfully.")
    setIsSavingList(false)
  }

  const sortedMedicines = useMemo(
    () => [...medicines].sort((a, b) => a.name.localeCompare(b.name)),
    [medicines],
  )

  return (
    <div className="min-h-svh bg-background">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 sm:p-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Medicine List</h1>
          <p className="text-sm text-muted-foreground">
            Save monthly medicines, build purchase lists, and copy the final list quickly.
          </p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="medicines">Medicines</TabsTrigger>
            <TabsTrigger value="create-list">Create List</TabsTrigger>
            <TabsTrigger value="saved-lists">Saved Lists</TabsTrigger>
          </TabsList>

          <TabsContent value="medicines" className="mt-6">
            <MedicinesSection
              medicines={sortedMedicines}
              onAdd={handleAddMedicine}
              onEdit={handleEditMedicine}
              onDelete={handleDeleteMedicine}
            />
          </TabsContent>

          <TabsContent value="create-list" className="mt-6">
            <CreateListSection
              medicines={sortedMedicines}
              draftItems={draftItems}
              listName={listName}
              month={month}
              isSaving={isSavingList}
              onListNameChange={setListName}
              onMonthChange={setMonth}
              onAddItem={handleAddDraftItem}
              onRemoveItem={handleRemoveDraftItem}
              onSaveList={handleSaveList}
            />
          </TabsContent>

          <TabsContent value="saved-lists" className="mt-6">
            <SavedListsSection lists={savedLists} medicines={medicines} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
