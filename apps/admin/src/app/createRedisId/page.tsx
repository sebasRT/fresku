import { domainToTenantId } from "@fresku/utils/functions/parsing";
import Redis from "ioredis";

const page = () => {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    throw new Error("Please add your Redis URL to .env");
  }

  const submit = async (formData: FormData) => {
    "use server";
    const redis = new Redis(redisUrl);
    const domain = formData.get("domain") as string;
    if (!domain) {
      throw new Error("Domain is required");
    }
    const redisId = domainToTenantId(domain);
    const result = await redis.hset(
      `tenant:${redisId}`,
      "database",
      "t_testing"
    );
    console.log("Redis set result:", result);
    await redis.quit();
  };

  return (
    <form action={submit}>
      <input type="text" name="domain" />
    </form>
  );
};

export default page;
