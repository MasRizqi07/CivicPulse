import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
});

// Startup check for Redis connectivity
export async function checkRedisConnection(): Promise<void> {
  // Skip check during build time (static generation)
  if (typeof window !== "undefined") {
    return;
  }

  try {
    await redis.ping();
  } catch (error) {
    throw new Error(
      `Redis connection failed. REDIS_URL is required for rate limiting and background jobs. ` +
      `Current REDIS_URL: ${redisUrl ? '***configured***' : 'missing'}. ` +
      `Error: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export const cache = {
  async get<T>(key: string): Promise<T | null> {
    const data = await redis.get(key);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return data as T;
    }
  },

  async set(key: string, value: any, ttl?: number): Promise<void> {
    const serialized = typeof value === "string" ? value : JSON.stringify(value);
    if (ttl) {
      await redis.setex(key, ttl, serialized);
    } else {
      await redis.set(key, serialized);
    }
  },

  async del(key: string): Promise<void> {
    await redis.del(key);
  },

  async delPattern(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  },
};

export default redis;
