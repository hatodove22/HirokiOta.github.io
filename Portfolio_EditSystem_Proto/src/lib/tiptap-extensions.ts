// Shared Tiptap extensions for both editor and read-only preview
// Keep this list in sync to ensure identical rendering

import { StarterKit } from '@tiptap/starter-kit'
import { Image } from '@tiptap/extension-image'
import { TaskItem, TaskList } from '@tiptap/extension-list'
import { TextAlign } from '@tiptap/extension-text-align'
import { Typography } from '@tiptap/extension-typography'
import { Highlight } from '@tiptap/extension-highlight'
import { Subscript } from '@tiptap/extension-subscript'
import { Superscript } from '@tiptap/extension-superscript'
import { Selection } from '@tiptap/extensions'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import * as lowlightLib from 'lowlight'

// Local Node extensions
import { ImageUploadNode } from '../components/tiptap-node/image-upload-node/image-upload-node-extension'
import { HorizontalRule } from '../components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension'

export type ExtensionOptions = {
  imageUpload?: {
    upload?: (file: File) => Promise<any>
    accept?: string
    limit?: number
    maxSize?: number
  }
}

const createLowlight = (lowlightLib as any).createLowlight ?? (() => lowlightLib)
const common = (lowlightLib as any).common ?? (lowlightLib as any).lowlight ?? lowlightLib
const lowlight = createLowlight(common)

const DEFAULT_IMAGE_OPTIONS = {
  accept: 'image/*',
  limit: 3,
  maxSize: 5 * 1024 * 1024,
}

export const getExtensions = (options?: ExtensionOptions) => [
  StarterKit.configure({
    horizontalRule: false,
    link: {
      openOnClick: false,
      enableClickSelection: true,
    },
  }),
  HorizontalRule,
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  TaskList,
  TaskItem.configure({ nested: true }),
  Highlight.configure({ multicolor: true }),
  Image,
  Typography,
  Superscript,
  Subscript,
  Selection,
  CodeBlockLowlight.configure({ lowlight, defaultLanguage: 'plaintext' }),
  ...(options?.imageUpload?.upload
    ? [
        ImageUploadNode.configure({
          ...DEFAULT_IMAGE_OPTIONS,
          ...options.imageUpload,
        }),
      ]
    : []),
]
