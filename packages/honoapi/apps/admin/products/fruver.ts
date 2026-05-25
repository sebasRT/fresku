import { fruverSchema } from '@fresku/model/products/fruver';
import { addTenantFruverProduct, queryTenantFruverProducts, tenantFruverQuerySearch, updateTenantFruverProduct } from "@fresku/mongo/tenants/products/fruver";
import { getAlgorithm, getSecret } from "@fresku/utils/secret";
import { zValidator } from '@hono/zod-validator';
import { Hono } from "hono";
import { jwt } from "hono/jwt";
import type { AdminVariables } from '../../../types';

const fruverProducts = new Hono<{ Variables: AdminVariables }>();

fruverProducts.use("/*", (c, next) => {
    const jwtMiddleware = jwt({
        secret: getSecret(),
        alg: getAlgorithm()
    })
    return jwtMiddleware(c, next)
})

fruverProducts.get("/",
    zValidator("query", fruverSchema.partial()),
    async (c) => {

        const tenantId = c.get('jwtPayload').tenantId
        const query = c.req.valid("query")

        const products = await queryTenantFruverProducts(tenantId, query)
        return c.json(products)
    }
)

fruverProducts.get("/search/:query",
    async (c) => {
        const tenantId = c.get('jwtPayload').tenantId
        const { query } = c.req.param()
        if (!query || query.length < 3) return c.text('Query too short', 400)
        const products = await tenantFruverQuerySearch(query, tenantId)
        return c.json(products)
    }
)

fruverProducts.post("/",
    zValidator("json", fruverSchema),
    async (c) => {
        const tenantId = c.get('jwtPayload').tenantId
        const body = c.req.valid("json")
        const product = await addTenantFruverProduct(tenantId, body)
        return c.json(product)
    }
)

fruverProducts.patch("/:id",
    zValidator("json", fruverSchema.partial()),
    async (c) => {
        const tenantId = c.get('jwtPayload').tenantId
        const productId = c.req.param('id')
        const body = c.req.valid("json")
        const product = await updateTenantFruverProduct(tenantId, productId, body)
        return c.json(product)
    }
)

export default fruverProducts;