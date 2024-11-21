import { NextRequest, NextResponse } from 'next/server';
import { BASE_DIR, getFolderStructure, getFileContent } from "@/lib/filesystem";

interface RouteParams {
  params: { path: string };
}

export function GET(request: Request, { params }: RouteParams) {
  const folderPath = params.path;
  return NextResponse.json(getFolderStructure(folderPath));
}