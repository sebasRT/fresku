import { z } from "zod";

const stockStatusOptions = ["low", "in", "out"] as const;
const productTypes = ["weight", "barcode"] as const;
const GenericProductSchema = z.object({
    id: z.string(),
    name: z.string(),
    image: z.string(),
    price: z.number(),
    measureUnit: z.string().optional(),
    cost: z.number(),
    type: z.enum(productTypes),
    stockStatus: z.enum(stockStatusOptions).optional(),
});

type StockStatus = typeof stockStatusOptions[number];
type GenericProduct = z.infer<typeof GenericProductSchema>;
type ProductTypes = typeof productTypes[number];
export {
    GenericProductSchema, productTypes, stockStatusOptions, type GenericProduct, type ProductTypes, type StockStatus
};

