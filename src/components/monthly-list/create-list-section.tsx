"use client";

import { Plus, Save } from "lucide-react";
import { useMemo, useState } from "react";

import { DataTable } from "@/components/data-table/data-table";
import { FinalListOutput } from "@/components/monthly-list/final-list-output";
import { createListItemsColumns } from "@/components/monthly-list/list-items-columns";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ListItemRow, Medicine, MedicineListItem } from "@/types/medicine";

type CreateListSectionProps = {
  medicines: Medicine[];
  draftItems: MedicineListItem[];
  listName: string;
  month: string;
  onListNameChange: (value: string) => void;
  onMonthChange: (value: string) => void;
  onAddItem: (medicineId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onSaveList: () => void | Promise<void>;
  isSaving?: boolean;
};

function getCurrentMonthValue() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${now.getFullYear()}-${month}`;
}

export function CreateListSection({
  medicines,
  draftItems,
  listName,
  month,
  onListNameChange,
  onMonthChange,
  onAddItem,
  onRemoveItem,
  onSaveList,
  isSaving = false,
}: CreateListSectionProps) {
  const [selectedMedicineId, setSelectedMedicineId] = useState("");
  const [quantity, setQuantity] = useState("1");

  const selectedMedicine = medicines.find(
    (medicine) => medicine.id === selectedMedicineId,
  );

  const listRows: ListItemRow[] = useMemo(
    () =>
      draftItems.map((item) => ({
        ...item,
        medicine_name:
          medicines.find((medicine) => medicine.id === item.medicine_id)
            ?.name ?? "Unknown medicine",
      })),
    [draftItems, medicines],
  );

  const columns = useMemo(
    () => createListItemsColumns({ onRemove: onRemoveItem }),
    [onRemoveItem],
  );

  const handleMedicineChange = (medicineId: string) => {
    setSelectedMedicineId(medicineId);
    const medicine = medicines.find((item) => item.id === medicineId);
    if (medicine) {
      setQuantity(String(medicine.default_quantity));
    }
  };

  const handleAddItem = () => {
    const parsedQuantity = Number(quantity);
    if (!selectedMedicineId || !parsedQuantity || parsedQuantity < 1) return;

    onAddItem(selectedMedicineId, parsedQuantity);
    setSelectedMedicineId("");
    setQuantity("1");
  };

  const canSave = listName.trim() && month && draftItems.length > 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New List</CardTitle>
          <CardDescription>
            Select a month, add medicines, and save your monthly purchase list.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="list-name">List name</Label>
              <Input
                id="list-name"
                value={listName}
                onChange={(event) => onListNameChange(event.target.value)}
                placeholder="e.g. March Purchase"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="list-month">Month</Label>
              <Input
                id="list-month"
                type="month"
                value={month || getCurrentMonthValue()}
                onChange={(event) => onMonthChange(event.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 rounded-lg border p-4 sm:grid-cols-[1fr_120px_auto] sm:items-end">
            <div className="space-y-2">
              <Label>Medicine</Label>
              <Select
                value={selectedMedicineId}
                onValueChange={handleMedicineChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select medicine" />
                </SelectTrigger>
                <SelectContent>
                  {medicines.map((medicine) => (
                    <SelectItem key={medicine.id} value={medicine.id}>
                      {medicine.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-quantity">Quantity</Label>
              <Input
                id="item-quantity"
                type="number"
                min={1}
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                placeholder={
                  selectedMedicine
                    ? String(selectedMedicine.default_quantity)
                    : "1"
                }
              />
            </div>
            <Button onClick={handleAddItem} disabled={!selectedMedicineId}>
              <Plus data-icon="inline-start" />
              Add
            </Button>
          </div>

          <DataTable columns={columns} data={listRows} />

          <div className="flex justify-end">
            <Button
              onClick={() => void onSaveList()}
              disabled={!canSave || isSaving}
            >
              <Save data-icon="inline-start" />
              {isSaving ? "Saving..." : "Save list"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <FinalListOutput
        listName={listName || "Untitled list"}
        month={month || getCurrentMonthValue()}
        items={listRows}
      />
    </div>
  );
}
