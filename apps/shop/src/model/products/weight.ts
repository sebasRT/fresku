import { categories } from "@/utils/consts/barcode";
import { z } from "zod";
import { stockStatusOptions } from "./generic";

export const baseProductSchema = z.object({
  //+
  _id: z.string().optional(), //+
  name: z.string(), //+
  image: z.string(), //+
});

export const productSchema = baseProductSchema.extend({
  searchString: z.string().optional(),
  cost: z.number(),
  price: z.number().step(50),
  stockStatus: z.enum(stockStatusOptions),
});

export type Category = (typeof categories)[number];
// export type Brand = z.infer<typeof brandOptions>;
export type BaseProduct = z.infer<typeof baseProductSchema>;
export type WeightProduct = z.infer<typeof productSchema>;
