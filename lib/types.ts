export interface FileSystemItem {
    id: string;
    name: string;
    type: 'file' | 'folder';
    content?: string;
    parentId: string | null;
    children?: FileSystemItem[];
    createdAt: string;
    updatedAt: string;
  }
  
export interface CreateItemRequest {
    name: string;
    type: 'file' | 'folder';
    parentId: string | null;
    content?: string;
}

export interface UpdateItemRequest {
    name?: string;
    content?: string;
}