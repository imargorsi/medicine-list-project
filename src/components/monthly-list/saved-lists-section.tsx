"use client"

import { useMemo, useState } from "react"

import { FinalListOutput, formatMonth } from "@/components/monthly-list/final-list-output"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Medicine, MedicineList } from "@/types/medicine"

type SavedListsSectionProps = {
  lists: MedicineList[]
  medicines: Medicine[]
}

export function SavedListsSection({ lists, medicines }: SavedListsSectionProps) {
  const [selectedListId, setSelectedListId] = useState("")
  const [prevLists, setPrevLists] = useState(lists)

  if (lists !== prevLists) {
    setPrevLists(lists)
    if (lists.length > 0 && !lists.some((list) => list.id === selectedListId)) {
      setSelectedListId(lists[0].id)
    }
  }

  const selectedList = lists.find((list) => list.id === selectedListId)

  const selectedRows = useMemo(() => {
    if (!selectedList) return []

    return selectedList.items.map((item) => ({
      ...item,
      medicine_name:
        medicines.find((medicine) => medicine.id === item.medicine_id)?.name ??
        "Unknown medicine",
    }))
  }, [selectedList, medicines])

  if (lists.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Saved Lists</CardTitle>
          <CardDescription>
            No saved lists yet. Create a monthly list to see it here.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Saved Lists</CardTitle>
          <CardDescription>View and copy your previously saved monthly lists.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {lists.map((list) => (
            <div
              key={list.id}
              className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">{list.list_name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatMonth(list.month)} · {list.items.length} medicines
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{list.items.length} items</Badge>
                <Button
                  variant={selectedListId === list.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedListId(list.id)}
                >
                  View
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {selectedList ? (
        <FinalListOutput
          listName={selectedList.list_name}
          month={selectedList.month}
          items={selectedRows}
        />
      ) : null}
    </div>
  )
}
