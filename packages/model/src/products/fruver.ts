import { stockStatus } from "@fresku/utils/products/barcode/consts";
import { fruverCategories, measureUnits } from "@fresku/utils/products/fruver/consts";
import { z } from "zod";

const measureUnitsSchema = z.enum(measureUnits)
const baseFruverSchema = z.object({
    _id: z.string().optional(),
    sku: z.string(),
    name: z.string(),
    image: z.string(),
    category: z.enum(fruverCategories),
    tags: z.array(z.string()).optional(),
    avrWeight: z.number(),
});

const tenantFruverSchema = z.object({
    type: z.literal("fruver"),
    show: z.boolean().optional(),
    cost: z.number().optional(),
    pricePerGram: z.number(),
    stockStatus: z.enum(stockStatus).optional(),
    stock: z.number().optional(),
    unit: measureUnitsSchema,
    unitQuantity: z.number(),
    sellingFormat: z.enum(["weight", "unit"]),
});

const fruverSchema = baseFruverSchema.merge(tenantFruverSchema);

type FruverProduct = z.infer<typeof fruverSchema>
type BaseFruverProduct = z.infer<typeof baseFruverSchema>;
type TenantFruverProduct = z.infer<typeof tenantFruverSchema>;
type Unit = z.infer<typeof fruverSchema>["unit"];
type SellingFormat = z.infer<typeof fruverSchema>["sellingFormat"];

export { baseFruverSchema, fruverSchema };
export type {
    BaseFruverProduct, FruverProduct, SellingFormat, TenantFruverProduct, Unit
};

