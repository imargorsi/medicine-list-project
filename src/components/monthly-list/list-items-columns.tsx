import type { ColumnDef } from "@tanstack/react-table"
import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { ListItemRow } from "@/types/medicine"

type CreateListItemsColumnsOptions = {
  onRemove: (itemId: string) => void
}

export function createListItemsColumns({
  onRemove,
}: CreateListItemsColumnsOptions): ColumnDef<ListItemRow>[] {
  return [
    {
      accessorKey: "medicine_name",
      header: "Medicine",
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row }) => `${row.original.quantity} dhabi`,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onRemove(row.original.id)}
          aria-label={`Remove ${row.original.medicine_name}`}
        >
          <Trash2 />
        </Button>
      ),
    },
  ]
}
