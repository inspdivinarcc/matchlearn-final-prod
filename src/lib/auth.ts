import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/lib/prisma';
import { createWalletForUser } from '@/lib/wallet-utils';

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: { strategy: 'jwt' }, // Credentials requires JWT
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID || '',
            clientSecret: process.env.GITHUB_SECRET || '',
        }),
        CredentialsProvider({
            name: 'Test Account',
            credentials: {
                email: { label: "Email", type: "email", placeholder: "teste@matchlearn.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                console.log('Authorize called with:', credentials?.email);
                if (!credentials?.email) return null;

                const email = credentials.email;

                // Check if user exists
                let user = await prisma.user.findUnique({
                    where: { email },
                });
                console.log('User found:', user ? user.id : 'No');

                // If not, create user (Auto-registration for testing)
                if (!user) {
                    console.log('Creating new user...');
                    user = await prisma.user.create({
                        data: {
                            email,
                            username: email.split('@')[0],
                            // No password hash check for this prototype
                        },
                    });
                    console.log('User created:', user.id);
                    // Create wallet for new user
                    try {
                        await createWalletForUser(user.id);
                        console.log('Wallet created for user');
                    } catch (e) {
                        console.error('Failed to create wallet:', e);
                    }
                }

                return user;
            }
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
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.coins = (user as any).coins;
                token.isPremium = (user as any).isPremium;
                token.level = (user as any).level;
            }
            // Update token if session is updated (e.g. coins changed)
            if (trigger === "update" && session) {
                return { ...token, ...session.user };
            }
            return token;
        },
        async session({ session, token }: any) {
            if (session?.user) {
                session.user.id = token.id;
                session.user.coins = token.coins;
                session.user.isPremium = token.isPremium;
                session.user.level = token.level;
            }
            return session;
        },
    },
};
