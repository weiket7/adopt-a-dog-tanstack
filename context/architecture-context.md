# Architecture Context

## Stack

| Layer     | Technology           | Role                                                     |
| --------- | -------------------- | -------------------------------------------------------- |
| Framework | TanStack Start       | Full-stack app with file-based routing and SSR           |
| Build     | Vite + Cloudflare    | Bundler; deployed to Cloudflare Workers via Wrangler     |
| Routing   | TanStack Router      | Type-safe file-based routing with nested layouts         |
| Database  | Convex               | Real-time reactive database: all domain data and storage |
| Auth      | Convex Auth          | Email-based authentication; role-based access control    |
| Email     | Resend               | Transactional email via @react-email/components          |
| Maps      | Google Maps (vis.gl) | Embedded maps on dog run and vet pages                   |
| Styling   | Custom CSS           | `app.css` for public UI; `admin.css` for admin panel     |

## System Boundaries

- `convex/` — Backend: schema definition, queries, mutations, file storage, auth config, and HTTP actions. All data access lives here.
- `src/routes/` — File-based routes. Public pages render domain data; admin pages add CRUD via Convex mutations.
- `src/components/` — Shared UI primitives (Icon, SocialLink, error boundaries).
- `src/styles/` — Global stylesheets loaded per-route via `?url` imports.
- `src/constants/` — Shared lookup values (areas, categories, etc.).
- `src/utils/` — Client-side utility functions.
- `src/server/` — Server-only utilities (called via TanStack Start server functions).

## Data Model

All data is stored in Convex. Key tables:

| Table           | Description                                                           |
| --------------- | --------------------------------------------------------------------- |
| `dogs`          | Adoptable dogs with status, gender, HDB approval, welfare group ref   |
| `welfareGroups` | Rescue and welfare organisations with social links                    |
| `events`        | Community events with date/time, location, and kind                   |
| `services`      | Pet services (groomers, trainers, etc.) with category and pricing     |
| `vets`          | Veterinary clinics with address, hours, emergency and PH flags        |
| `dogRuns`       | Off-leash dog run parks with area, size, and facilities               |
| `users`         | Auth users with role (`Admin` \| `Member`) and optional welfare group |

Dog profile images are stored in Convex file storage (`_storage`); the `imageStorageId` field on `dogs` and `services` references the stored file.

## Auth Model

- Authentication is handled by `@convex-dev/auth` using email (magic link or password via Resend).
- Two application roles: `Admin` (full CRUD across all resources) and `Member` (welfare group members — can manage their own dogs).
- Public routes are accessible without authentication.
- `/admin/*` routes are protected by the `admin.tsx` layout, which redirects unauthenticated users.
- Role is stored on the `users` table and checked server-side in Convex mutations.

## Route Structure

**Public**

| Path                              | Content                       |
| --------------------------------- | ----------------------------- |
| `/`                               | Adoptable dogs listing        |
| `/welfare-groups`                 | Welfare group directory       |
| `/welfare-groups/:welfareGroupId` | Individual welfare group page |
| `/services`                       | Pet services directory        |
| `/events`                         | Community events listing      |
| `/dog-runs`                       | Dog run parks directory       |
| `/vets`                           | Veterinary clinics directory  |

**Admin** (`/admin/*` — requires `Admin` or `Member` role)

| Path              | CRUD target |
| ----------------- | ----------- |
| `/admin/dogs`     | Dogs        |
| `/admin/events`   | Events      |
| `/admin/services` | Services    |
| `/admin/dog-runs` | Dog runs    |
| `/admin/vets`     | Vets        |
| `/admin/users`    | Users       |

## Admin UI Pattern

Each admin page follows the same structure:

1. Page header with title and "Add" button.
2. Toolbar with search input, area/category filter, and count chip.
3. Data table with inline edit and delete actions.
4. Modal form (dialog + backdrop) for create and edit, with inline field validation.
5. Confirm dialog for destructive deletes.
6. Toast notification on success.

Convex reactive queries keep the table live without manual refresh.

## Invariants

1. All data reads and writes go through Convex queries and mutations — no direct DB access from routes.
2. Auth and role checks are enforced in Convex mutation handlers, not only in the UI.
3. Optional fields are stored as `undefined` (omitted), never as empty strings, in Convex documents.
4. File storage IDs (`imageStorageId`) are cleaned up in the `remove` mutation for any table that uses them.
5. Admin CSS is loaded per-route via `?url` import, not globally, to keep public page payloads lean.
