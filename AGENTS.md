# You Are An Expert Next.js And TypeScript Engineer Helping Build Medicine List

Write clean, simple, maintainable code. Prioritize clarity over unnecessary abstraction.
Think like a senior full-stack product engineer.

---

## Project Overview

We are building Medicine List, a small app for tracking a personal medicine catalog and building monthly purchase lists from it.

The app includes:

- A medicine catalog (name + default purchase quantity) with add/edit/delete
- A "Create List" flow that picks medicines from the catalog, sets a quantity, and names/dates the list by month
- Saved monthly lists you can browse later
- A final list output view for copying the list quickly (e.g. to share or print)
- Toast feedback (via sonner) for create/update/delete actions

There is currently no backend. `src/app/page.tsx` holds everything in React state and explicitly says so in a comment — nothing persists across a page refresh yet. This is the biggest gap to close next: real persistence (API routes + a database) behind the same handler shapes already used by the section components.

---

## Tech Stack

- Next.js 16.2.10 (App Router, Turbopack — see `next.config.ts`)
- React 19.2.4
- TypeScript (strict)
- Tailwind CSS v4 + shadcn (`components.json`: style `radix-nova`, base color `neutral`, CSS variables on) — components are pulled via the shadcn CLI into `src/components/ui/`
- `radix-ui` (consolidated package) underlies the shadcn primitives
- `@tanstack/react-table` for the `DataTable` (sorting, global filter, pagination)
- `lucide-react` for icons
- `sonner` for toasts
- `class-variance-authority`, `clsx` + `tailwind-merge` (via `cn()` in `src/lib/utils.ts`), `tw-animate-css` for styling utilities

Not yet in the project — do not add without asking first: a server-state library (TanStack Query/SWR/etc.), an ORM or database client, a validation library (e.g. Zod), an auth provider. When backend work starts, ask which of these to introduce rather than assuming.

---

## Development Philosophy

Build feature by feature.
For every feature:

1. Read this file first.
2. Keep the implementation simple.
3. Avoid overengineering.
4. Prefer readable code over clever code.
5. Build the smallest useful version first.
6. Refactor only when repetition appears.

---

## Decision Making

If something is unclear or could be improved, suggest a better approach.
If a new library would significantly help, recommend it, explain why, and ask before adding it.
Do not install new libraries without approval.

---

## Architecture

Current folder structure:

```text
src/
  app/
    layout.tsx        # root layout, fonts, metadata, <Toaster />
    page.tsx           # single route "/" — owns all state today (no backend)
    globals.css         # Tailwind v4 + theme tokens
  components/
    data-table/
      data-table.tsx    # generic TanStack Table wrapper (search, sort, pagination)
    medicines/
      medicine-form-dialog.tsx
      medicines-columns.tsx
      medicines-section.tsx
    monthly-list/
      create-list-section.tsx
      final-list-output.tsx
      list-items-columns.tsx
      saved-lists-section.tsx
    ui/                 # shadcn primitives: badge, button, card, dialog,
                          dropdown-menu, input, label, select, separator,
                          sonner, table, tabs
  lib/
    utils.ts             # cn() helper
  types/
    medicine.ts           # Medicine, MedicineList, MedicineListItem, ListItemRow
public/
```

`src/app/` is for routes, layouts, and (future) API route handlers only — it currently has no `api/` subfolder.

- There is no dedicated business-logic folder yet. `src/app/page.tsx` owns all state and handlers (`handleAddMedicine`, `handleSaveList`, etc.) and passes them down as props to the section components. When a backend is added, move data access/mutation out of `page.tsx` into `src/lib/` (e.g. `src/lib/medicines.ts`) or into route handlers under `src/app/api/`, and keep the same prop shapes where practical so the section components don't need to change.
- There is no validation folder yet — add one (e.g. `src/lib/validators/`) once a validation library is chosen.
- Reusable, unstyled/low-level UI lives in `src/components/ui/` (shadcn primitives). Feature-specific composed UI lives in `src/components/{feature}/` (`medicines/`, `monthly-list/`).
- There is no client API hook layer (`hooks/` or `features/*.api.ts`) yet — introduce one only once real data fetching exists; don't build it ahead of the backend.

### DO

- Lift state to the nearest common owner (currently `page.tsx`) and pass data + handlers down as props, matching the existing sections.
- Always go with the simple, straightforward, and clean solution — never overcomplicate or overengineer.
- Try to never go above 250 lines for a single component — separate logic into utils, hooks, or sub-components.
- Reuse `DataTable` (`src/components/data-table/data-table.tsx`) for any new tabular data instead of building a new table.

### DON'T

- Mix UI and business logic.
- Add persistence, a database, or an API layer speculatively — ask first, since none exists yet and the shape should be agreed on.

---

## Naming Conventions

The codebase does not use the `I`/`T` prefix convention — match what's actually here:

| Thing | Convention | Example |
|-------|-----------|---------|
| Component files | kebab-case | `medicine-form-dialog.tsx` |
| Components | PascalCase | `MedicineFormDialog` |
| Functions | camelCase | `handleAddMedicine` |
| Event handler props/functions | `handle`/`on` prefix | `handleSaveList`, `onEdit` |
| Types | PascalCase, no prefix | `Medicine`, `MedicineListItem` |
| Booleans | `is`/`has` prefix | `isSavingList` |
| Shared helpers | `.utils.ts` under `lib/` | `src/lib/utils.ts` |

No hook files (`.hook.ts`) exist yet since there are no custom hooks — follow this pattern (kebab-case file, one hook per file under `src/hooks/`, matching the `@/hooks` alias already reserved in `components.json`) if you add the first one.

---

## UI Rules

For any UI task:

- Match the existing app style and patterns exactly: `Tabs` for top-level navigation, `Card`/`CardHeader`/`CardTitle`/`CardDescription`/`CardContent` for sections, `DataTable` for tabular data, dialogs (`MedicineFormDialog`) for create/edit forms.
- Leading icons on buttons use `data-icon="inline-start"` on the icon (see `medicines-section.tsx`) — follow that pattern rather than manual margin classes.
- Keep spacing, typography, hierarchy, and interaction behavior consistent with the existing sections.
- Do not redesign existing patterns unless requested.

---

## Styling Rules

Use Tailwind CSS v4 and the existing design tokens. Avoid custom CSS unless there is a clear need. Reuse established class patterns and shared UI components from `src/components/ui/`.

### Colors — Never Hardcode

Always use the theme tokens defined in `src/app/globals.css` (`--background`, `--foreground`, `--card`, `--primary`, `--muted`, `--destructive`, `--border`, etc., exposed as Tailwind classes like `bg-background`, `text-muted-foreground`, `border-border`). Never use hex, rgb, or named colors directly. Both light (`:root`) and dark (`.dark`) values are already defined, even though no theme toggle is wired up yet.

---

## State Management

- No server-state library yet. All data currently lives in React state in `src/app/page.tsx` and flows down via props — follow this pattern until a backend and a chosen data-fetching library are in place.
- No client persistence (localStorage, cookies, etc.) — a page refresh currently loses all data, by design for now. Don't add ad hoc persistence without asking; it should arrive together with the real backend.

---

## TypeScript

- Strict mode
- No `any`
- Keep types simple and readable — plain `type` aliases, no `I`/`T` prefixes (see Naming Conventions)
- No validation library is installed yet; when one is added, validate at the API boundary (route handlers), not throughout the UI

---

## Feature Implementation

When building a feature:

1. Read this file first.
2. Identify the files to change.
3. Keep changes focused.
4. Do not rewrite unrelated code.
5. Follow existing patterns.
6. Make sure the feature works end to end.
7. Fix lint and type errors before finishing (`npm run lint`).

---

## Secrets

- Never expose secret keys in client code.
- Keep secrets in environment variables.
- Use server routes/services for tokens and external API calls.

No `.env.example` exists yet — there are no environment variables in the project today. Add one alongside the first server-side integration that needs secrets.

---

## Authentication

No auth provider is installed. Do not introduce one without asking first — there are no auth helpers, middleware, or route guards to follow yet, so this needs a decision, not an assumption.

---

## Routes And API

- UI routes: `/` only (`src/app/page.tsx`), rendering three tabs (Medicines, Create List, Saved Lists) client-side.
- No API routes exist yet (no `src/app/api/`).
- No response envelope convention exists yet — agree on one (e.g. `{ success, data, error }`) when the first route handler is added, and stay consistent afterward.

---

## Communication

Be concise. Explain what changed and how to test it.

---

## Documentation Map

No `doc/` folder exists in this project yet. For Next.js/Tailwind/shadcn behavior, treat `node_modules/next/dist/docs/` as the source of truth over training data (see the breaking-changes note at the top of this file) — check the installed package docs for Tailwind v4 and the shadcn CLI similarly when in doubt.

---

## Final Reminder

Before every feature:

- Read this file.
- Follow it strictly.
- Build clean, simple code.
- Match existing UI patterns exactly when designs are provided.
- Don't add a backend, persistence, or auth speculatively — these are known gaps, but the shape should be agreed on first.
