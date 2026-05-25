import z from "zod";

const signupSchema = z.object({
    name: z.string({ message: "¿Cual es tu nombre?" }).min(3, { message: "Ingresa al menos 3 caracteres" }).regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { message: "Solo puede contener letras y espacios" }),
    email: z.string({ message: "¿Cual es tu correo?" }).email({ message: "Ingresa un email válido" }),
})

export { signupSchema };
export type SignupSchema = z.infer<typeof signupSchema>;;
