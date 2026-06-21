import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * SEC-04: RBAC guard for admin-only Server Actions and pages.
 * Verifies that the current session user has role === 'ADMIN'.
 *
 * @returns The session if authorized, or throws/returns error.
 */
export async function requireAdmin() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return { authorized: false as const, error: 'Unauthorized: no session.' };
    }

    const role = (session.user as any).role;
    if (role !== 'ADMIN') {
        return { authorized: false as const, error: 'Forbidden: admin access required.' };
    }

    return { authorized: true as const, session };
}

/**
 * Helper to get authenticated session with userId.
 * Returns session or error — used in regular (non-admin) server actions.
 */
export async function requireAuth() {
    const session = await getServerSession(authOptions);

    if (!session?.user || !(session.user as any).id) {
        return { authorized: false as const, error: 'Unauthorized' };
    }

    return {
        authorized: true as const,
        session,
        userId: (session.user as any).id as string,
    };
}
