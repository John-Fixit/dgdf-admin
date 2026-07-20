# DGD Foundation — Admin Portal

Vite + React + TypeScript admin dashboard for managing gallery media, site content, donations, and contact messages.

## Stack

- React 18 + Vite + TypeScript (strict)
- Tailwind CSS
- shadcn-style UI primitives (`Button`, `Input`, `Card`, `Label`, `Badge`)
- Framer Motion
- TanStack Query & TanStack Table
- Zustand (auth + UI)
- React Router v6
- Axios
- Lucide React

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check and production build |
| `npm run preview` | Preview the production build |

## Environment

Copy `.env.example` to `.env`:

```
VITE_API_URL=http://localhost:5000/api
```

Data currently uses an in-memory mock layer in `src/lib/api.ts` so the portal works without a backend.

## Mock login

- **Email:** `admin@dgdelightfound.org`
- **Password:** `admin123`

## Routes

| Path | Access | Page |
| --- | --- | --- |
| `/login` | Public | Login |
| `/dashboard` | Protected | Dashboard stats |
| `/gallery` | Protected | Gallery manager |
| `/content` | Protected | Site content editor |
| `/donations` | Protected | Donations table |
| `/messages` | Protected | Messages inbox |

## Brand tokens

- Sidebar: `#0F2744`
- Main background: `#F4F6F9`
- Active nav accent: `#F0A500`
- Primary button: `#1A3A5C`
- Font: Plus Jakarta Sans
