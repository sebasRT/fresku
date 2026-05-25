// import Redis from "ioredis";
import { Redis } from '@upstash/redis';
import { getRedisClient } from ".";

let redis: Redis

async function init() {
    redis = await getRedisClient();
}

type Suffix = "otp" | "session";

function adminRedisKey(id: string, suffix?: Suffix) {
    const suffixString = suffix ? `:${suffix}` : "";
    return `admin:${id}` + suffixString;
}

async function setAdminOTP(tenantId: string, otp: string) {
    await init();
    return await redis.set(adminRedisKey(tenantId, "otp"), otp, { ex: 600 })
}

async function getAdminOTP(tenantId: string) {
    await init();
    return await redis.get(adminRedisKey(tenantId, "otp"))
}

export { getAdminOTP, setAdminOTP };

