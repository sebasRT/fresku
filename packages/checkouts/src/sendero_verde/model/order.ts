import { units } from "../utils/consts";
import { ObjectId } from "mongodb";
import { z } from "zod";

const orderProductSchema = z.object({
    barcode: z.union([z.string(), z.number()]),
    image: z.string(),
    quantity: z.number().min(1),
    totalPrice: z.number().min(0),
    unitPrice: z.number().min(0),
    name: z.string(),
    measure: z.string(),
    category: z.string(),
})

export type OrderProduct = z.infer<typeof orderProductSchema>

export type OrderStatus = 'pending' | 'packed' | 'delivered' | 'canceled' | 'ready_for_pickup';

export const unit = z.enum(units)

export const orderSchema = z.object({
    sessionId: z.string().optional(),
    products: z.array(orderProductSchema),
    customerName: z.string(),
    customerPhone: z.string().min(10).max(15),
    deliveryAddress: z.object({
        building: z.number(),
        apartment: z.number(),
        unit,
    }),
    createdAt: z.date().optional(),
    subtotal: z.number(),
    deliveryFee: z.number(),
    status: z.enum(['pending', 'packed', 'delivered', 'canceled', 'ready_for_pickup']),
})
const deliveryAddressSchema =  z.object({
    building: z.number(),
    apartment: z.number(),
    unit,
})
export const deliveredOrderSchema = z.object({
    customerInfo :z.object( {
        sessionId: z.string(),
        customerName: z.string(),
        customerPhone: z.string().min(10).max(15),
    }),
    deliveryAddress: deliveryAddressSchema,
    products: z.array(orderProductSchema),
    createdAt: z.date(),
    deliveredAt: z.date(),
    subtotal: z.number(),
    deliveryFee: z.number(),
})
export type DeliveryAddress = z.infer<typeof deliveryAddressSchema>
export type Unit = z.infer<typeof unit>
export type Order =  z.infer<typeof orderSchema> & {_id?: ObjectId | string}
export type DeliveredOrder = z.infer<typeof deliveredOrderSchema> & {_id?: ObjectId | string}