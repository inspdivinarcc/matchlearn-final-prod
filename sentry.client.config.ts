import * as Sentry from '@sentry/nextjs';

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Performance Monitoring — sample 10% of transactions in production
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Session Replay — capture 10% of sessions, 100% of errors
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // Only enable in production or when DSN is configured
    enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,

    integrations: [
        Sentry.replayIntegration(),
    ],
});
