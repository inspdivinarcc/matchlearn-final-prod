import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request): Promise<NextResponse> {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validar tipo de arquivo
    const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'video/mp4', 'video/webm', 'video/quicktime'
    ];

    if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
            { error: 'Tipo de arquivo não suportado. Use JPEG, PNG, GIF, WEBP, MP4, WEBM ou MOV.' },
            { status: 400 }
        );
    }

    // Limite de 10MB
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
        return NextResponse.json(
            { error: 'Arquivo muito grande. O limite é de 10MB.' },
            { status: 400 }
        );
    }

    try {
        const blob = await put(`stories/${Date.now()}-${file.name}`, file, {
            access: 'public',
        });

        return NextResponse.json({ url: blob.url, type: file.type });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Falha no upload do arquivo.' },
            { status: 500 }
        );
    }
}
