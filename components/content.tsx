import { useState } from 'react';
import { Editor } from './editor';
import { FileExplorer } from './file-explorer';

export function Content() {
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
    <div className="flex">
      <FileExplorer setText={setText} />
      <Editor text={text} setText={setText} />
    </div>
  );
}
