import { zValidator } from "@hono/zod-validator";
import { setDomerToken } from "@fresku/mongo/tenants/users";
import getSecret from "@fresku/utils/secret";
import { Expo } from "expo-server-sdk";
import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { z } from "zod/v4-mini";

const notifications = new Hono()

notifications.put("/tokens",
    (c, next) => {
        const jwtMiddleware = jwt({
            secret: getSecret(),
        })
        return jwtMiddleware(c, next)
    },
    zValidator("json", z.object({ token: z.string() }))
    ,
    async (c) => {

        const tenantId = c.get('jwtPayload').tenantId
        const domerId = c.get('jwtPayload').domer?.id
        const token = c.req.valid("json").token

        if (!domerId) return c.text("Domer ID not found", 400)

        if (!Expo.isExpoPushToken(token)) {
            return c.text("Invalid Expo push token", 400)
        }

        const res = await setDomerToken(tenantId, domerId, token)
        
        if (res.matchedCount === 0) return c.notFound()
        if (res.modifiedCount === 0) return c.text("Token already set", 200)

        return c.text("Token set successfully", 200)
    })

export default notifications;