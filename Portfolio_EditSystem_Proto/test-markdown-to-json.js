// Test script to verify markdown to JSON conversion
const { Editor } = require('@tiptap/core');
const { StarterKit } = require('@tiptap/starter-kit');
const { Image } = require('@tiptap/extension-image');
const { TaskList, TaskItem } = require('@tiptap/extension-list');
const { TextAlign } = require('@tiptap/extension-text-align');
const { Typography } = require('@tiptap/extension-typography');
const { Highlight } = require('@tiptap/extension-highlight');
const { Subscript } = require('@tiptap/extension-subscript');
const { Superscript } = require('@tiptap/extension-superscript');

// Test markdown content
const testMarkdown = `# 見出し1

これは**太字**のテキストです。

これは*斜体*のテキストです。

## 見出し2

- リスト項目1
- リスト項目2
- リスト項目3

1. 番号付きリスト1
2. 番号付きリスト2
3. 番号付きリスト3

\`\`\`javascript
console.log('コードブロック');
\`\`\`

> これは引用です。`;

console.log('=== MARKDOWN TO JSON CONVERSION TEST ===');
console.log('1. Test markdown content:');
console.log(testMarkdown);
console.log('\n2. Starting conversion...');

try {
  // Create a temporary editor instance to convert markdown to JSON
  const tempEditor = new Editor({
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
    ],
    content: testMarkdown,
  });
  
  console.log('3. Temporary editor created successfully');
  
  const jsonContent = tempEditor.getJSON();
  console.log('4. JSON content extracted:');
  console.log(JSON.stringify(jsonContent, null, 2));
  
  tempEditor.destroy();
  console.log('5. Temporary editor destroyed');
  
  const jsonString = JSON.stringify(jsonContent);
  console.log('6. JSON stringified:');
  console.log(jsonString);
  console.log('7. JSON string length:', jsonString.length);
  
  console.log('\n=== TEST COMPLETED SUCCESSFULLY ===');
} catch (error) {
  console.error('=== TEST FAILED ===');
  console.error('Error:', error);
  console.error('Error stack:', error.stack);
}
