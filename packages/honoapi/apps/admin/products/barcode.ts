import { zValidator } from '@hono/zod-validator';
import { getProductBody } from '@fresku/ai/products/barcode';
import { getProductsQuery } from '@fresku/deepgram/esp/products';
import { barcodeSchema } from '@fresku/model/products/barcode';
import { getByBarcode } from '@fresku/mongo/products/barcode';
import { addProductFromTenant } from '@fresku/mongo/products/new/barcode';
import { addBarcodeProduct, queryTenantBarcodeProducts, tenantBarcodeQuerySearch, tenantGetByBarcode, updateBarcodeProduct, upsertBarcodeProduct } from "@fresku/mongo/tenants/products/barcode";
import getSecret from "@fresku/utils/secret";
import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { z } from "zod";

const barcodeProducts = new Hono();

barcodeProducts.use("/*", (c, next) => {
    const jwtMiddleware = jwt({
        secret: getSecret(),
    })
    return jwtMiddleware(c, next)
})

barcodeProducts.get("/",
    zValidator("query", barcodeSchema.partial()),
    async (c) => {

        const tenantId = c.get('jwtPayload').tenantId
        const query = c.req.valid("query")

        const products = await queryTenantBarcodeProducts(tenantId, query)
        return c.json(products)
    }
)

barcodeProducts.get("/search/:query",
    async (c) => {
        const tenantId = c.get('jwtPayload').tenantId
        const { query } = c.req.param()
        if (!query || query.length < 3) return c.text('Query too short', 400)
        const products = await tenantBarcodeQuerySearch(query, tenantId)
        return c.json(products)
    }
)

barcodeProducts.get("/:barcode",
    async (c) => {
        const tenantId = c.get('jwtPayload').tenantId
        const { barcode } = c.req.param()
        const product = await tenantGetByBarcode(tenantId, barcode)

        if (!product) {
            const newProduct = await getByBarcode(barcode)

            if (!newProduct) return c.text('Product not found', 404)

            return c.json({ ...newProduct, inStore: false })
        }

        return c.json({ ...product, inStore: true })
    })

barcodeProducts.post("/",
    zValidator("json", barcodeSchema),
    async (c) => {
        const tenantId = c.get('jwtPayload').tenantId
        const body = c.req.valid("json")
        const product = await addBarcodeProduct(tenantId, body)
        return c.json(product)
    }
)

barcodeProducts.post("/new",
    zValidator("json", barcodeSchema.partial()),
    async (c) => {
        const tenantId = c.get('jwtPayload').tenantId
        const body = c.req.valid("json")
        const result = await addProductFromTenant(tenantId, body)

        return c.json(result)
    })

barcodeProducts.put("/",
    zValidator("json", barcodeSchema),
    async (c) => {
        const tenantId = c.get('jwtPayload').tenantId
        const body = c.req.valid("json")
        const product = await upsertBarcodeProduct(tenantId, body)
        return c.json(product)
    }
)

barcodeProducts.patch("/:id",
    zValidator("json", barcodeSchema.partial()),
    async (c) => {
        const tenantId = c.get('jwtPayload').tenantId
        const productId = c.req.param('id')
        const body = c.req.valid("json")
        const product = await updateBarcodeProduct(tenantId, productId, body)
        return c.json(product)
    })

barcodeProducts.basePath("/voice")
    .post("/product-body",
        async (c) => {
            // Only allow audio files
            const contentType = c.req.header("content-type") || "";
            if (!contentType.startsWith("audio/")) {
                return c.text("Only audio files are allowed", 400);
            }

            const arrayBuffer = await c.req.arrayBuffer();
            if (arrayBuffer.byteLength === 0) return c.text('No audio data provided', 400);

            const buffer = Buffer.from(arrayBuffer);
            try {

                const voiceDecoded = await getProductsQuery(buffer);
                if (!voiceDecoded) return c.text('Failed to decode voice', 500);

                const body = await getProductBody(voiceDecoded, { price: z.number().describe("Precio de producto en numero entero") });
                return c.json(body);

            } catch (error: any) { 

                return c.text(`Failed to get product body: ${error.message}`, 500);
            }

        });

export default barcodeProducts;