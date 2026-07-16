# Backend Build Plan

Mentor notes for wiring a real backend (MongoDB) behind the existing frontend. Read this first, then the two API docs, then the open questions before you start coding.

## The two modules, in build order

1. **Medicines** — the catalog. Build this first; the list module depends on it. See [01-medicines-api.md](01-medicines-api.md).
2. **Monthly Lists** — create + view only, no edit/delete for now. See [02-lists-api.md](02-lists-api.md).

Also read [03-open-questions.md](03-open-questions.md) — decisions that need your call before or during implementation, not things I decided for you.

## Steps to actually build this

1. Pick and install a MongoDB client (`mongodb` native driver vs. `mongoose`) — see open questions #1. Nothing is installed yet, per [AGENTS.md](../AGENTS.md).
2. Add `MONGODB_URI` to a new `.env.local` (never commit it) and create `.env.example` with a placeholder.
3. Create `src/lib/mongodb.ts` — a cached connection helper (Next.js dev hot-reload will re-run module code, so cache the client on `globalThis` to avoid opening a new connection per request).
4. Create the `medicines` collection and its route handlers under `src/app/api/medicines/` (doc 01).
5. Swap the in-memory handlers in `src/app/page.tsx` for real fetch calls to `/api/medicines` and confirm the Medicines tab works end to end (add, edit, delete, search, pagination).
6. Create the `lists` collection and its route handlers under `src/app/api/lists/` (doc 02).
7. Swap `handleSaveList` and the saved-lists load in `src/app/page.tsx` for real fetch calls to `/api/lists` and confirm Create List + Saved Lists tabs work end to end.
8. Once the response shape is proven out, update the "Routes And API" section of [AGENTS.md](../AGENTS.md) with the final envelope — it currently says no convention exists yet.

## Conventions to use across both modules

- Base path: `/api` — route handlers live under `src/app/api/**/route.ts` (App Router convention).
- Response envelope (proposed, confirm before building):
  ```json
  { "success": true, "data": {} }
  { "success": false, "error": { "message": "..." } }
  ```
- Paginated responses nest pagination info under `meta`:
  ```json
  { "success": true, "data": [], "meta": { "page": 1, "limit": 10, "total": 42, "totalPages": 5 } }
  ```
- IDs: use MongoDB's `_id`, but serialize it as `id` (string) in API responses — the frontend types (`Medicine.id`, `MedicineListItem.id`, etc.) already expect `id`, not `_id`.
- Validate at the route handler boundary. No validation library is installed yet — decide with open question #2 before writing the first handler.
- Timestamps: store `created_at` (and `updated_at` where relevant) as ISO strings or `Date` — match the existing frontend types, which use ISO strings.
