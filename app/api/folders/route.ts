import { NextResponse } from 'next/server';
import { BASE_DIR, getFolderStructure } from "@/lib/filesystem";
export async function GET() {
    const folderStructure = getFolderStructure();
    return NextResponse.json(folderStructure);
}