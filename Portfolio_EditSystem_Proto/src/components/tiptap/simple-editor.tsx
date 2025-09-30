import React, { useEffect } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'

type SimpleEditorProps = {
  valueHTML?: string
  onChangeHTML?: (html: string) => void
  placeholder?: string
  className?: string
}

export default function SimpleEditor({ valueHTML = '', onChangeHTML, placeholder = 'Write something …', className }: SimpleEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Link.configure({ openOnClick: true }),
      Image,
      Placeholder.configure({ placeholder }),
    ],
    content: valueHTML || '<p></p>',
    onUpdate: ({ editor }) => {
      onChangeHTML?.(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert focus:outline-none min-h-[240px] p-3 rounded-md border border-border bg-background',
      },
    },
  })

  useEffect(() => {
    if (!editor) return
    // only set when external changes occur
    const current = editor.getHTML()
    if (valueHTML && valueHTML !== current) {
      editor.commands.setContent(valueHTML, false)
    }
  }, [valueHTML, editor])

  if (!editor) return null

  return (
    <div className={className}>
      <div className="flex items-center gap-1 rounded-md border bg-card p-1 mb-2">
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })}>H1</ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })}>H2</ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })}>H3</ToolbarButton>
        <Divider />
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')}>B</ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')}>I</ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')}>S</ToolbarButton>
        <Divider />
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')}>• List</ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')}>1. List</ToolbarButton>
        <Divider />
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()}>HR</ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()}>↶</ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()}>↷</ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}

function ToolbarButton({ onClick, active, children }: { onClick: () => void; active?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'px-2 py-1 text-sm rounded-md border ' +
        (active ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-foreground border-border hover:bg-muted')
      }
    >
      {children}
    </button>
  )
}

function Divider() {
  return <span className="w-px h-5 bg-border mx-1 inline-block" />
}

