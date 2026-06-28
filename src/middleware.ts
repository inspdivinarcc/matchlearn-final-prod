import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis/cloudflare';

/**
 * SEC-03: Global IP-based rate limiting middleware.
 * Limits: 100 requests per minute per IP address.
 *
 * Uses @upstash/ratelimit directly (Edge-compatible).
 * Gracefully skips rate limiting if Upstash is not configured.
 */

const isUpstashConfigured =
    !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

const ratelimit = isUpstashConfigured
    ? new Ratelimit({
        redis: new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL!,
            token: process.env.UPSTASH_REDIS_REST_TOKEN!,
        }),
        limiter: Ratelimit.slidingWindow(100, '1 m'),
        prefix: 'ratelimit:global-ip',
    })
    : null;

export async function middleware(request: NextRequest) {
    // Skip rate limiting if Upstash is not configured (dev mode)
    if (!ratelimit) {
        return NextResponse.next();
    }

    // Get client IP — supports Vercel, Cloudflare, and standard proxies
    const ip =
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        request.headers.get('x-real-ip') ||
        '127.0.0.1';

    const result = await ratelimit.limit(`ip:${ip}`);

    if (!result.success) {
        const retryAfter = Math.ceil((result.reset - Date.now()) / 1000);
        return NextResponse.json(
            { error: 'Too many requests. Please try again later.' },
            {
                status: 429,
                headers: {
                    'Retry-After': String(Math.max(retryAfter, 1)),
                },
            }
        );
    }

    return NextResponse.next();
}

// Apply to API routes and server actions only (not static assets)
export const config = {
    matcher: [
        '/api/:path*',
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
