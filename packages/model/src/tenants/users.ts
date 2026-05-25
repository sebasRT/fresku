import { z } from "zod"
const adminSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string()
})

const domerSchema = z.object({
    id: z.string(),
    name: z.string(),
    status: z.enum(["active", "inactive", "suspended"]),
    phone: z.number(),
    email: z.string().email(),
    token: z.string().optional()
})

const tenantUsersSchema = z.object({
    _id: z.string(),
    tenantId: z.string(),
    domain: z.string(),
    admin: adminSchema,
    domers: z.array(domerSchema)
})

type TenantUsers = z.infer<typeof tenantUsersSchema>
type Domer = z.infer<typeof domerSchema>
type Admin = z.infer<typeof adminSchema>

export { adminSchema, domerSchema, tenantUsersSchema }
export type { Admin, Domer, TenantUsers }

