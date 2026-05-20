# Meridian

A project management web app for small B2B SaaS startup teams to track tasks, assign owners, set deadlines, and view progress across projects.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/web run dev` — run the web frontend (port 22333)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, wouter, TanStack Query, shadcn/ui, framer-motion
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — API contract source of truth
- `lib/db/src/schema/` — Drizzle table definitions (projects, members, tasks, activity)
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/web/src/pages/` — React pages (dashboard, projects, project-detail, tasks, members)
- `artifacts/web/src/components/layout/app-layout.tsx` — sidebar + header shell

## Architecture decisions

- Contract-first: OpenAPI spec gates codegen which gates the frontend; never hand-write types that codegen produces
- Activity log is best-effort (never throws); logged server-side on mutations
- Task enrichment (projectName, assigneeName) is done in route handlers via joined selects, not stored denormalized
- All date fields use `timestamptz`; serialized to ISO strings in API responses

## Product

- Dashboard: team-wide stats (active projects, task completion, overdue items), activity feed, overdue task list
- Projects: card grid with progress bars, create/delete, color picker
- Project Detail: task board grouped by status, inline status editing, add tasks
- Tasks: global task list with status/project filters, inline status editing
- Members: team roster with roles and task counts, add/remove members

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Always run codegen after changing `openapi.yaml`
- `pnpm run typecheck:libs` must pass before the design subagent can use generated hooks
- The `projects/:id/tasks` route imports `membersTable` and `projectsTable` via dynamic imports — works fine at runtime
- Express 5: wildcard routes use `/{*splat}` syntax, `req.params.id` is `string | string[]` — always parse with `parseInt`

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
