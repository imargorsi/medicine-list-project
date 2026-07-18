# Medicines API

The catalog module. Build this before the lists module — creating a list depends on picking an existing medicine.

## Collection: `medicines`

- `_id`: ObjectId
- `name`: string, trimmed, required
- `default_quantity`: number, integer, `>= 1`, required
- `created_at`: Date
- `updated_at`: Date

**Index:** unique index on `name` (case-insensitive — use a collation with `strength: 2`, or store a lowercase `name_normalized` field for lookups) so duplicate medicine names can't be added. Confirmed decision needed — see open question #3.

---

## 1. List medicines (search)

`GET /api/medicines`

- Query params:
  - `search` (optional) — case-insensitive partial match on `name`
- Sort: `name` ascending, always (matches how the frontend currently sorts client-side).
- Pagination: not required for v1; return all matching medicines.
- Response:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "...",
        "name": "...",
        "default_quantity": 10,
        "created_at": "..."
      }
    ]
  }
  ```
- Steps to implement:
  1. Trim the optional `search` query parameter.
  2. Build a case-insensitive partial-match query on `name` when `search` is present.
  3. Query all matches with `.sort({ name: 1 })`.
  4. Map `_id` → `id` in the response.

## 2. Add a medicine

`POST /api/medicines`

- Body: `{ "name": string, "default_quantity": number }`
- Validation:
  - `name`: required, non-empty after trim
  - `default_quantity`: required, integer, `>= 1`
  - Reject if a medicine with the same name (case-insensitive) already exists → `409 Conflict`
- Response: `201` with the created medicine (same shape as one item in the list response).

## 3. Edit a medicine

`PATCH /api/medicines/:id`

- Body: `{ "name"?: string, "default_quantity"?: number }` — same validation rules as create, applied to whichever fields are present.
- `404` if `id` doesn't exist or isn't a valid ObjectId.
- Set `updated_at` on write.
- Response: `200` with the updated medicine.
- **Note:** editing a medicine's name here does _not_ retroactively change medicines already saved inside past monthly lists — see doc 02's snapshot design. That's intentional, not a bug to fix later.

## 4. Delete a medicine

`DELETE /api/medicines/:id`

- `404` if `id` doesn't exist.
- `204` on success, no body.
- **Does not** touch any saved lists that previously referenced this medicine (again, because lists snapshot the name — see doc 02). No cascading delete needed.
