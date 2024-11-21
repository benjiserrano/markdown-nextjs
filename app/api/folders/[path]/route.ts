import { NextRequest, NextResponse } from 'next/server';
import { BASE_DIR, getFolderStructure, getFileContent } from "@/lib/filesystem";
import path from 'path'

interface RouteParams {
  params: { path: string };
}

const DATA_PATH = path.join(process.cwd(), 'data')

// Validate path
export const validatePath = (filePath: string): boolean => {
  const normalizedPath = path.normalize(filePath)
  const resolvedPath = path.resolve(DATA_PATH, normalizedPath)
  return resolvedPath.startsWith(DATA_PATH)
}

export function GET(request: Request, { params }: RouteParams) {
  // Retornar contenido de la carpeta
  const folderPath = params.path;
  return NextResponse.json(getFolderStructure(folderPath));
  if (!validatePath(folderPath)) {
    return NextResponse.json([], { status: 400 });
  }

  const folderStructure = getFolderStructure(folderPath);
  if (folderStructure) {
    return NextResponse.json(folderStructure);
  }
}