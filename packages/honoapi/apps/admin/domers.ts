import { domerSchema } from "@fresku/model/tenants/users";
import { addDomer, deleteDomer, getDomer, getTenantDomers, updateDomer } from "@fresku/mongo/tenants/users";
import { getAlgorithm, getSecret } from "@fresku/utils/secret";
import { zValidator } from '@hono/zod-validator';
import { Hono } from "hono";
import { jwt, sign } from 'hono/jwt';
import type { AdminVariables, DomerAccessPayload } from '../../types';

type Variables = AdminVariables

const domers = new Hono<{ Variables: Variables }>()

const secret = process.env.FRESKU_SECRET
if (secret === undefined) throw new Error("Add secret")

domers.use("/*", (c, next) => {
    const jwtMiddleware = jwt({
        secret: getSecret(),
        alg: getAlgorithm(),
    })
    return jwtMiddleware(c, next)
})

domers.basePath("/")
    .get(async (c) => {
        const payload = c.get('jwtPayload')
        const domers = await getTenantDomers(payload.tenantId)

        return c.json(domers)
    })
    .post(zValidator('json', domerSchema),
        async (c) => {
            const tenantId = c.get('jwtPayload').tenantId
            const body = c.req.valid('json')
            const res = await addDomer(tenantId, body)
            if (!res) { c.text("Failed to create domer", 400) }
            return c.text("domer created")
        })

const domerPatcSchema = domerSchema.partial()

domers.basePath("/:id")
    .get("/jwt", async (c) => {
        const { domain, tenantId } = c.get('jwtPayload')

        const domerId = c.req.param('id')
        const domer = await getDomer(tenantId, domerId)

        if (!domer) { return c.text("Domer not found", 404) }

        const payload: DomerAccessPayload = { domerId, tenantId, domain }
        const token = await sign(payload, secret)

        return c.text(token)
    })
    .delete(async (c) => {
        const tenantId = c.get('jwtPayload').tenantId
        const domerId = c.req.param('id')
        const res = await deleteDomer(tenantId, domerId)
        if (!res) { return c.text("Failed to delete domer", 400) }
        return c.text("domer deleted")
    })
    .patch(
        zValidator('json', domerPatcSchema),
        async (c) => {
            const tenantId = c.get('jwtPayload').tenantId
            const domerId = c.req.param('id')
            const body = c.req.valid('json')
            const domer = { ...body, id: domerId };
            const res = await updateDomer(tenantId, domer)
            if (!res) { c.text("Failed to update domer", 400) }

            return c.json({ message: "domer updated", domerId })
        })

export default domers