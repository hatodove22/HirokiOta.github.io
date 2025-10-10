import React, { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { getExtensions } from '../../lib/tiptap-extensions'
import '../../styles/prose.css'
// Reuse editor node styles for visual parity
import '../tiptap-node/blockquote-node/blockquote-node.scss'
import '../tiptap-node/code-block-node/code-block-node.scss'
import '../tiptap-node/horizontal-rule-node/horizontal-rule-node.scss'
import '../tiptap-node/list-node/list-node.scss'
import '../tiptap-node/image-node/image-node.scss'
import '../tiptap-node/heading-node/heading-node.scss'
import '../tiptap-node/paragraph-node/paragraph-node.scss'

type Props = {
  doc: any
  className?: string
}

export function TiptapPreview({ doc, className }: Props) {
  const preview = useEditor({
    editable: false,
    immediatelyRender: true,
    extensions: getExtensions(),
    content: doc,
  })

  useEffect(() => {
    if (preview && doc) {
      preview.commands.setContent(doc, false)
    }
  }, [preview, doc])

  if (!preview) return null

  return (
    <EditorContent
      editor={preview}
      className={`prose prose-slate max-w-none dark:prose-invert ${className ?? ''}`}
    />
  )
}
