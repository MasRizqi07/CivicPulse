import redis from "./cache";

interface RateLimitConfig {
  limit: number;
  window: number; // in seconds
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number;
}

const rateLimits: Record<string, RateLimitConfig> = {
  auth: { limit: 5, window: 60 }, // 5 requests per minute
  reportCreate: { limit: 10, window: 3600 }, // 10 per hour
  general: { limit: 100, window: 60 }, // 100 per minute
};

export async function checkRateLimit(
  identifier: string,
  type: keyof typeof rateLimits
): Promise<RateLimitResult> {
  const config = rateLimits[type];
  const key = `ratelimit:${type}:${identifier}`;

  const current = await redis.incr(key);

  if (current === 1) {
    // First request, set expiration
    await redis.expire(key, config.window);
  }

  const remaining = Math.max(0, config.limit - current);
  const success = current <= config.limit;

  // Get TTL for reset time
  const ttl = await redis.ttl(key);
  const reset = ttl > 0 ? Date.now() + ttl * 1000 : Date.now() + config.window * 1000;

  return {
    success,
    remaining,
    reset,
  };
}

export function getRateLimitHeaders(result: RateLimitResult) {
  return {
    "X-RateLimit-Limit": rateLimits.general.limit.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": result.reset.toString(),
    ...(result.success ? {} : { "Retry-After": "60" }),
  };
}
