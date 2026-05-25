import { categories } from "@/utils/consts/barcode";
import { z } from "zod";
import { stockStatusOptions } from "./generic";

export const baseProductSchema = z.object({
  _id: z.string().optional(),
  type: z.literal("barcode"),
  barcode: z.string(),
  name: z.string(),
  measure: z.string(),
  brand: z.string(),
  image: z.string(),
  category: z.enum(categories),
  subcategory: z.string(),
  tags: z.array(z.string()).optional(),
  show: z.boolean().optional(),
});

export const productSchema = baseProductSchema.extend({
  searchString: z.string().optional(),
  cost: z.number().optional(),
  price: z.number(),
  measure: z.string(),
  stockStatus: z.enum(stockStatusOptions),
  stock: z.number().optional(),
});

export const productFromAdminSchema = productSchema.pick({
  barcode: true,
  name: true,
  measure: true,
  brand: true,
  price: true,
  cost: true,
});


// export type Brand = z.infer<typeof brandOptions>;
export type BaseProduct = z.infer<typeof baseProductSchema>;
export type BarcodeProduct = z.infer<typeof productSchema>;
export type BarcodeProductFromAdmin = z.infer<typeof productFromAdminSchema>;
