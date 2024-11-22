import { NextResponse, NextRequest } from 'next/server';
import { getFileContent, saveFileContent } from '@/lib/filesystem';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // Asegurarse de que params.path existe antes de usarlo
    if (!params.path) {
      return NextResponse.json(
        { error: 'File path is required' },
        { status: 400 }
      );
    }

    const filePath = params.path.join('/');
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
  { params }: { params: { path: string[] } }
) {
  try {
    const filePath = params.path.join('/');
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