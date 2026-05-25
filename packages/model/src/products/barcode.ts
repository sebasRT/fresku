import { categories, stockStatus, subcategoriesValues } from "@fresku/utils/products/barcode/consts";
import { z } from "zod";

const baseProductSchema = z.object({
  _id: z.string().optional(),
  barcode: z.string(),
  name: z.string(),
  measure: z.string(),
  brand: z.string(),
  image: z.string().min(2),
  category: z.enum(categories),
  subcategory: z.enum(subcategoriesValues as [string, ...string[]]),
  subcategories: z.array(z.string()),
  tags: z.array(z.string()).optional(),
  searchString: z.string(),
});

const tenantProductSchema = z.object({
  barcode: z.string(),
  show: z.boolean().optional(),
  cost: z.number().optional(),
  price: z.number(),
  stockStatus: z.enum(stockStatus).default("in"),
  stock: z.number().optional(),
})

const barcodeSchema = baseProductSchema.merge(tenantProductSchema);
const barcodeCartItemSchema = barcodeSchema.extend({
  quantity: z.number().min(1),
})

const newBarcodeSchema = baseProductSchema.pick({ name: true, barcode: true, brand: true, measure: true }).extend({ tenants: z.array(z.string()).optional(), toReview: z.boolean().optional() })

type CartItem = z.infer<typeof barcodeCartItemSchema>;
type BaseBarcodeProduct = z.infer<typeof baseProductSchema>;
type TenantBarcodeProduct = z.infer<typeof tenantProductSchema>;
type BarcodeProduct = z.infer<typeof barcodeSchema>;
type NewBarcode = z.infer<typeof newBarcodeSchema>;

export { barcodeCartItemSchema, barcodeSchema, baseProductSchema, newBarcodeSchema, tenantProductSchema };

  export type {
    BarcodeProduct, BaseBarcodeProduct, CartItem, NewBarcode, TenantBarcodeProduct
  };

