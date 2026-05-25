// import Redis from "ioredis";
import { Redis } from '@upstash/redis';

const redisUrl = process.env.REDIS_URL;
let redis: Redis | null = null;
async function getRedisClient(): Promise<Redis> {
    if (!redis) {
        if (!redisUrl) {
            throw new Error("REDIS_URL environment variable is not set");
        }
        redis = Redis.fromEnv();
        // Wait for the connection to be ready
        // await new Promise<void>((resolve, reject) => {
        //     redis!.once("ready", () => resolve());
        //     redis!.once("error", (err) => reject(err));
        // });
    }
    return redis;
}


export { getRedisClient };

