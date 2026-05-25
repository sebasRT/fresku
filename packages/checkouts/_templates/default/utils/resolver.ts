import { z } from "zod"

const clientInfoSchema = z.object({
    name: z.string().min(3, { message: "¿Cual es tu nombre?" }),
    phone: z.string().min(10, { message: "¿Cual es tu número de teléfono?" }),
    address: z.object({
        label: z.string().min(3, { message: "Dirección de entrega requerida" }),
        coordinates: z.object({
            lat: z.number(),
            lng: z.number(),
        }).optional(),
    }),
    notes: z.string().optional(),
})

type ClientInfo = z.infer<typeof clientInfoSchema>
export { clientInfoSchema, type ClientInfo }

