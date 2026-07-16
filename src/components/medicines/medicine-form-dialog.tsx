"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Medicine } from "@/types/medicine"

type MedicineFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  medicine?: Medicine | null
  onSave: (data: { name: string; default_quantity: number }) => void
}

export function MedicineFormDialog({
  open,
  onOpenChange,
  medicine,
  onSave,
}: MedicineFormDialogProps) {
  const [name, setName] = useState("")
  const [defaultQuantity, setDefaultQuantity] = useState("1")
  const [wasOpen, setWasOpen] = useState(open)

  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) {
      setName(medicine?.name ?? "")
      setDefaultQuantity(String(medicine?.default_quantity ?? 1))
    }
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const quantity = Number(defaultQuantity)
    if (!name.trim() || !quantity || quantity < 1) return

    onSave({
      name: name.trim(),
      default_quantity: quantity,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{medicine ? "Edit Medicine" : "Add Medicine"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="medicine-name">Medicine name</Label>
            <Input
              id="medicine-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Extor 5/80"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="default-quantity">Default quantity (dhabi)</Label>
            <Input
              id="default-quantity"
              type="number"
              min={1}
              value={defaultQuantity}
              onChange={(event) => setDefaultQuantity(event.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{medicine ? "Save changes" : "Add medicine"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
