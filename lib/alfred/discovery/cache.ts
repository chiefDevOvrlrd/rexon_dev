import { redis } from "@/lib/alfred/redis";
import { DISCOVERY_LIMITS } from "./config";

export async function getCache<T>(key:string): Promise <T | null> {
    const data = await redis.get(key)

    if (!data) return null;

    if (typeof data === "string") {
        return JSON.parse(data) as T;
    }

    return data as T;
}

export async function setCache(key: string, value: unknown) {
    await redis.set(key, JSON.stringify(value), {
        ex: DISCOVERY_LIMITS.cacheTTL,
    });
}