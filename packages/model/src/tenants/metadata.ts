import { SLUG_REGEX, SNAKE_CASE_REGEX } from "@fresku/utils/regex";
import { z } from "zod/v4";

const tenantContact = z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
})

const hoursSchema = z.object({ from: z.iso.time(), to: z.iso.time() })
const tenantHoursSchema = z.object({
    monday: hoursSchema,
    tuesday: hoursSchema,
    wednesday: hoursSchema,
    thursday: hoursSchema,
    friday: hoursSchema,
    saturday: hoursSchema,
    sunday: hoursSchema,
})

const CHECKOUT_KEYS = ["default", "la_argentina", "montiara", "sendero_verde"] as const;
type CheckoutKey = typeof CHECKOUT_KEYS[number];

const tenantSchema = z.object({
    tenantId: z.string(),
    database: z.string().regex(SNAKE_CASE_REGEX, {
        message: "Database name must be in snake_case format"
    }),
    name: z.string(),
    domain: z.string(),
    domainType: z.enum(["domain", "subdomain"]),
    checkoutKey: z.enum(CHECKOUT_KEYS),
    deliveryZones: z.record(z.string(), z.number()).optional(),
    inService: z.boolean().optional(),
    nextOpenDate: z.iso.datetime().optional(),
    hours: tenantHoursSchema
}).check((ctx) => {
    // subdomain slugs must never contain dots — prevents Redis key collision with custom-domain tenant keys
    if (ctx.value.domainType === "subdomain" && !SLUG_REGEX.test(ctx.value.domain)) {
        ctx.issues.push({
            code: "custom",
            path: ["domain"],
            message: "Subdomain must be a URL-safe slug (lowercase letters, numbers, and hyphens only)",
            input: ctx.value.domain,
        });
    }
})

type TenantMeta = z.infer<typeof tenantSchema>
type TenantHours = z.infer<typeof tenantHoursSchema>

export { CHECKOUT_KEYS, tenantHoursSchema, tenantSchema, type CheckoutKey, type TenantHours, type TenantMeta };

