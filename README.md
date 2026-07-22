# Medicine List

A small personal medicine catalog and monthly purchase-list app.

## Features

- Add, edit, delete, search, and browse medicines
- Build a monthly purchase list from the catalog
- Save and browse monthly lists (persisted in MongoDB)
- Copy the final list for sharing or printing
- Toast feedback for create, update, and delete actions

## Tech stack

- Next.js 16 (App Router) and React 19
- TypeScript
- Tailwind CSS v4 and shadcn/ui
- Mongoose and MongoDB
- Zod

## Local setup

```bash
npm install
```

Create a `.env` file:

```env
MONGODB_URI=your_mongodb_connection_string
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API

### Medicines

- `GET /api/medicines` — list; optional `?search=`
- `POST /api/medicines` — create
- `PATCH /api/medicines/:id` — update
- `DELETE /api/medicines/:id` — delete (`204`)

### Lists

- `GET /api/lists` — list saved lists (newest first)
- `POST /api/lists` — create a list
- `DELETE /api/lists/:id` — delete a list (`204`)

Full details: [doc/README.md](doc/README.md).

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run format:check
```

## Production note

v1 has **no authentication**. Fine for local use. Do not deploy publicly without adding auth — see [doc/03-open-questions.md](doc/03-open-questions.md).
