# Monthly Lists API

Create + view only for now — no edit, no delete. Build this after the Medicines API since creating a list requires picking medicines from the catalog.

## Collection: `lists`

- `_id`: ObjectId
- `list_name`: string, trimmed, required
- `month`: string, `"YYYY-MM"`, required (matches the `<input type="month">` in `create-list-section.tsx`)
- `items`: array, required, min length 1 — each item:
  - `medicine_id`: string (the source medicine's `_id`, kept for reference)
  - `medicine_name`: string — **snapshotted at save time**, not a live join
  - `quantity`: number, integer, `>= 1`
- `created_at`: Date

**Design call (mentor note):** embed `items` directly in the list document, and copy `medicine_name` into each item at creation time instead of joining against `medicines` on every read. Why:
- The frontend already renders lists this way (`MedicineList.items` is embedded, no separate fetch per list).
- It keeps saved-list history accurate even if a medicine is later renamed or deleted from the catalog — a list from March should still read "March" the way it looked in March.
- It avoids a join/lookup for a feature that's read-only and low-volume.

---

## 1. Create a list

`POST /api/lists`

- Body:
  ```json
  {
    "list_name": "March Purchase",
    "month": "2026-03",
    "items": [{ "medicine_id": "...", "quantity": 2 }]
  }
  ```
  Note the request only needs `medicine_id` + `quantity` per item — the server resolves and snapshots `medicine_name`.
- Validation:
  - `list_name`: required, non-empty after trim
  - `month`: required, must match `/^\d{4}-\d{2}$/`
  - `items`: required, non-empty array
  - Each `items[].medicine_id`: must reference an existing medicine → `400`/`404` if not found
  - Each `items[].quantity`: integer, `>= 1`
- Steps to implement:
  1. Validate the body shape.
  2. Look up all referenced `medicine_id`s in one query (`$in`), reject if any are missing.
  3. Build the `items` array with `medicine_name` copied in from the lookup.
  4. Insert the list document with `created_at: new Date()`.
- Response: `201` with the created list (same shape as one item in the list-all response below).

## 2. List saved lists

`GET /api/lists`

- No search/pagination required for v1 (small, personal dataset) — see open question #4 if this needs to change later.
- Sort: `created_at` descending (most recent first), matching how `savedLists` is prepended in the current in-memory `handleSaveList`.
- Response:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "...",
        "list_name": "March Purchase",
        "month": "2026-03",
        "created_at": "...",
        "items": [{ "id": "...", "medicine_id": "...", "medicine_name": "...", "quantity": 2 }]
      }
    ]
  }
  ```
  Each item needs its own `id` in the response (the frontend's `MedicineListItem`/`ListItemRow` types require one for React keys and the remove/columns logic) — generate one per item on create (e.g. a fresh ObjectId or UUID per array element), even though items are never edited individually.

No `GET /api/lists/:id` endpoint is needed yet — the frontend loads all lists up front and picks one client-side (`saved-lists-section.tsx`). Add one later only if the list becomes too large to load in full.
