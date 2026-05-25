import { RedisUser } from "@fresku/model/users/index";
import { getSecret } from "@fresku/utils/secret";
import { getNowInUTC } from "@fresku/utils/time/index";
import { sign } from 'hono/jwt';
import Redis from "ioredis";
import { getRedisClient } from ".";

let redis: Redis

async function init() {
    redis = await getRedisClient();
}

async function setNewUserSession(email: string) {
    await init();
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiresAt = getNowInUTC().plus({ minutes: 10 }).toJSDate();

    const token = await sign({ email, }, getSecret())

    const body: RedisUser = {
        token,
        otp,
        otpExpiresAt,
    }

    return await redis.hmset(`user:${email}`, body)
}

export { setNewUserSession };

