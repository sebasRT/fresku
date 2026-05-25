import { IANAZone } from "luxon";
import { z } from "zod";
import { barcodeSchema } from "./products/barcode";
import { fruverSchema } from "./products/fruver";

const orderStatus = z.enum(["pending", "packed", "delivered", "canceled"]);

const orderBarcodeSchema = barcodeSchema.pick({
    barcode: true,
    name: true,
    measure: true,
    image: true,
    price: true,
    brand: true
}).extend({
    quantity: z.number().min(1),
})

const orderFruverSchema = fruverSchema.pick({
    sku: true,
    name: true,
    image: true,
    sellingFormat: true,
}).extend({
    labelPrice: z.number(),
    labelMeasure: z.string(),
    quantity: z.number().min(1),
})

const orderSchema = z.object({
    _id: z.string().optional(),
    sessionId: z.string(),
    orderId: z.string(),
    contact: z.object({
        name: z.string().min(3, { message: "¿Cual es tu nombre?" }),
        phone: z.string().min(10, { message: "¿Cual es tu número de teléfono?" }),
    }),
    address: z.object({
        label: z.string(),
        coordinates: z.object({
            lat: z.number(),
            lng: z.number(),
        }).optional(),
    }),
    products: z.object(
        {
            barcode: z.array(orderBarcodeSchema).optional(),
            fruver: z.array(orderFruverSchema).optional(),
        }
    ),
    notes: z.string().optional(),
    subtotal: z.number().min(1),
    total: z.number().min(1),
    deliveryFee: z.number(),
    status: orderStatus,
    updatedAt: z.date().optional(),
    createdAt: z.date()
})

export const rangeSchema = z.object({
    from: z.coerce.date(), to: z.coerce.date(), tz: z.string().refine(tz => IANAZone.isValidZone(tz), {
        message: "Invalid IANA time zone"
    }).optional()
});

type Order = z.infer<typeof orderSchema>;
type OrderBarcode = z.infer<typeof orderBarcodeSchema>;
type OrderFruver = z.infer<typeof orderFruverSchema>;

export { orderBarcodeSchema, orderFruverSchema, orderSchema, type Order, type OrderBarcode, type OrderFruver };

