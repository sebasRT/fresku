import { zValidator } from '@hono/zod-validator';
import { tenantHoursSchema, tenantSchema } from '@fresku/model/tenants/metadata';
import { getTenantMetadata, setTenantHours, updateTenantMetadata } from '@fresku/redis/tenants';
import getSecret from '@fresku/utils/secret';
import { Hono } from "hono";
import { jwt } from 'hono/jwt';
import z from 'zod';

const metadata = new Hono()

metadata.use("/*", (c, next) => {
    const jwtMiddleware = jwt({
        secret: getSecret(),
    })
    return jwtMiddleware(c, next)
})

const allowedKeys = ['inService', 'name', 'domain', 'domainType', 'database', 'nextOpenDate', "hours"] as const;

const tenantMetaKeysSchema = z.array(z.enum(allowedKeys));

metadata
    .get('/*', async (c) => {
        const domain = c.get('jwtPayload').domain;

        const wildcard = c.req.path.split('/metadata/')[1] ?? '';
        const paramsRaw = wildcard.split('/').filter(Boolean);

        const parsed = tenantMetaKeysSchema.safeParse(paramsRaw);
        if (!parsed.success) {
            return c.json(
                {
                    error: 'Invalid metadata keys requested',
                    details: parsed.error.flatten(),
                },
                400
            );
        }

        const keys = parsed.data;

        const metadata = await getTenantMetadata(domain, keys);
        return c.json(metadata);
    })

    .patch('/',
        zValidator("json", tenantSchema.pick({ inService: true, nextOpenDate: true })),
        async (c) => {
            const tenantId = c.get('jwtPayload').domain;
            const params = c.req.valid('json');
            if (Object.keys(params).length < 1) { return c.json({ succes: false, error: 'No valid parameters provided' }, 400); }

            const result = await updateTenantMetadata(tenantId, params);

            return c.json(result);
        })

    .patch("/hours",
        zValidator("json", tenantHoursSchema.partial()),
        async (c) => {
            const tenantId = c.get('jwtPayload').domain;
            const params = c.req.valid('json');
            const result = await setTenantHours(tenantId, params);
            return c.json(result);
        }
    )

export default metadata;