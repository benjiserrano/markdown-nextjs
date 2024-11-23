'use client';

import { useEffect, useState, useCallback } from 'react';
import { Folder, File, ChevronRight, ChevronDown, Plus, Trash2 } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from './ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';

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
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  useEffect(() => {
    // Cargar carpeta raíz inicialmente
    fetchFolderContent('');
  }, []);

  const fetchFolderContent = async (folderPath: string) => {
    try {
      const response = await fetch(`/api/folders/${encodeURIComponent(folderPath)}`);
      const data = await response.json();
      
      const filesArray = Array.isArray(data) ? data : [];
      
      if (folderPath === '') {
        setFiles(filesArray);
      } else {
        setLoadedFolders(prev => ({
          ...prev,
          [folderPath]: filesArray
        }));
      }
    } catch (error) {
      console.error('Error fetching folder content:', error);
      if (folderPath === '') {
        setFiles([]);
      }
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    
    try {
      const response = await fetch(`/api/files/${selectedItem}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete item');

      // Update the UI by removing the deleted item
      const removeItem = (items: FileSystemItem[]): FileSystemItem[] => {
        return items.filter(item => {
          // if (item.id === selectedItem) return false;
          // if (item.children) {
          //   item.children = removeItem(item.children);
          // }
          return true;
        });
      };

      setFiles(removeItem(files));
      setSelectedItem(null);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleToggleFolder = useCallback(async (path: string) => {
    const newExpanded = new Set(expandedFolders);

    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
      if (!loadedFolders[path]) {
        await fetchFolderContent(path);
      }
    }
    
    setSelectedItem(path);
    setExpandedFolders(newExpanded);
  }, [expandedFolders, loadedFolders, fetchFolderContent]);

  const handleOpenFile = useCallback(async (path: string) => {
    try {
      const response = await fetch(`/api/file/${encodeURIComponent(path)}`);
      if (!response.ok) {
        throw new Error('Error loading file');
      }
      const data = await response.json();
      setText(data.content);
      setCurrentFile(path);
      setSelectedItem(path);
    } catch (error) {
      console.error('Error opening file:', error);
    }
  }, [setText, setCurrentFile]);

  const renderItem = useCallback((item: FileSystemItem, depth = 0) => {
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
            onClick={() => handleToggleFolder(item.path)}
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
      return (
        <Button
          key={item.path}
          variant="ghost"
          className="w-full justify-start px-2 hover:bg-accent"
          onClick={() => handleOpenFile(item.path)}
        >
          <div style={{ paddingLeft: `${paddingLeft + 20}px` }} className="flex items-center gap-2">
            <File className="h-4 w-4" />
            <span>{item.name}</span>
          </div>
        </Button>
      );
    }
  }, [expandedFolders, loadedFolders, handleToggleFolder, handleOpenFile]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="text-sm font-semibold">Files</h2>
        <div className="flex gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Plus className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => {}}>
                New File
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {}}>
                New Folder
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                disabled={!selectedItem}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the selected item {selectedItem + ' and all of its contents'}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="py-2">
          {Array.isArray(files) && files.map((item) => renderItem(item))}
        </div>
      </ScrollArea>
    </div>
  );
}