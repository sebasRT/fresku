import { SNAKE_CASE_REGEX } from "@fresku/utils/regex";
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

const tenantSchema = z.object({
    tenantId: z.string(),
    database: z.string().regex(SNAKE_CASE_REGEX, {
        message: "Database name must be in snake_case format"
    }),
    name: z.string(),
    domain: z.string(),
    domainType: z.enum(["domain", "subdomain"]),
    inService: z.boolean().optional(),
    nextOpenDate: z.iso.datetime().optional(),
    hours: tenantHoursSchema
})

type TenantMeta = z.infer<typeof tenantSchema>
type TenantHours = z.infer<typeof tenantHoursSchema>

export { tenantHoursSchema, tenantSchema, type TenantHours, type TenantMeta };

