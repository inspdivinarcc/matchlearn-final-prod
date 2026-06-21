import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/lib/prisma';
import { createWalletForUser } from '@/lib/wallet-utils';

/**
 * This function takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property.
 */
async function refreshAccessToken(token: any) {
    try {
        const url =
            "https://oauth2.googleapis.com/token?" +
            new URLSearchParams({
                client_id: process.env.GOOGLE_CLIENT_ID || '',
                client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
                grant_type: "refresh_token",
                refresh_token: token.refreshToken,
            });

        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            method: "POST",
        });

        const refreshedTokens = await response.json();

        if (!response.ok) {
            throw refreshedTokens;
        }

        return {
            ...token,
            accessToken: refreshedTokens.access_token,
            accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
            refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
        };
    } catch (error) {
        console.log("Error refreshing access token", error);

        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    }
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: 'jwt',
        maxAge: 60 * 60, // 1 hour for SEC-16
    },
    useSecureCookies: process.env.NODE_ENV === "production",
    cookies: {
        sessionToken: {
            name: `${process.env.NODE_ENV === "production" ? "__Secure-" : ""}next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
            },
        },
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID || '',
            clientSecret: process.env.GITHUB_SECRET || '',
        }),
    ],
    events: {
        async createUser({ user }) {
            if (user.id) {
                await createWalletForUser(user.id);
            }
        },
    },
    callbacks: {
        async jwt({ token, user, trigger, session, account }) {
            // Initial sign in
            if (account && user) {
                token.id = user.id;
                token.coins = (user as any).coins;
                token.isPremium = (user as any).isPremium;
                token.level = (user as any).level;
                token.role = (user as any).role;

                // Save access/refresh tokens in JWT
                token.accessToken = account.access_token;
                token.accessTokenExpires = account.expires_at ? account.expires_at * 1000 : Date.now() + 60 * 60 * 1000;
                token.refreshToken = account.refresh_token;

                return token;
            }

            // Return previous token if the access token has not expired yet (e.g. valid for at least another 5 mins)
            if (Date.now() < (token.accessTokenExpires as number) - 5 * 60 * 1000) {
                // Update token if session is updated (e.g. coins changed)
                if (trigger === "update" && session) {
                    return { ...token, ...session.user };
                }
                return token;
            }

            // Access token has expired, try to update it
            if (token.refreshToken) {
                return refreshAccessToken(token);
            }

            // If no refresh token is present, just return the token (user might get logged out or face API errors)
            return token;
        },
        async session({ session, token }: any) {
            if (session?.user) {
                session.user.id = token.id;
                session.user.coins = token.coins;
                session.user.isPremium = token.isPremium;
                session.user.level = token.level;
                session.user.role = token.role;

                // Pass access token to session if it exists (useful for external APIs)
                session.accessToken = token.accessToken;
                session.error = token.error;
            }
            return session;
        },
    },
};

