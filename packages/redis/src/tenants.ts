import { TenantHours, TenantMeta } from "@fresku/model/tenants/metadata";
import { Redis } from '@upstash/redis';
import { getRedisClient } from ".";

let redis: Redis
const NODE_ENV = process.env.NODE_ENV;

async function init() {
    redis = await getRedisClient();
}

type Suffix = "hours"

function redisId(id: string, dev: boolean = true, suffix?: Suffix) {
    if (NODE_ENV === "development" && dev) {
        return 'tenant:testing' + (suffix ? `:${suffix}` : "");
    }
    return `tenant:${id}` + (suffix ? `:${suffix}` : "");
}

async function getTenantDB(domain: string, dev: boolean = true) {
    await init();

    if (NODE_ENV === "development" && dev) {

        return "t_testing";
    }

    const database = await redis.hget(redisId(domain, dev), "database");

    if (!database) {
        throw new Error(`Tenant database not found for domain: ${domain}`);
    }
    return database as string;
}

async function createRedisTenant(tenant: Omit<TenantMeta, "tenantId">) {

    let id = tenant.domain;
    await init();

    const existingDbName = await redis.hget(redisId(id), "database");
    if (existingDbName) {
        throw new Error(`Tenant already exists for domain: ${tenant.domain}`);
    }

    const result = await redis.hset(`tenant:${id}`, tenant);

    if (!Boolean(result)) {
        throw new Error(`Failed to create tenant for domain: ${tenant.domain}`);
    }

    return id;
}

async function deleteTenantKey(domain: string) {
    await init();
    return redis.del(redisId(domain));
}

async function getTenantMetadata(
    tenantId: string,
    params: Array<keyof TenantMeta>
) {
    await init();

    const entries = await Promise.all(
        params.map(async (key) => {
            const res = await redis.hget(redisId(tenantId), key);
            console.log(res);

            return res !== null ? [key, res] as [keyof TenantMeta, string] : null;
        })
    );

    const metadata: Partial<Record<keyof TenantMeta, string>> = {};
    for (const entry of entries) {
        if (entry) {
            const [key, value] = entry;
            metadata[key] = value;
        }
    }

    return metadata;
}

async function updateTenantMetadata(
    tenantId: string,
    metadata: Partial<TenantMeta>
) {
    await init();
    await redis.hset(redisId(tenantId), metadata);
    return metadata;
}

async function setTenantHours(tenantId: string, hours: Partial<TenantHours>) {
    await init();
    await redis.hset(redisId(tenantId), { "hours": JSON.stringify(hours) });
    return hours;
}

export { createRedisTenant, deleteTenantKey, getTenantDB, getTenantMetadata, setTenantHours, updateTenantMetadata };

