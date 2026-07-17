"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ListItemRow } from "@/types/medicine";

type FinalListOutputProps = {
  listName: string;
  month: string;
  items: ListItemRow[];
};

function formatMonth(month: string) {
  const [year, monthNumber] = month.split("-");
  const date = new Date(Number(year), Number(monthNumber) - 1);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function buildListText(listName: string, month: string, items: ListItemRow[]) {
  const header = `${listName} — ${formatMonth(month)}`;
  const lines = items.map(
    (item) => `${item.medicine_name} — ${item.quantity} dhabi`,
  );
  return [header, "", ...lines].join("\n");
}

export function FinalListOutput({
  listName,
  month,
  items,
}: FinalListOutputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(buildListText(listName, month, items));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Final List</CardTitle>
          <CardDescription>
            {listName} · {formatMonth(month)}
          </CardDescription>
        </div>
        <Button
          variant="outline"
          onClick={handleCopy}
          disabled={items.length === 0}
        >
          {copied ? (
            <Check data-icon="inline-start" />
          ) : (
            <Copy data-icon="inline-start" />
          )}
          {copied ? "Copied" : "Copy list"}
        </Button>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No medicines in this list yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
              >
                <span>{item.medicine_name}</span>
                <span className="font-medium">{item.quantity} dhabi</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export { buildListText, formatMonth };
