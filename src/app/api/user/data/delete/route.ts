import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST() {
    const session = await getServerSession(authOptions);

    if (!session?.user || !(session.user as any).id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    try {
        // LGPD Art. 18 - Soft delete and anonymization
        await prisma.$transaction([
            // Delete authentication links
            prisma.account.deleteMany({ where: { userId } }),
            prisma.session.deleteMany({ where: { userId } }),

            // Anonymize user record
            prisma.user.update({
                where: { id: userId },
                data: {
                    username: "Conta Excluída",
                    email: `deleted_${userId}@matchlearn.com`, // Avoid unique constraint issues but remove real email
                    image: null,
                    role: "user",
                    coins: 0,
                    xp: 0,
                    level: 1,
                },
            })
        ]);

        return NextResponse.json({ success: true, message: "User data anonymized and account deleted." });
    } catch (error) {
        console.error("Error deleting user data:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
