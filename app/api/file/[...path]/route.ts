import { NextResponse } from 'next/server';
import { getFileContent, saveFileContent } from '@/lib/filesystem';

export async function GET(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  try {
    // Unir los segmentos de la ruta con '/'
    const filePath = params.path.join('/');

    if (!filePath) {
      return NextResponse.json(
        { error: 'File path is required' },
        { status: 400 }
      );
    }

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
  request: Request,
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