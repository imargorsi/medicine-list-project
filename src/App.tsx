import { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

import { CreateListSection } from "@/components/monthly-list/create-list-section"
import { SavedListsSection } from "@/components/monthly-list/saved-lists-section"
import { MedicinesSection } from "@/components/medicines/medicines-section"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  createMedicine,
  deleteMedicine,
  fetchMedicines,
  updateMedicine,
} from "@/lib/api/medicines"
import { fetchMedicineLists, saveMedicineList } from "@/lib/api/lists"
import type { Medicine, MedicineList, MedicineListItem } from "@/types/medicine"

function createDraftItemId() {
  return `draft-${crypto.randomUUID()}`
}

function getCurrentMonthValue() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  return `${now.getFullYear()}-${month}`
}

function App() {
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [savedLists, setSavedLists] = useState<MedicineList[]>([])
  const [activeTab, setActiveTab] = useState("create-list")
  const [isLoading, setIsLoading] = useState(true)
  const [isSavingList, setIsSavingList] = useState(false)

  const [listName, setListName] = useState("")
  const [month, setMonth] = useState(getCurrentMonthValue())
  const [draftItems, setDraftItems] = useState<MedicineListItem[]>([])

  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [medicinesData, listsData] = await Promise.all([
        fetchMedicines(),
        fetchMedicineLists(),
      ])
      setMedicines(medicinesData)
      setSavedLists(listsData)
    } catch (error) {
      toast.error("Failed to load data from Supabase.")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const resetDraft = () => {
    setListName("")
    setMonth(getCurrentMonthValue())
    setDraftItems([])
  }

  const handleAddMedicine = async (data: { name: string; default_quantity: number }) => {
    try {
      const medicine = await createMedicine(data)
      setMedicines((current) =>
        [...current, medicine].sort((a, b) => a.name.localeCompare(b.name)),
      )
      toast.success("Medicine added.")
    } catch (error) {
      toast.error("Failed to add medicine.")
      console.error(error)
    }
  }

  const handleEditMedicine = async (
    id: string,
    data: { name: string; default_quantity: number },
  ) => {
    try {
      const medicine = await updateMedicine(id, data)
      setMedicines((current) =>
        current
          .map((item) => (item.id === id ? medicine : item))
          .sort((a, b) => a.name.localeCompare(b.name)),
      )
      toast.success("Medicine updated.")
    } catch (error) {
      toast.error("Failed to update medicine.")
      console.error(error)
    }
  }

  const handleDeleteMedicine = async (id: string) => {
    try {
      await deleteMedicine(id)
      setMedicines((current) => current.filter((medicine) => medicine.id !== id))
      toast.success("Medicine deleted.")
    } catch (error) {
      toast.error("Failed to delete medicine.")
      console.error(error)
    }
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
          id: createDraftItemId(),
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

  const handleSaveList = async () => {
    if (!listName.trim() || !month || draftItems.length === 0) return

    setIsSavingList(true)
    try {
      const newList = await saveMedicineList(
        listName.trim(),
        month,
        draftItems.map((item) => ({
          medicine_id: item.medicine_id,
          quantity: item.quantity,
        })),
      )

      setSavedLists((current) => [newList, ...current])
      resetDraft()
      setActiveTab("saved-lists")
      toast.success("List saved successfully.")
    } catch (error) {
      toast.error("Failed to save list.")
      console.error(error)
    } finally {
      setIsSavingList(false)
    }
  }

  const sortedMedicines = useMemo(
    () => [...medicines].sort((a, b) => a.name.localeCompare(b.name)),
    [medicines],
  )

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading medicines...</p>
      </div>
    )
  }

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

export default App
