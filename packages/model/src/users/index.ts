import { z } from "zod/v4";

const UserSchema = z.object({
    userId: z.string(),
    name: z.string(),
    email: z.string().email(),
    createdAt: z.date()
})

const RedisUserSchema = z.object({
    token: z.string(),
    otp: z.number().optional(),
    otpExpiresAt: z.date().optional(),
})

type User = z.infer<typeof UserSchema>
type RedisUser = z.infer<typeof RedisUserSchema>

export { RedisUserSchema, UserSchema };
export type { RedisUser, User };
