import { getDomer } from "@fresku/mongo/tenants/users";
import getSecret from "@fresku/utils/secret";
import { Hono } from "hono";
import { jwt, sign } from "hono/jwt";

const auth = new Hono()

auth.get("/", (c, next) => {
    const jwtMiddleware = jwt({
        secret: getSecret(),
    })
    return jwtMiddleware(c, next)
}, async (c) => {

    const tenantId = c.get('jwtPayload').tenantId
    const domerId = c.get('jwtPayload').domerId

    const domer = await getDomer(tenantId, domerId)

    if (!domer) {
        return c.notFound()
    }

    const payload = { tenantId, domer }
    const token = await sign(payload, getSecret())

    return c.text(token)
})

export default auth