import { redis } from "../redis";
import { DISCOVERY_LIMITS } from "./config";

function currentDay() {
    return new Date().toISOString().slice(0, 10); // 2026-07-10
}

export async function canUse(
    platform: keyof typeof DISCOVERY_LIMITS
) {
    const key = `usage:${currentDay()}:${platform}`;

    const used = Number(await redis.get(key) ?? 0);

    return used < DISCOVERY_LIMITS[platform];
}

export async function recordUsage(
    platform: keyof typeof DISCOVERY_LIMITS,
    amount = 1
) {
    const key = `usage:${currentDay()}:${platform}`;

    await redis.incrby(key, amount);

    const ttl = await redis.ttl(key);

    if (ttl < 0) {
        // expire after 2 days (gives a little buffer)
        await redis.expire(key, 60 * 60 * 24 * 2);
    }
}