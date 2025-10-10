import React from 'react'
import '@testing-library/jest-dom'

jest.mock('dompurify', () => ({
  __esModule: true,
  default: { sanitize: (html: string) => html },
  sanitize: (html: string) => html,
}))

jest.mock('markdown-it', () => {
  return jest.fn().mockImplementation(() => ({
    render: (markdown: string) => {
      return markdown
        .replace(/^###### (.+)$/gm, '<h6>$1</h6>')
        .replace(/^##### (.+)$/gm, '<h5>$1</h5>')
        .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/^> (.+)$/gm, '<blockquote><p>$1</p></blockquote>')
        .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .split('\n')
        .map((line) => {
          if (line.startsWith('<h') || line.startsWith('<blockquote>')) return line
          if (line.startsWith('<li>')) return line
          return line.trim() ? `<p>${line.trim()}</p>` : ''
        })
        .filter(Boolean)
        .join('\n')
        .replace(/(<li>.*<\/li>)(\n(?=<li>))+?/g, '$1')
        .replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>')
    },
  }))
})

jest.mock('@radix-ui/react-slot@1.1.2', () => ({
  Slot: ({ children }: any) => <>{children}</>,
}))

jest.mock('class-variance-authority@0.7.1', () => ({
  cva: () => () => '',
}))

jest.mock('./components/tiptap-templates/simple/simple-editor.scss', () => ({}))
jest.mock('./components/tiptap-node/blockquote-node/blockquote-node.scss', () => ({}))
jest.mock('./components/tiptap-node/code-block-node/code-block-node.scss', () => ({}))
jest.mock('./components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss', () => ({}))
jest.mock('./components/tiptap-node/list-node/list-node.scss', () => ({}))
jest.mock('./components/tiptap-node/image-node/image-node.scss', () => ({}))
jest.mock('./components/tiptap-node/heading-node/heading-node.scss', () => ({}))
jest.mock('./components/tiptap-node/paragraph-node/paragraph-node.scss', () => ({}))
