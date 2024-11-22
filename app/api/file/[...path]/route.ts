import { NextRequest, NextResponse } from 'next/server';
import { getFileContent, saveFileContent } from '@/lib/filesystem';

export const dynamic = 'force-dynamic';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const resolvedParams = await params;
        if (!resolvedParams.path) {
            return NextResponse.json(
                { error: 'File path is required' },
                { status: 400 }
            );
        }

        const filePath = resolvedParams.path.join('/');
        const content = getFileContent(filePath);
        return NextResponse.json({ content });
    } catch (error: any) {
        console.error('Error reading file:', error);
        return NextResponse.json(
            { error: error.message || 'Error reading file' },
            { status: error.message === 'File not found' ? 404 : 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const resolvedParams = await params;
        const filePath = resolvedParams.path.join('/');
        const { content } = await request.json();

        if (!filePath || content === undefined) {
            return NextResponse.json(
                { error: 'File path and content are required' },
                { status: 400 }
            );
        }

        saveFileContent(filePath, content);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error saving file:', error);
        return NextResponse.json(
            { error: error.message || 'Error saving file' },
            { status: 500 }
        );
    }
}