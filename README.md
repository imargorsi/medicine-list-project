# Medicine List

A small personal medicine catalog and monthly purchase-list app.

## Features

- Add, edit, delete, search, and browse medicines
- Persist the medicine catalog in MongoDB
- Build a monthly purchase list from catalog medicines
- Set quantities and copy the final list
- Browse saved monthly lists
- Toast feedback for create, update, and delete actions

The medicine catalog is fully connected to the backend. Monthly lists currently
use client-side state and will be connected to the Lists API next.

## Tech stack

- Next.js 16 (App Router) and React 19
- TypeScript
- Tailwind CSS v4 and shadcn/ui
- Mongoose and MongoDB
- Zod

## Local setup

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
MONGODB_URI=your_mongodb_connection_string
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Medicines API

- `GET /api/medicines` — list medicines; optional `?search=`
- `POST /api/medicines` — create a medicine
- `PATCH /api/medicines/:id` — update a medicine
- `DELETE /api/medicines/:id` — delete a medicine

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run format:check
```
