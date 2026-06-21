// src/lib/errors.ts

export type ErrorCode =
    | 'INSUFFICIENT_BALANCE'
    | 'BATTLE_NOT_FOUND'
    | 'RATE_LIMIT_EXCEEDED'
    | 'UNAUTHORIZED'
    | 'FORBIDDEN'
    | 'INVALID_INPUT'
    | 'MINT_FAILED'
    | 'INTERNAL_ERROR'
    | 'NOT_FOUND';

export class AppError extends Error {
    public code: ErrorCode;
    public details?: Record<string, any>;

    constructor(code: ErrorCode, details?: Record<string, any>, message?: string) {
        super(message || code);
        this.name = 'AppError';
        this.code = code;
        this.details = details;
    }
}

/**
 * Formats an AppError into a user-friendly message.
 * Falls back to a generic error message for unknown or internal errors.
 */
export function formatErrorForUser(error: unknown): string {
    if (error instanceof AppError) {
        switch (error.code) {
            case 'INSUFFICIENT_BALANCE':
                return `Insufficient balance. Required: ${error.details?.required || '?'}, Current: ${error.details?.current || '?'}.`;
            case 'BATTLE_NOT_FOUND':
                return 'Battle not found, or it has already been completed.';
            case 'RATE_LIMIT_EXCEEDED':
                return `Rate limit exceeded. Please try again in ${error.details?.retryAfter || 'a few'} seconds.`;
            case 'UNAUTHORIZED':
                return 'You must be logged in to perform this action.';
            case 'FORBIDDEN':
                return 'You do not have permission to perform this action.';
            case 'INVALID_INPUT':
                return `Invalid input provided: ${error.details?.reason || 'Please check your data.'}`;
            case 'MINT_FAILED':
                return 'There was an error while minting your NFT. We will retry automatically.';
            case 'NOT_FOUND':
                return 'The requested resource could not be found.';
            case 'INTERNAL_ERROR':
            default:
                return 'An unexpected internal error occurred. Please try again later.';
        }
    }

    if (error instanceof Error) {
        // Optionally return error.message in development mode, but keep it generic for production
        if (process.env.NODE_ENV !== 'production') {
            return error.message;
        }
    }

    return 'An unexpected error occurred. Please try again later.';
}

/**
 * Logs technical details of the error to Sentry or another monitoring service.
 */
export function logErrorToSentry(error: unknown, context?: Record<string, any>): void {
    // In a real application, you would import @sentry/nextjs and call Sentry.captureException(error, { extra: context })
    // For the scope of this implementation, we will log to console.error
    if (error instanceof AppError) {
        console.error(`[AppError] ${error.code}:`, {
            message: error.message,
            details: error.details,
            context,
            stack: error.stack,
        });
    } else if (error instanceof Error) {
        console.error(`[Error] ${error.name}:`, {
            message: error.message,
            context,
            stack: error.stack,
        });
    } else {
        console.error(`[Unknown Error]:`, { error, context });
    }

    // TODO: Actual Sentry Integration
    // import * as Sentry from '@sentry/nextjs';
    // Sentry.captureException(error, { extra: context });
}
