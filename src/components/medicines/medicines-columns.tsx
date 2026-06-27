import type { ColumnDef } from "@tanstack/react-table"
import { Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { Medicine } from "@/types/medicine"

type CreateMedicinesColumnsOptions = {
  onEdit: (medicine: Medicine) => void
  onDelete: (medicine: Medicine) => void
}

export function createMedicinesColumns({
  onEdit,
  onDelete,
}: CreateMedicinesColumnsOptions): ColumnDef<Medicine>[] {
  return [
    {
      accessorKey: "name",
      header: "Medicine",
    },
    {
      accessorKey: "default_quantity",
      header: "Default Qty",
      cell: ({ row }) => `${row.original.default_quantity} dhabi`,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onEdit(row.original)}
            aria-label={`Edit ${row.original.name}`}
          >
            <Pencil />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onDelete(row.original)}
            aria-label={`Delete ${row.original.name}`}
          >
            <Trash2 />
          </Button>
        </div>
      ),
    },
  ]
}
