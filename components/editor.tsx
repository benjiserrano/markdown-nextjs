'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { MdEditor } from 'md-editor-rt';
import { Button } from './ui/button';
import { Save } from 'lucide-react';
import 'md-editor-rt/lib/style.css';
import './../app/custom.css';

interface EditorProps {
  text: string;
  setText: (text: string) => void;
  currentFile?: string;
}

export function Editor({ text, setText, currentFile }: EditorProps) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!currentFile) return;

    try {
      setIsSaving(true);
      const response = await fetch(`/api/file/${encodeURIComponent(currentFile)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: text }),
      });

      if (!response.ok) {
        throw new Error('Failed to save file');
      }
    } catch (error) {
      console.error('Error saving file:', error);
      // Aquí podrías mostrar una notificación de error
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full">
      <Tabs defaultValue="edit" className="h-full">
        <div className="flex items-center justify-between border-b px-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {currentFile || 'No file selected'}
          </div>
          <div className="flex items-center gap-2">
            {currentFile && (
              <Button 
                size="sm" 
                onClick={handleSave}
                disabled={isSaving}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            )}
            <TabsList className="h-12 bg-transparent">
              <TabsTrigger value="edit">Edit</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
          </div>
        </div>
        <TabsContent value="edit" className="h-[calc(100%-3rem)] mt-0">
          <MdEditor 
            style={{ height: '100%' }} 
            theme='dark' 
            language='es-ES' 
            autoFocus={true} 
            showCodeRowNumber={true} 
            autoDetectCode={true} 
            scrollAuto={true} 
            value={text} 
            onChange={setText} 
          />
        </TabsContent>
        <TabsContent value="preview" className="h-[calc(100%-3rem)] mt-0">
          {/* Preview content */}
        </TabsContent>
      </Tabs>
    </div>
  );
}