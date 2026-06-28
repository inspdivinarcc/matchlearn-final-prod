import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis/cloudflare';

/**
 * Rate limiter instances using @upstash/ratelimit.
 * Falls back to allowing all requests if Upstash env vars are not configured.
 */

const isUpstashConfigured =
    !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = isUpstashConfigured
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
    : null;

// SEC-03: Max 10 battles per hour per userId
export const battleRateLimiter = redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, '1 h'),
        prefix: 'ratelimit:battle',
    })
    : null;

// SEC-03: Max 100 requests per minute per IP (global)
export const globalIpRateLimiter = redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(100, '1 m'),
        prefix: 'ratelimit:global-ip',
    })
    : null;

/**
 * Helper to check rate limit. Returns { allowed: true } or { allowed: false, retryAfter }.
 * If Upstash is not configured, always allows (for dev convenience).
 */
export async function checkRateLimit(
    limiter: Ratelimit | null,
    identifier: string
): Promise<{ allowed: boolean; retryAfter?: number }> {
    if (!limiter) {
        // Upstash not configured — allow (dev mode)
        return { allowed: true };
    }

    const result = await limiter.limit(identifier);

    if (!result.success) {
        const retryAfter = Math.ceil((result.reset - Date.now()) / 1000);
        return { allowed: false, retryAfter: Math.max(retryAfter, 1) };
    }

    return { allowed: true };
}
