'use client';

import { useEffect, useState } from 'react';
import { Folder, File, ChevronRight, ChevronDown, Plus, Trash2 } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface FileSystemItem {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: FileSystemItem[];
}

interface FileExplorerProps {
  setText: (text: string) => void;
  setCurrentFile: (path: string) => void;
}

export function FileExplorer({ setText, setCurrentFile }: FileExplorerProps) {
  const [files, setFiles] = useState<FileSystemItem[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [loadedFolders, setLoadedFolders] = useState<Record<string, FileSystemItem[]>>({});

  useEffect(() => {
    // Cargar carpeta raíz inicialmente
    fetchFolderContent('');
  }, []);

  const fetchFolderContent = async (folderPath: string) => {
    try {
      const response = await fetch(`/api/folders/${encodeURIComponent(folderPath)}`);
      const data = await response.json();
      
      if (folderPath === '') {
        // Si es la carpeta raíz, actualizar files directamente
        setFiles(data);
      } else {
        // Si es una subcarpeta, actualizar loadedFolders
        setLoadedFolders(prev => ({
          ...prev,
          [folderPath]: data
        }));
      }
    } catch (error) {
      console.error('Error fetching folder content:', error);
    }
  };

  const toggleFolder = async (path: string) => {
    const newExpanded = new Set(expandedFolders);
    
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
      // Solo cargar el contenido si no se ha cargado antes
      if (!loadedFolders[path]) {
        await fetchFolderContent(path);
      }
    }
    
    setExpandedFolders(newExpanded);
  };

  // Set Text with File content
  const openFile = async (path: string) => {
    try {
      const response = await fetch(`/api/file/${encodeURIComponent(path)}`);
      if (!response.ok) {
        throw new Error('Error loading file');
      }
      const data = await response.json();
      setText(data.content);
      setCurrentFile(path);
    } catch (error) {
      console.error('Error opening file:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  const renderItem = (item: FileSystemItem, depth = 0) => {
    const isExpanded = expandedFolders.has(item.path);
    const paddingLeft = depth * 12;
    const children = loadedFolders[item.path] || [];

    if (item.isDirectory) {
      return (
        <div key={item.path}>
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start px-2 hover:bg-accent',
              isExpanded && 'bg-accent/50'
            )}
            onClick={() => toggleFolder(item.path)}
          >
            <div style={{ paddingLeft: `${paddingLeft}px` }} className="flex items-center gap-2">
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              <Folder className="h-4 w-4" />
              <span>{item.name}</span>
            </div>
          </Button>
          {isExpanded && children.map((child) => renderItem(child, depth + 1))}
        </div>
      );
    } else {
      // Is FILE
      return (
        <Button
          variant="ghost"
          className="w-full justify-start px-2 hover:bg-accent"
          onClick={() => openFile(item.path)}
        >
          <div style={{ paddingLeft: `${paddingLeft + 20}px` }} className="flex items-center gap-2">
            <File className="h-4 w-4" />
            <span>{item.name}</span>
          </div>
        </Button>
      );
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="text-sm font-semibold">Files</h2>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="py-2">
          {files.map((item) => renderItem(item))}
        </div>
      </ScrollArea>
    </div>
  );
}