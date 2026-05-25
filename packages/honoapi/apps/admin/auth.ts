import { findTenantByAdminEmail } from '@fresku/mongo/tenants/users'
import { sendAdminOTP, verifyAdminOTP } from '@fresku/resend/admin'
import { getSecret } from '@fresku/utils/secret'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { sign } from 'hono/jwt'
import z from 'zod'
import type { AdminJwtPayload } from '../../types'

const auth = new Hono()

const authSchema = z.object({
    email: z.string().email(),
    otp: z.union([z.string(), z.number()]).optional(),
})

auth.post('/',
    zValidator('json', authSchema),
    async (c) => {

        const body = c.req.valid('json')

        if (!body) return c.text("body not provided", 400)

        const tenant = await findTenantByAdminEmail(body.email)
        if (!tenant) return c.text("Email no found in db", 401)

        if (!body.otp) {
            const { data, error } = await sendAdminOTP(tenant.admin, tenant.domain)
            if (error) {
                return c.text(error.message, 500)
            }
            return c.text("OTP sent successfully")
        }

        const validatedOtp = await verifyAdminOTP(tenant.domain, body.otp)

        if (!validatedOtp) {
            return c.text("Invalid OTP", 401)
        }

        const payload: AdminJwtPayload = {
            tenantId: tenant.tenantId,
            domain: tenant.domain,
            adminInfo: tenant.admin as Record<string, unknown>
        }

        const token = await sign(payload, getSecret())

        return c.text(token)
    })

auth.get('/', async (c) => {
    return c.text("Authenticated successfully")
})

export default auth;

