import { fruverCategories, measureUnits } from "@/utils/consts/fruver";
import { z } from "zod";

const measureUnitsSchema = z.enum(measureUnits)
const fruverProduct = z.object({
    name: z.string().min(1, 'El nombre es obligatorio'),
    image: z.string().min(1, 'La imagen es obligatoria'),
    category: z.enum(fruverCategories),
    tags: z.array(z.string()).optional(),
    unit: z.enum(measureUnits),
    unitQuantity: z.number(),
    pricePerGram: z.number(),
    stockStatus: z.enum(["in", "out"]).optional(),
    sellingFormat: z.enum(["weight", "unit"]),
    avrWeight: z.number(),
    sku: z.string().min(1, 'El sku es obligatorio'),
});

type SellingFormat = z.infer<typeof fruverProduct>["sellingFormat"];
type Unit = z.infer<typeof fruverProduct>["unit"];
type FruverProduct = z.infer<typeof fruverProduct>
type MeasureUnit = z.infer<typeof measureUnitsSchema>;
export { fruverProduct, type FruverProduct, type MeasureUnit };

