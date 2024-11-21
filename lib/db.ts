import { FileSystemItem, CreateItemRequest, UpdateItemRequest } from './types';
// import { v4 as uuidv4 } from 'uuid';

class FileSystemDB {
  private items: Map<string, FileSystemItem>;

  constructor() {
    this.items = new Map();
    this.initializeDefaultItems();
  }

  private initializeDefaultItems() {
    const documentsId = this.createItem({
      name: 'Documents',
      type: 'folder',
      parentId: null,
    });

    this.createItem({
      name: 'README.md',
      type: 'file',
      parentId: documentsId,
      content: '# Welcome\n\nThis is a sample readme file.',
    });

    const projectsId = this.createItem({
      name: 'Projects',
      type: 'folder',
      parentId: null,
    });

    const docsId = this.createItem({
      name: 'Documentation',
      type: 'folder',
      parentId: projectsId,
    });

    this.createItem({
      name: 'api.md',
      type: 'file',
      parentId: docsId,
      content: '# API Documentation\n\nThis is the API documentation.',
    });
  }

  private createItem(request: CreateItemRequest): string {
    const id = '1234';
    const now = new Date().toISOString();
    
    const item: FileSystemItem = {
      id,
      name: request.name,
      type: request.type,
      parentId: request.parentId,
      content: request.content,
      createdAt: now,
      updatedAt: now,
    };

    this.items.set(id, item);
    return id;
  }

  getAllItems(): FileSystemItem[] {
    return Array.from(this.items.values());
  }

  getItemById(id: string): FileSystemItem | undefined {
    return this.items.get(id);
  }

  getChildren(parentId: string | null): FileSystemItem[] {
    return Array.from(this.items.values()).filter(
      (item) => item.parentId === parentId
    );
  }

  updateItem(id: string, updates: UpdateItemRequest): FileSystemItem | undefined {
    const item = this.items.get(id);
    if (!item) return undefined;

    const updatedItem = {
      ...item,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.items.set(id, updatedItem);
    return updatedItem;
  }

  deleteItem(id: string): boolean {
    const item = this.items.get(id);
    if (!item) return false;

    // Delete all children if it's a folder
    if (item.type === 'folder') {
      const children = this.getChildren(id);
      children.forEach((child) => this.deleteItem(child.id));
    }

    return this.items.delete(id);
  }
}

// Singleton instance
export const db = new FileSystemDB();