import { useMemo, useState } from "react"
import { Plus } from "lucide-react"

import { DataTable } from "@/components/data-table/data-table"
import { MedicineFormDialog } from "@/components/medicines/medicine-form-dialog"
import { createMedicinesColumns } from "@/components/medicines/medicines-columns"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Medicine } from "@/types/medicine"

type MedicinesSectionProps = {
  medicines: Medicine[]
  onAdd: (data: { name: string; default_quantity: number }) => void | Promise<void>
  onEdit: (id: string, data: { name: string; default_quantity: number }) => void | Promise<void>
  onDelete: (id: string) => void | Promise<void>
}

export function MedicinesSection({
  medicines,
  onAdd,
  onEdit,
  onDelete,
}: MedicinesSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null)

  const columns = useMemo(
    () =>
      createMedicinesColumns({
        onEdit: (medicine) => {
          setEditingMedicine(medicine)
          setDialogOpen(true)
        },
        onDelete: (medicine) => {
          void onDelete(medicine.id)
        },
      }),
    [onDelete],
  )

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Medicines</CardTitle>
          <CardDescription>
            Manage your medicine catalog. These appear in the monthly list dropdown.
          </CardDescription>
        </div>
        <Button
          onClick={() => {
            setEditingMedicine(null)
            setDialogOpen(true)
          }}
        >
          <Plus data-icon="inline-start" />
          Add Medicine
        </Button>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={medicines}
          searchKey="name"
          searchPlaceholder="Search medicines..."
        />
      </CardContent>

      <MedicineFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        medicine={editingMedicine}
        onSave={(data) => {
          if (editingMedicine) {
            void onEdit(editingMedicine.id, data)
          } else {
            void onAdd(data)
          }
        }}
      />
    </Card>
  )
}
