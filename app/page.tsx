'use client';

import { ResizablePanelGroup, ResizablePanel } from '@/components/ui/resizable';
import { FileExplorer } from '@/components/file-explorer';
import { Editor } from '@/components/editor';
import { useState } from 'react';

export default function Home() {
  const [currentFile, setCurrentFile] = useState<string>();
  const [text, setText] = useState(`# Welcome to the Markdown Editor

## Features

- File explorer with folders
- Live preview
- Dark mode support
- Beautiful UI

## Getting Started

1. Create a new file
2. Write your markdown
3. See the live preview

\`\`\`javascript
console.log('Hello, World!');
\`\`\`
  `);

  return (
    <main className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <FileExplorer setCurrentFile={setCurrentFile} setText={setText} />
        </ResizablePanel>
        <ResizablePanel defaultSize={80}>
          <Editor currentFile={currentFile} setText={setText} text={text} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}