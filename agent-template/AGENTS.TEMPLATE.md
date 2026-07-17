# You Are An Expert Next.js And TypeScript Engineer Helping Build [APP_NAME]

Write clean, simple, maintainable code. Prioritize clarity over unnecessary abstraction.
Think like a senior full-stack product engineer.

<!--
AI AGENT NOTES — FILL FROM CODEBASE:
- Replace [APP_NAME] with the real product name (package.json name, README title, or product copy).
- Keep this file at the project root as AGENTS.md after customization.
- Do not invent project facts. Infer stack, folders, auth, and docs from package.json, app/, lib/, and existing docs.
-->

---

## Project Overview

We are building [APP_NAME], [ONE_LINE_DESCRIPTION].

The app includes:

- [FEATURE_1]
- [FEATURE_2]
- [FEATURE_3]
- [FEATURE_4]
- [FEATURE_5]

Keep the implementation simple and readable.

<!--
AI AGENT NOTES — FILL FROM CODEBASE:
- ONE_LINE_DESCRIPTION: README / marketing blurb / app purpose in one sentence.
- FEATURE_LIST: derive from routes in app/, modules in doc/, sidebar nav, or product docs.
- Prefer real product features over generic filler.
-->

---

## Tech Stack

<!--
AI AGENT NOTES — FILL FROM CODEBASE:
- Read package.json dependencies and scripts first.
- Keep only libraries that are actually installed.
- Mark optional lines with [OPTIONAL] or delete them.
- Ask before adding anything not already in the project.
-->

- Next.js ([App Router | Pages Router — detect from `app/` vs `pages/`])
- React
- TypeScript
- [CSS_APPROACH — e.g. Tailwind CSS, CSS Modules, styled-components]
- [SERVER_STATE — e.g. TanStack Query, RTK Query, SWR]
- [DATABASE_ORM — e.g. MongoDB + Mongoose, Prisma + PostgreSQL]
- [VALIDATION — e.g. Zod]
- [AUTH_PROVIDER — e.g. NextAuth, Clerk, custom bearer tokens]
- [OTHER_CORE_LIBS]
- ESLint 9 (flat config) + Prettier — copy from `agent-template/eslint-prettier-setup.md` on setup

Do not introduce new major libraries unless there is a strong reason.
Ask before installing anything new.

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

<!--
AI AGENT NOTES — FILL FROM CODEBASE:
- Inspect the actual top-level folders and replace the example tree below.
- Do not invent folders that do not exist.
- Document where routes, UI, business logic, schemas, and client hooks live in THIS repo.
-->

Use this folder structure:

```text
[ROOT_FOLDERS_TREE — copy from the real repo, example:]
app/
  (auth)/
  (dashboard)/
  api/
components/
features/
hooks/
lib/
public/
types/
```

`app/` is for routes, layouts, and API route handlers only.

<!--
AI AGENT NOTES — ADAPT THESE RULES TO THE REAL LAYOUT:
- Where does business logic live? (often lib/, services/, or server/)
- Where does validation live? (often schemas/, validators/)
- Where do reusable UI pieces live? (often components/, ui/, sections/)
- Where do client data hooks live? (often features/, hooks/, api/)
-->

- Keep heavy business logic in `[BUSINESS_LOGIC_DIR]`.
- Keep validation in `[VALIDATION_DIR]`.
- Build reusable UI in `[UI_DIR]`.
- Keep client API hooks in `[CLIENT_API_PATTERN — e. for example features/{module}/{module}.api.ts]`.

### DO

- Use [SERVER_STATE] for all server communication
- Always go with the simple, straightforward, and clean solution — never overcomplicate or overengineer
- Try to never go above 250 lines for a single component — separate logic into utils, hooks, or sub-components

### DON'T

- Mix UI and business logic

---

## Naming Conventions

| Thing      | Convention        | Example                     |
| ---------- | ----------------- | --------------------------- |
| Components | PascalCase        | `UserCard.tsx`              |
| Functions  | camelCase         | `handleSubmit`              |
| Interfaces | `I` prefix        | `IUserProfile`              |
| Types      | `T` prefix        | `TApiResponse`              |
| Booleans   | `is`/`has` prefix | `isActive`, `hasPermission` |
| Hook files | `.hook.ts`        | `useAuth.hook.ts`           |
| Util files | `.utils.ts`       | `formatDate.utils.ts`       |
| Type files | `.types.ts`       | `user.types.ts`             |

<!--
AI AGENT NOTES:
- If the existing codebase uses different conventions (for example no I/T prefixes),
  prefer matching the repo over forcing this table.
- Note any local overrides in this section after inspecting real files.
-->

---

## UI Rules

For any UI task:

- Match the existing app style and patterns exactly.
- Keep spacing, typography, hierarchy, and interaction behavior consistent.
- Do not redesign existing patterns unless requested.

<!--
AI AGENT NOTES — FILL FROM CODEBASE:
- Find design system / shared UI primitives under components or ui folders.
- Note layout shells, spacing patterns, and recurring class patterns before editing UI.
-->

---

## Styling Rules

Use [CSS_APPROACH] and existing design tokens/patterns.
Avoid custom CSS unless there is a clear need.
Reuse established class patterns and shared UI components.

### Colors — Never Hardcode

Always use theme variables. Never use hex, rgb, or named colors directly.

<!--
AI AGENT NOTES — FILL FROM CODEBASE:
- Locate theme tokens (CSS variables, Tailwind theme, design tokens file).
- Prefer existing token names over inventing new ones.
-->

---

## State Management

- [SERVER_STATE] for server state
- React local state for temporary UI state
- [CLIENT_PERSISTENCE — e.g. localStorage helpers, cookies, none] only through existing helpers

---

## TypeScript

- Strict mode
- No `any`
- Keep types simple and readable
- Use [VALIDATION] schemas for API input validation when present

---

## Feature Implementation

When building a feature:

1. Read this file first.
2. Identify the files to change.
3. Keep changes focused.
4. Do not rewrite unrelated code.
5. Follow existing patterns.
6. Make sure the feature works end to end.
7. Fix lint and type errors before finishing.

---

## Secrets

- Never expose secret keys in client code.
- Keep secrets in environment variables.
- Use server routes/services for tokens and external API calls.

<!--
AI AGENT NOTES — FILL FROM CODEBASE:
- List required env vars from .env.example if present.
- Do not commit secrets or .env.local.
-->

---

## Authentication

Use the existing [AUTH_PROVIDER] auth flow and guards.
Do not introduce a parallel custom auth system.

<!--
AI AGENT NOTES — FILL FROM CODEBASE:
- Find auth helpers, middleware, session/token storage, and route guards.
- Document the real guard order (example: requireAuth -> requireVerifiedEmail -> requireRole).
- Note public vs protected route groups under app/.
-->

---

## Routes And API

<!--
AI AGENT NOTES — FILL FROM CODEBASE:
- Map important app routes from app/ (or pages/).
- Map API prefixes from app/api/ (example: /api/v1/*).
- Note response envelope conventions if the project has one.
-->

- UI route groups: `[UI_ROUTE_GROUPS — e.g. (auth), (dashboard)]`
- API prefix: `[API_PREFIX — e.g. /api/v1]`
- API response contract: `[API_ENVELOPE — e.g. { success, message, data, errors }]`

---

## Communication

Be concise. Explain what changed and how to test it.

---

## Documentation Map

<!--
AI AGENT NOTES — FILL FROM CODEBASE:
- Link only files that exist.
- If docs/ or doc/ is missing, create a minimal map or leave a short note.
-->

Core docs:

- `doc/[CORE_DOC_1].md`
- `doc/[CORE_DOC_2].md`
- `doc/[CORE_DOC_3].md`

Feature / module docs:

- `doc/modules/[MODULE_DOC_1].md`
- `doc/modules/[MODULE_DOC_2].md`

Shareable starters (copy from `agent-template/` into each new project):

- `agent-template/README.md` — index of starters
- `agent-template/AGENTS.TEMPLATE.md` — this file
- `agent-template/eslint-prettier-setup.md` — ESLint + Prettier + format/lint on save

---

## Final Reminder

Before every feature:

- Read this file.
- Follow it strictly.
- Build clean, simple code.
- Match existing UI patterns exactly when designs are provided.

<!--
HOW TO USE THIS TEMPLATE:
1. Copy this file to AGENTS.md at the project root.
2. Replace every [PLACEHOLDER].
3. Remove HTML comments after customization (optional, but preferred for a final AGENTS.md).
4. Confirm stack and folders against package.json and the real repository layout.
5. On new-project setup, also apply starters from agent-template/ (e.g. eslint-prettier-setup.md).
-->
