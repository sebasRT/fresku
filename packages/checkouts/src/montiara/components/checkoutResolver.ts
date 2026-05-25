import { z } from "zod";

export const checkoutSchema = z.object({
  name: z.string().nonempty("Por favor ingresa un nombre"),
  phone: z
    .string()
    .length(10, "El número de teléfono debe tener 10 caracteres")
    .nonempty("Por favor ingresa tu número de teléfono"),
  building: z
    .number({
      invalid_type_error: "¿En qué torre vives?",
    })
    .int("Debe ser un número entero")
    .nonnegative("Debe ser positivo")
    .refine((val) => val > 0, {
      message: "¿En qué torre vives?",
    }),
  apto: z
    .number({
      invalid_type_error: "¿En qué apto vives?",
    })
    .int("¿En qué apto vives?")
    .nonnegative("El número de apartamento debe ser positivo")
    .refine((val) => val > 0, "Por favor ingresa el número del piso"),
});

export type Checkout = z.infer<typeof checkoutSchema>;
