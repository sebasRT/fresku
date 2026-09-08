# Fresku

Multi-tenant shop platform. Each **Tenant** runs an independent storefront, isolated by
`domain` — either a platform subdomain (`mystore.fresku.com`) or a tenant-owned hostname
(`mystore.com`). A shared **Global Catalogue** in MongoDB is the source of truth for
product identity (name, barcode, image, category, brand); a **Product Push** copies those
identity fields into each Tenant's own database without overwriting operational fields
(price, cost, stock).

See [`CONTEXT.md`](CONTEXT.md) for the full domain glossary and
[`docs/multitenancy.md`](docs/multitenancy.md) for the routing model.

## Monorepo layout

Turborepo + npm workspaces. Node `>=20`, npm `11`, TypeScript throughout.

### Apps

| App     | Path         | Stack                        | Port | Role |
|---------|--------------|------------------------------|------|------|
| `shop`  | `apps/shop`  | Next.js 16 (canary), Turbopack | 3000 | Customer storefront: browsing, cart, per-tenant checkout, order placement, AI/voice features (`@ai-sdk`, Deepgram), Hono API routes |
| `admin` | `apps/admin` | Next.js 16 (canary), Turbopack | 3001 | Back-office: Global Catalogue management, tenant setup, product push |

### Packages

Scope `@fresku/*` unless noted.

| Package             | Purpose |
|---------------------|---------|
| `model`             | Shared Zod schemas + TS types (Order, OrderStatus, `CHECKOUT_KEYS`, tenancy) |
| `mongo`             | MongoDB clients and tenant-database resolution |
| `redis`             | Redis tenant lookup (Upstash REST + ioredis) |
| `checkouts`         | Per-tenant checkout implementations (`src/`), dev templates (`_templates/`), scaffold scripts (`_scripts/`), server actions (`_actions/`) |
| `honoapi`           | Shared Hono API app |
| `ai`                | AI SDK helpers |
| `deepgram`          | Speech-to-text integration |
| `stores`            | Client state (Zustand) |
| `resend`            | Transactional email |
| `ui` / `@repo/ui`   | Shared React components |
| `scss`              | Shared SCSS abstractions |
| `utils`             | Shared utility functions |
| `@repo/eslint-config`, `@repo/typescript-config` | Shared lint / tsconfig |

## Prerequisites

- Node `>=20`, npm `11`
- A MongoDB instance and a Redis instance (`MONGODB_URI`, `REDIS_URL`)
- For full functionality: Cloudinary, Resend, Deepgram, and OpenAI credentials

## Setup

```sh
npm install
```

Create an env file (`.env` / `.env.local`) in **each** app (`apps/shop`, `apps/admin`)
with the variables consumed by the build:

| Variable | Used for |
|----------|----------|
| `MONGODB_URI` | MongoDB connection |
| `REDIS_URL` | Redis (ioredis) connection |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Redis (Upstash REST) |
| `NEXT_PUBLIC_ROOT_DOMAIN` | Subdomain tenant routing (e.g. `fresku.com`) |
| `FRESKU_SECRET` | App secret |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_URL` | Image hosting |
| `RESEND_API_KEY` | Transactional email |
| `DEEPGRAM_API_KEY` | Voice / speech-to-text |
| `OPENAI_API_KEY` | AI features |

## Develop

```sh
npm run dev              # all apps via turbo
npm run dev -w shop      # storefront only  -> http://localhost:3000
npm run dev -w admin     # back-office only -> http://localhost:3001
```

Subdomain tenant routing resolves the tenant from the hostname against `NEXT_PUBLIC_ROOT_DOMAIN`.
For local multi-tenant testing, point wildcard subdomains of that root domain at `localhost`
(hosts file entries or a wildcard dev domain).

## Common tasks

```sh
npm run build           # turbo run build
npm run lint            # turbo run lint
npm run check-types     # turbo run check-types
npm run format          # prettier --write **/*.{ts,tsx,md}
```

## Checkouts

`packages/checkouts` holds one implementation per checkout style in `src/`. New Tenant
Checkouts are scaffolded from `_templates/` via `_scripts/` at dev time. At runtime the
implementation is chosen by the `checkoutKey` field on `TenantMeta`
(valid values: `CHECKOUT_KEYS` in `@fresku/model`).

## Further reading

- [`CONTEXT.md`](CONTEXT.md) — domain glossary / ubiquitous language
- [`docs/multitenancy.md`](docs/multitenancy.md) — tenant routing and isolation
- [`docs/data_structure.mermaid`](docs/data_structure.mermaid) — data model diagram

## Code navigation

This repo is indexed by CodeGraph (`.codegraph/`). Use
`codegraph explore "<question or symbols>"` or the CodeGraph MCP tools to locate code
before falling back to grep. See [`.claude/CLAUDE.md`](.claude/CLAUDE.md).
