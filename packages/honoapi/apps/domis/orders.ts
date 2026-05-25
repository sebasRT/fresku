import { orderSchema, rangeSchema } from "@fresku/model/order";
import { getOrders, updateOrder } from "@fresku/mongo/tenants/orders";
import { getAlgorithm, getSecret } from "@fresku/utils/secret";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { jwt } from "hono/jwt";
import type { DomisVariables } from '../../types';

const orders = new Hono<{ Variables: DomisVariables }>();

orders.use("/*", (c, next) => {
    const jwtMiddleware = jwt({
        secret: getSecret(),
        alg: getAlgorithm(),
    })
    return jwtMiddleware(c, next)
})

orders.get("/",
    zValidator("query", rangeSchema),
    async (c) => {
        const payload = c.get('jwtPayload')
        const range = c.req.valid("query")
        const orders = await getOrders(payload.tenantId, range)
        return c.json(orders)
    })

orders.patch("/:id",
    zValidator("json", orderSchema.partial())
    , async (c) => {

        const order = c.req.valid("json")
        if (!order.orderId) return c.text("Missing orderId", 400)

        const payload = c.get('jwtPayload')
        const { domer, tenantId } = payload
        const domerId = domer.id
        const result = await updateOrder(tenantId, order, domerId)

        return c.json(result)
    })
export default orders;