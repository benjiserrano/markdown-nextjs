import { NextRequest, NextResponse } from 'next/server';
import { BASE_DIR, getFolderStructure, getFileContent } from "@/lib/filesystem";

interface RouteParams {
  params: { path: string };
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string }> }
) {
    const resolvedParams = await params;
    const folderPath = resolvedParams.path;
    return NextResponse.json(getFolderStructure(folderPath));
}