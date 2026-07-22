"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { MedicinesSection } from "@/components/medicines/medicines-section";
import { CreateListSection } from "@/components/monthly-list/create-list-section";
import { SavedListsSection } from "@/components/monthly-list/saved-lists-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  Medicine,
  MedicineList,
  MedicineListItem,
} from "@/types/medicine";

// Medicines and monthly lists are backed by /api/medicines and /api/lists.

type ApiResult<T> =
  { success: true; data: T } | { success: false; error: { message: string } };

function createId() {
  return crypto.randomUUID();
}

function getCurrentMonthValue() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${now.getFullYear()}-${month}`;
}

export default function Home() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [savedLists, setSavedLists] = useState<MedicineList[]>([]);
  const [selectedListId, setSelectedListId] = useState("");
  const [activeTab, setActiveTab] = useState("create-list");
  const [isSavingList, setIsSavingList] = useState(false);

  const [listName, setListName] = useState("");
  const [month, setMonth] = useState(getCurrentMonthValue());
  const [draftItems, setDraftItems] = useState<MedicineListItem[]>([]);

  const resetDraft = () => {
    setListName("");
    setMonth(getCurrentMonthValue());
    setDraftItems([]);
  };

  useEffect(() => {
    const loadMedicines = async () => {
      try {
        const res = await fetch("/api/medicines");
        const result: ApiResult<Medicine[]> = await res.json();
        if (!result.success) {
          toast.error(result.error.message);
          return;
        }
        setMedicines(result.data);
      } catch {
        toast.error("Failed to load medicines.");
      }
    };

    const loadLists = async () => {
      try {
        const res = await fetch("/api/lists");
        const result: ApiResult<MedicineList[]> = await res.json();
        if (!result.success) {
          toast.error(result.error.message);
          return;
        }
        setSavedLists(result.data);
        setSelectedListId((current) => {
          if (current && result.data.some((list) => list.id === current)) {
            return current;
          }
          return result.data[0]?.id ?? "";
        });
      } catch {
        toast.error("Failed to load lists.");
      }
    };

    void loadMedicines();
    void loadLists();
  }, []);

  const handleAddMedicine = async (data: {
    name: string;
    default_quantity: number;
  }) => {
    try {
      const res = await fetch("/api/medicines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result: ApiResult<Medicine> = await res.json();
      if (!result.success) {
        toast.error(result.error.message);
        return;
      }
      setMedicines((current) =>
        [...current, result.data].sort((a, b) => a.name.localeCompare(b.name)),
      );
      toast.success("Medicine added.");
    } catch {
      toast.error("Failed to add medicine.");
    }
  };

  const handleEditMedicine = async (
    id: string,
    data: { name: string; default_quantity: number },
  ) => {
    try {
      const res = await fetch(`/api/medicines/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result: ApiResult<Medicine> = await res.json();
      if (!result.success) {
        toast.error(result.error.message);
        return;
      }
      setMedicines((current) =>
        current
          .map((item) => (item.id === id ? result.data : item))
          .sort((a, b) => a.name.localeCompare(b.name)),
      );
      toast.success("Medicine updated.");
    } catch {
      toast.error("Failed to update medicine.");
    }
  };

  const handleDeleteMedicine = async (id: string) => {
    try {
      const res = await fetch(`/api/medicines/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const result: ApiResult<never> = await res.json();
        toast.error(
          result.success ? "Failed to delete medicine." : result.error.message,
        );
        return;
      }
      setMedicines((current) =>
        current.filter((medicine) => medicine.id !== id),
      );
      toast.success("Medicine deleted.");
    } catch {
      toast.error("Failed to delete medicine.");
    }
  };

  const handleDeleteList = async (id: string) => {
    try {
      const res = await fetch(`/api/lists/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const result: ApiResult<never> = await res.json();
        toast.error(
          result.success ? "Failed to delete list." : result.error.message,
        );
        return;
      }

      setSavedLists((current) => current.filter((list) => list.id !== id));
      setSelectedListId((selected) => {
        if (selected !== id) return selected;
        const remaining = savedLists.filter((list) => list.id !== id);
        return remaining[0]?.id ?? "";
      });
      toast.success("List deleted.");
    } catch {
      toast.error("Failed to delete list.");
    }
  };

  const handleAddDraftItem = (medicineId: string, quantity: number) => {
    setDraftItems((current) => {
      const existingItem = current.find(
        (item) => item.medicine_id === medicineId,
      );
      if (existingItem) {
        return current.map((item) =>
          item.medicine_id === medicineId ? { ...item, quantity } : item,
        );
      }

      return [
        ...current,
        {
          id: createId(),
          list_id: "draft",
          medicine_id: medicineId,
          quantity,
        },
      ];
    });
  };

  const handleRemoveDraftItem = (itemId: string) => {
    setDraftItems((current) => current.filter((item) => item.id !== itemId));
  };

  const handleSaveList = async () => {
    if (!listName.trim() || !month || draftItems.length === 0) return;

    setIsSavingList(true);
    try {
      const res = await fetch("/api/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          list_name: listName.trim(),
          month,
          items: draftItems.map((item) => ({
            medicine_id: item.medicine_id,
            quantity: item.quantity,
          })),
        }),
      });
      const result: ApiResult<MedicineList> = await res.json();
      if (!result.success) {
        toast.error(result.error.message);
        return;
      }

      setSavedLists((current) => [result.data, ...current]);
      setSelectedListId(result.data.id);
      resetDraft();
      setActiveTab("saved-lists");
      toast.success("List saved successfully.");
    } catch {
      toast.error("Failed to save list.");
    } finally {
      setIsSavingList(false);
    }
  };

  const sortedMedicines = useMemo(
    () => [...medicines].sort((a, b) => a.name.localeCompare(b.name)),
    [medicines],
  );

  return (
    <div className="bg-background min-h-svh">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 sm:p-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Medicine List
          </h1>
          <p className="text-muted-foreground text-sm">
            Save monthly medicines, build purchase lists, and copy the final
            list quickly.
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
            <SavedListsSection
              lists={savedLists}
              medicines={medicines}
              selectedListId={selectedListId}
              onSelectList={setSelectedListId}
              onDeleteList={handleDeleteList}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
