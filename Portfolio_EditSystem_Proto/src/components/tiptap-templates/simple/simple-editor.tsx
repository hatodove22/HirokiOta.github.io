"use client"

import * as React from "react"
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"
import { Markdown } from "tiptap-markdown"

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { Image } from "@tiptap/extension-image"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Selection } from "@tiptap/extensions"
import { DataFlowVisualizer } from "../../debug/DataFlowVisualizer"

// --- UI Primitives ---
import { Button } from "../../tiptap-ui-primitive/button"
import { Spacer } from "../../tiptap-ui-primitive/spacer"
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "../../tiptap-ui-primitive/toolbar"

// --- Tiptap Node ---
import { ImageUploadNode } from "../../tiptap-node/image-upload-node/image-upload-node-extension"
import { HorizontalRule } from "../../tiptap-node/horizontal-rule-node/horizontal-rule-node-extension"
import "../../tiptap-node/blockquote-node/blockquote-node.scss"
import "../../tiptap-node/code-block-node/code-block-node.scss"
import "../../tiptap-node/horizontal-rule-node/horizontal-rule-node.scss"
import "../../tiptap-node/list-node/list-node.scss"
import "../../tiptap-node/image-node/image-node.scss"
import "../../tiptap-node/heading-node/heading-node.scss"
import "../../tiptap-node/paragraph-node/paragraph-node.scss"

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "../../tiptap-ui/heading-dropdown-menu"
import { ImageUploadButton } from "../../tiptap-ui/image-upload-button"
import { ListDropdownMenu } from "../../tiptap-ui/list-dropdown-menu"
import { BlockquoteButton } from "../../tiptap-ui/blockquote-button"
import { CodeBlockButton } from "../../tiptap-ui/code-block-button"
import {
  ColorHighlightPopover,
  ColorHighlightPopoverContent,
  ColorHighlightPopoverButton,
} from "../../tiptap-ui/color-highlight-popover"
import {
  LinkPopover,
  LinkContent,
  LinkButton,
} from "../../tiptap-ui/link-popover"
import { MarkButton } from "../../tiptap-ui/mark-button"
import { TextAlignButton } from "../../tiptap-ui/text-align-button"
import { UndoRedoButton } from "../../tiptap-ui/undo-redo-button"

// --- Icons ---
import { ArrowLeftIcon } from "../../tiptap-icons/arrow-left-icon"
import { HighlighterIcon } from "../../tiptap-icons/highlighter-icon"
import { LinkIcon } from "../../tiptap-icons/link-icon"

// --- Hooks ---
import { useIsMobile } from "../../../hooks/use-mobile"
import { useWindowSize } from "../../../hooks/use-window-size"
import { useCursorVisibility } from "../../../hooks/use-cursor-visibility"

// --- Components ---
import { ThemeToggle } from "./theme-toggle"

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "../../../lib/tiptap-utils"
import { getMarkdownFromStorage } from "../../../types/editor";

// --- Styles ---
import "./simple-editor.scss"

import content from "./data/content.json"

const MainToolbarContent = ({
  onHighlighterClick,
  onLinkClick,
  isMobile,
}: {
  onHighlighterClick: () => void
  onLinkClick: () => void
  isMobile: boolean
}) => {
  return (
    <>
      <Spacer />

      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu levels={[1, 2, 3, 4]} portal={isMobile} />
        <ListDropdownMenu
          types={["bulletList", "orderedList", "taskList"]}
          portal={isMobile}
        />
        <BlockquoteButton />
        <CodeBlockButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        {!isMobile ? (
          <ColorHighlightPopover />
        ) : (
          <ColorHighlightPopoverButton onClick={onHighlighterClick} />
        )}
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ImageUploadButton text="Add" />
      </ToolbarGroup>

      <Spacer />

      {isMobile && <ToolbarSeparator />}

      <ToolbarGroup>
        <ThemeToggle />
      </ToolbarGroup>
    </>
  )
}

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: "highlighter" | "link"
  onBack: () => void
}) => (
  <>
    <ToolbarGroup>
      <Button data-style="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === "highlighter" ? (
      <ColorHighlightPopoverContent />
    ) : (
      <LinkContent />
    )}
  </>
)

interface SimpleEditorProps {
  initialContent?: string;
  onContentChange?: (html: string) => void;
}

export function SimpleEditor({ initialContent, onContentChange }: SimpleEditorProps = {}) {
  const isMobile = useIsMobile()
  const { height } = useWindowSize()
  const [mobileView, setMobileView] = React.useState<
    "main" | "highlighter" | "link"
  >("main")
  const toolbarRef = React.useRef<HTMLDivElement>(null)

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "simple-editor",
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      Markdown.configure({
        html: false,
        transformPastedText: true,
        transformCopiedText: true,
        linkify: true,
        breaks: true,
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error("Upload failed:", error),
      }),
    ],
    content: initialContent || content,
    onUpdate: ({ editor }) => {
      // Enhanced Debug: Detailed editor state analysis
      console.log('=== EDITOR UPDATE DEBUG ===');
      console.log('Editor storage:', editor.storage);
      console.log('Editor storage.markdown:', (editor.storage as any)?.markdown);
      console.log('Editor storage.markdown type:', typeof (editor.storage as any)?.markdown);
      
      // Get raw HTML for analysis
      const rawHTML = editor.getHTML();
      console.log('Raw HTML output:', rawHTML);
      console.log('Raw HTML length:', rawHTML.length);
      console.log('Raw HTML type:', typeof rawHTML);
      
      // Analyze HTML structure
      const hasHeadings = /<h[1-6][^>]*>/i.test(rawHTML);
      const hasLists = /<(ul|ol)[^>]*>/i.test(rawHTML);
      const hasFormatting = /<(strong|b|em|i)[^>]*>/i.test(rawHTML);
      console.log('HTML Analysis - Headings:', hasHeadings, 'Lists:', hasLists, 'Formatting:', hasFormatting);
      
      // Try to get markdown from the extension directly
      let markdown: string | undefined;
      
      // Method 1: Try to get from storage
      markdown = getMarkdownFromStorage(editor.storage);
      console.log('Method 1 - Storage markdown:', markdown);
      console.log('Method 1 - Markdown type:', typeof markdown);
      console.log('Method 1 - Markdown length:', markdown?.length);
      
      // Method 2: Try to access the extension directly
      if (!markdown && (editor.storage as any)?.markdown) {
        const markdownExt = (editor.storage as any).markdown;
        console.log('Method 2 - Markdown extension found:', markdownExt);
        console.log('Method 2 - getMarkdown function exists:', typeof markdownExt.getMarkdown === 'function');
        if (typeof markdownExt.getMarkdown === 'function') {
          markdown = markdownExt.getMarkdown();
          console.log('Method 2 - Direct extension markdown:', markdown);
          console.log('Method 2 - Markdown type:', typeof markdown);
          console.log('Method 2 - Markdown length:', markdown?.length);
        }
      }
      
      // Method 3: Try to get markdown from the editor's markdown extension
      if (!markdown) {
        try {
          // Access the markdown extension from the editor's extensions
          const markdownExtension = editor.extensionManager.extensions.find(ext => ext.name === 'markdown');
          console.log('Method 3 - Markdown extension found:', !!markdownExtension);
          if (markdownExtension) {
            console.log('Method 3 - Extension storage:', markdownExtension.storage);
            console.log('Method 3 - getMarkdown exists:', !!(markdownExtension.storage as any)?.getMarkdown);
          }
          if (markdownExtension && (markdownExtension.storage as any)?.getMarkdown) {
            markdown = (markdownExtension.storage as any).getMarkdown();
            console.log('Method 3 - Extension storage markdown:', markdown);
            console.log('Method 3 - Markdown type:', typeof markdown);
            console.log('Method 3 - Markdown length:', markdown?.length);
          }
        } catch (e) {
          console.log('Method 3 failed:', e);
        }
      }
      
      // Method 4: Convert HTML to markdown manually
      // Check if markdown is empty, null, undefined, or whitespace-only
      const isEmptyMarkdown = !markdown || markdown.trim().length === 0;
      console.log('Method 4 - Is markdown empty?', isEmptyMarkdown);
      
      if (isEmptyMarkdown) {
        const html = editor.getHTML();
        console.log('Method 4 - Converting HTML to markdown:', html);
        
        // Enhanced HTML to markdown conversion with better regex patterns
        markdown = html
          // Convert headings with nested content support
          .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (match, content) => {
            const cleanContent = content.replace(/<[^>]*>/g, '').trim();
            return cleanContent ? `# ${cleanContent}\n\n` : '';
          })
          .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (match, content) => {
            const cleanContent = content.replace(/<[^>]*>/g, '').trim();
            return cleanContent ? `## ${cleanContent}\n\n` : '';
          })
          .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (match, content) => {
            const cleanContent = content.replace(/<[^>]*>/g, '').trim();
            return cleanContent ? `### ${cleanContent}\n\n` : '';
          })
          .replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, (match, content) => {
            const cleanContent = content.replace(/<[^>]*>/g, '').trim();
            return cleanContent ? `#### ${cleanContent}\n\n` : '';
          })
          .replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, (match, content) => {
            const cleanContent = content.replace(/<[^>]*>/g, '').trim();
            return cleanContent ? `##### ${cleanContent}\n\n` : '';
          })
          .replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, (match, content) => {
            const cleanContent = content.replace(/<[^>]*>/g, '').trim();
            return cleanContent ? `###### ${cleanContent}\n\n` : '';
          })
          // Convert lists with nested content support
          .replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (match, content) => {
            const items = content.match(/<li[^>]*>([\s\S]*?)<\/li>/gi);
            if (items && items.length > 0) {
              const listItems = items.map(item => {
                const itemContent = item.replace(/<li[^>]*>([\s\S]*?)<\/li>/i, '$1');
                const cleanContent = itemContent.replace(/<[^>]*>/g, '').trim();
                return cleanContent ? `- ${cleanContent}` : '';
              }).filter(item => item.length > 0);
              return listItems.length > 0 ? listItems.join('\n') + '\n\n' : '';
            }
            return '';
          })
          .replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (match, content) => {
            const items = content.match(/<li[^>]*>([\s\S]*?)<\/li>/gi);
            if (items && items.length > 0) {
              const listItems = items.map((item, index) => {
                const itemContent = item.replace(/<li[^>]*>([\s\S]*?)<\/li>/i, '$1');
                const cleanContent = itemContent.replace(/<[^>]*>/g, '').trim();
                return cleanContent ? `${index + 1}. ${cleanContent}` : '';
              }).filter(item => item.length > 0);
              return listItems.length > 0 ? listItems.join('\n') + '\n\n' : '';
            }
            return '';
          })
          // Convert text formatting with nested content support
          .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, (match, content) => {
            const cleanContent = content.replace(/<[^>]*>/g, '').trim();
            return cleanContent ? `**${cleanContent}**` : '';
          })
          .replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, (match, content) => {
            const cleanContent = content.replace(/<[^>]*>/g, '').trim();
            return cleanContent ? `**${cleanContent}**` : '';
          })
          .replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, (match, content) => {
            const cleanContent = content.replace(/<[^>]*>/g, '').trim();
            return cleanContent ? `*${cleanContent}*` : '';
          })
          .replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, (match, content) => {
            const cleanContent = content.replace(/<[^>]*>/g, '').trim();
            return cleanContent ? `*${cleanContent}*` : '';
          })
          // Convert paragraphs (after headings and lists)
          .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (match, content) => {
            const cleanContent = content.replace(/<[^>]*>/g, '').trim();
            return cleanContent ? `${cleanContent}\n\n` : '';
          })
          // Convert line breaks
          .replace(/<br[^>]*>/gi, '\n')
          // Remove any remaining HTML tags
          .replace(/<[^>]*>/g, '')
          // Clean up multiple newlines
          .replace(/\n\s*\n\s*\n/g, '\n\n')
          .trim();
        
        console.log('Method 4 - Converted markdown:', markdown);
        console.log('Method 4 - Converted markdown length:', markdown.length);
      }
      
      // Enhanced fallback logic with better empty detection
      const fallbackText = editor.getText();
      const isFallbackEmpty = !fallbackText || fallbackText.trim().length === 0;
      console.log('Fallback text:', fallbackText);
      console.log('Is fallback empty?', isFallbackEmpty);
      
      // Use markdown if it's not empty, otherwise use fallback
      const output = (markdown && markdown.trim().length > 0) ? markdown : fallbackText;
      
      console.log('Tiptap markdown output:', markdown);
      console.log('Tiptap fallback text:', fallbackText);
      console.log('Final output:', output);
      console.log('Final output length:', output.length);
      console.log('=== END EDITOR UPDATE DEBUG ===');
      
      onContentChange?.(output);
    },
  })

  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  })

  React.useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main")
    }
  }, [isMobile, mobileView])

  // Update editor content when initialContent changes
  React.useEffect(() => {
    if (editor && initialContent !== undefined) {
      console.log('Editor initialized, checking storage:', editor.storage);
      console.log('Editor storage.markdown:', (editor.storage as any)?.markdown);
      
      const currentMarkdown = getMarkdownFromStorage(editor.storage);
      console.log('Current markdown from storage:', currentMarkdown);
      console.log('Initial content:', initialContent);
      
      if (currentMarkdown !== initialContent) {
        console.log('Setting content with initialContent:', initialContent);
        editor.commands.setContent(initialContent, { emitUpdate: false });
      }
    }
  }, [editor, initialContent])

  return (
    <div className="simple-editor-wrapper">
      <EditorContext.Provider value={{ editor }}>
        <Toolbar
          ref={toolbarRef}
          style={{
            ...(isMobile
              ? {
                  bottom: `calc(100% - ${height - rect.y}px)`,
                }
              : {}),
          }}
        >
          {mobileView === "main" ? (
            <MainToolbarContent
              onHighlighterClick={() => setMobileView("highlighter")}
              onLinkClick={() => setMobileView("link")}
              isMobile={isMobile}
            />
          ) : (
            <MobileToolbarContent
              type={mobileView === "highlighter" ? "highlighter" : "link"}
              onBack={() => setMobileView("main")}
            />
          )}
        </Toolbar>

        <EditorContent
          editor={editor}
          role="presentation"
          className="simple-editor-content"
        />
      </EditorContext.Provider>
      
      {/* データフロー可視化システム */}
      <DataFlowVisualizer 
        editorContent={editor?.getHTML() || ''}
        previewContent=""
        onContentChange={onContentChange}
      />
    </div>
  )
}
