# Multitenancy — Architecture & Data Flow

Each tenant gets its own isolated storefront reachable via a **subdomain** or a **custom domain**. The same Next.js codebase serves all tenants — the `[domain]` dynamic segment is the single entry point that drives tenant resolution throughout the stack.

---

## URL Structure

```
https://<tenant>.fresku.com/<path>      ← subdomain mode
https://<custom-domain.com>/<path>      ← custom domain mode
```

Both map to the same `[domain]` route in Next.js. The middleware handles the translation transparently.

---

## Middleware — URL Rewriting

The shop middleware (`apps/shop/src/middleware.ts`) intercepts every request and rewrites the URL so Next.js sees the tenant identifier as a path segment.

```
Request:  shop.fresku.com/checkout
Rewrite:  fresku.com/shop/checkout      →  [domain]=shop

Request:  mi-tienda.com/checkout
Rewrite:  fresku.com/mi-tienda.com/checkout  →  [domain]=mi-tienda.com
```

Rules applied in order:

| Hostname | Behavior |
|---|---|
| `ROOT_DOMAIN` itself | Pass through as-is |
| Starts with `www.` | Pass through as-is |
| Subdomain of `ROOT_DOMAIN` | Rewrite to `/{subdomain}{path}` |
| Anything else (custom domain) | Rewrite to `/{hostname}{path}` |

`/login` and `/signup` are special-cased: the subdomain is appended as `?tenant=` instead of becoming a path segment.

`NEXT_PUBLIC_ROOT_DOMAIN` must be set in the environment.

---

## Next.js Routing

```
app/
└── [domain]/
    └── (shop)/
        ├── page.tsx               → /<domain>
        ├── [category]/page.tsx    → /<domain>/<category>
        ├── fruver/
        │   └── [...fruver_category]/page.tsx
        ├── checkout/page.tsx      → /<domain>/checkout
        └── order/[id]/page.tsx    → /<domain>/order/<id>
```

Every page receives `params.domain` — the raw tenant identifier extracted from the rewritten URL.

---

## Tenant Data Model

Tenant data is split across three layers:

### 1. Redis (hot cache)

```
Key:  tenant:{domain}   e.g.  tenant:la_argentina.fresku.com
                              tenant:testing  ← always used in development

Fields:
  database      "t_la_argentina"
  name          "La Argentina"
  domainType    "subdomain" | "domain"
  inService     true | false
  nextOpenDate  ISO datetime (optional)
  hours         JSON-stringified TenantHours object
```

Used for fast lookups that happen on every request. `getTenantDB(domain)` is the most common call — it returns the tenant's MongoDB database name.

### 2. MongoDB — central `Tenants` database

```
Tenants.meta      ← source of truth for TenantMeta (one doc per tenant)
Tenants.users     ← admin credentials + delivery staff (domers) per tenant
```

**TenantMeta** (`packages/model/src/tenants/metadata.ts`):
```ts
{
  tenantId: string           // equals the domain string (set at creation time)
  database: string           // snake_case, e.g. "la_argentina"
  name: string               // display name
  domain: string             // e.g. "la_argentina.fresku.com"
  domainType: "domain" | "subdomain"
  inService?: boolean
  nextOpenDate?: ISO datetime
  hours: {
    monday:    { from: "HH:MM:SS", to: "HH:MM:SS" }
    tuesday:   { from, to }
    // ... all 7 days
  }
}
```

**TenantUsers** (`packages/model/src/tenants/users.ts`):
```ts
{
  _id: string
  tenantId: string           // equals domain
  domain: string
  admin: { name, email, phone }
  domers: Array<{
    id: string
    name: string
    status: "active" | "inactive" | "suspended"
    phone: number
    email: string
    token?: string           // Expo push notification token
  }>
}
```

### 3. MongoDB — per-tenant databases

```
t_la_argentina
├── orders       ← customer orders
├── p_barcode    ← barcode-scanned products
├── p_fruver     ← fresh produce products
└── meta         ← copy of TenantMeta (written at tenant creation)

t_sendero_verde
├── orders
├── p_barcode
└── ...
```

The prefix `t_` namespaces tenant databases. All per-tenant queries receive the database name resolved from Redis:

```ts
const database = await getTenantDB(domain);
client.db(database).collection("orders")
```

---

## Tenant Resolution Flow

```
params.domain  (from URL)
      │
      ▼
getTenantDB(domain)           ← packages/redis/src/tenants.ts
      │  Redis key: tenant:{domain}
      │  Returns: "t_la_argentina"
      │
      ▼
client.db("t_la_argentina")   ← all data queries from here on
```

In development, `getTenantDB` always returns `"t_testing"` regardless of the domain.

---

## Data Access Functions

| Function | Package | What it does |
|---|---|---|
| `getTenantDB(domain)` | `@fresku/redis/tenants` | domain → database name (cached in Redis) |
| `getTenantName(domain)` | `@fresku/mongo/tenants/meta` | domain → display name |
| `getTenantIdByDomain(domain)` | `@fresku/mongo/tenants/meta` | domain → tenantId field |
| `getDomains()` | `@fresku/mongo/tenants/meta` | all custom domains (for static generation) |
| `getSubdomains()` | `@fresku/mongo/tenants/meta` | all subdomains (for static generation) |
| `getTenantDomers(tenantId)` | `@fresku/mongo/tenants/users` | lookup domers by tenantId field |
| `getTenantDomersByDomain(domain)` | `@fresku/mongo/tenants/users` | lookup domers by domain field |
| `getTenantMetadata(domain, keys[])` | `@fresku/redis/tenants` | selective fetch from Redis hash |

---

## Checkout Resolution

Each tenant has a custom checkout UI. The component is resolved at runtime from the tenant's database name.

```
domain: "la_argentina.fresku.com"
        │
        ▼  getTenantDB(domain)
database: "t_la_argentina"
        │
        ▼  strip "t_"
key: "la_argentina"
        │
        ▼  dynamic import
packages/checkouts/src/la_argentina/index.tsx
```

```
packages/checkouts/src/
├── index.ts           ← CheckoutKey type + getCheckout() + CheckoutProps interface
├── default/           ← fallback checkout
├── la_argentina/
├── sendero_verde/
├── montiara/
└── testing/
```

`packages/checkouts/src/index.ts` is **auto-generated** by running:

```bash
npm run generate:map   # in packages/checkouts
```

If no matching checkout is found for a key, `getCheckout` falls back to `default`.

### CheckoutProps

Every checkout component receives `domain` as a required prop:

```ts
// packages/checkouts/src/index.ts
export interface CheckoutProps {
  domain: string;
}
```

`domain` flows from the URL param all the way down to order creation:

```
CheckoutLoader (domain from URL)
  └── <Checkout domain={domain} />         ← index.tsx
        └── <CheckoutForm domain={domain} />
              └── createOrder(..., domain)  ← server action
                    └── createNewOrder(order, domain)
                          ├── getTenantDB(domain) → database name
                          └── notifyNewOrder(domain, address)
```

---

## Order Creation

`createNewOrder` in `packages/checkouts/_actions/order.ts`:

1. Resolves the MongoDB database from Redis using `getTenantDB(domain, false)`
2. Generates `sessionId`, `orderId`, `createdAt`
3. Validates and inserts the order document
4. Fires push notifications to all active domers for that tenant

In development, the database is always `"t_testing"` regardless of domain.

```ts
async function createNewOrder(order, domain: string) {
    const database = NODE_ENV === "production"
        ? await getTenantDB(domain, false)
        : "t_testing";

    const orders = (await clientPromise).db(database).collection<Order>("orders");
    // ...
    await notifyNewOrder(domain, order.address.label);
}
```

No module-level database state is held — each call resolves its own database reference.

---

## Notifications

When an order is created, all active domers (delivery staff) for the tenant receive an Expo push notification.

```ts
// packages/checkouts/_actions/notifications.ts
notifyNewOrder(domain, address)
  └── getTenantDomersByDomain(domain)   ← Tenants.users, query by domain field
        └── for each domer with a token:
              expo.sendPushNotificationsAsync([{ to: token, title, body }])
```

Domers register their Expo push token via `setDomerToken(tenantId, domerId, token)` in `packages/mongo/src/tenants/users.ts`.

---

## Creating a New Tenant

The full creation flow (`packages/mongo/src/tenants/index.ts`):

```
createTenant(tenantData)
  ├── Validate against tenantSchema
  ├── createRedisTenant(tenant)       → writes tenant:{domain} hash to Redis
  ├── createTenantMetadata(tenant)    → inserts into Tenants.meta
  └── tenant_db.meta.insertOne(...)   → copies metadata into tenant's own DB
```

All three writes happen inside a MongoDB session transaction. If any step fails, the Redis key is deleted and the transaction is aborted.

---

## Scaffolding a New Checkout

```bash
npm run new:checkout   # in packages/checkouts
# prompts: "Checkout name (snake_case):"
# e.g. → montiara
```

This copies `packages/checkouts/_templates/condominium/` into `packages/checkouts/src/montiara/`, replacing the placeholder `CHECKOUT_NAME` in all files.

After scaffolding:

1. Update building/unit options in `src/montiara/utils/consts.ts`
2. Update address labels in `src/montiara/components/Address.tsx`
3. Run `npm run generate:map` to register the new key in `src/index.ts`

The generated checkout is already wired for multi-tenancy: `domain` is passed as a prop and forwarded to `createNewOrder` — no hardcoded tenant identifiers anywhere in the template.

---

## Static Generation

The shop home page pre-renders one static page per tenant at build time:

```ts
// app/[domain]/(shop)/page.tsx
export const dynamicParams = false;

export async function generateStaticParams() {
  const subdomains = await getSubdomains();   // from Tenants.meta
  const domains = await getDomains();
  return [...subdomains, ...domains].map((domain) => ({ domain }));
}
```

`dynamicParams = false` means any domain not registered in the database returns a 404.

---

## End-to-End Request Flow

```
1. Request arrives at  la_argentina.fresku.com/checkout

2. Middleware rewrites to  /la_argentina.fresku.com/checkout
   → Next.js matches  [domain]/(shop)/checkout/page.tsx
   → params.domain = "la_argentina.fresku.com"

3. CheckoutLoader:
   getTenantDB("la_argentina.fresku.com")  →  Redis  →  "t_la_argentina"
   checkoutKey = "la_argentina"
   dynamic import packages/checkouts/src/la_argentina

4. <LaArgentinaCheckout domain="la_argentina.fresku.com" />

5. Customer submits form:
   createOrder(..., "la_argentina.fresku.com")
     createNewOrder(order, "la_argentina.fresku.com")
       getTenantDB("la_argentina.fresku.com")  →  "t_la_argentina"
       insert into t_la_argentina.orders
       notifyNewOrder("la_argentina.fresku.com", address)
         getTenantDomersByDomain("la_argentina.fresku.com")
         push notification → all active domers
```
