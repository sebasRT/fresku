import { z } from "zod";

export const checkoutSchema = z.object({
  name: z.string().nonempty("Por favor ingresa un nombre"),
  phone: z
    .string()
    .length(10, "El número de teléfono debe tener 10 caracteres")
    .nonempty("Por favor ingresa tu número de teléfono"),
  neighborhood: z.string().nonempty("Por favor selecciona un barrio"),
  address: z.string().nonempty("Por favor ingresa tu dirección"),
});

export type Checkout = z.infer<typeof checkoutSchema>;