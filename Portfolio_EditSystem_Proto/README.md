
  # Portfolio Editing Screen

  This is a code bundle for Portfolio Editing Screen. The original project is available at https://www.figma.com/design/O4jucAHe5YdV3IcFv5BB12/Portfolio-Editing-Screen.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Rich Text Editor (Tiptap Simple Editor)

  This project uses the official Tiptap UI Components “Simple Editor” template as the rich text editor on the detail edit page (News editor, JA/EN body).

  - Editor component path
    - `src/components/tiptap-templates/simple/simple-editor.tsx` (named export: `SimpleEditor`)
  - Required global styles (already imported in `src/main.tsx`)
    - `src/styles/_variables.scss`
    - `src/styles/_keyframe-animations.scss`
  - Dependencies (pinned to v3)
    - `@tiptap/react`, `@tiptap/pm`, `@tiptap/starter-kit`
    - `@tiptap/extension-{image,link,placeholder,text-align,highlight,color,typography,subscript,superscript}`

  ### Where it’s used
  - `src/components/editors/NewsEditor.tsx`
    - JA/EN body fields render `<SimpleEditor />` from the template.

  ### Directory layout (UI components from template)
  - `src/components/tiptap-templates/simple/*` … Template entry + theme toggle + styles
  - `src/components/tiptap-ui/*` … Toolbar buttons, dropdowns, popovers, etc.
  - `src/components/tiptap-ui-primitive/*` … Button/Toolbar/Tooltip/Separator primitives (SCSS included)
  - `src/components/tiptap-node/*` … Node styles & node-specific extensions (e.g., image-upload-node, hr)
  - `src/components/tiptap-icons/*` … Icons used by the editor UI
  - `src/hooks/*` … Mobile/window-size/cursor-visibility utilities for the editor

  A set of barrel files are provided for easier imports:
  - `src/components/tiptap/index.ts`
  - `src/components/tiptap-templates/index.ts`
  - `src/components/tiptap-ui/index.ts`
  - `src/components/tiptap-ui-primitive/index.ts`
  - `src/components/tiptap-node/index.ts`
  - `src/components/tiptap-icons/index.ts`

  ### Notes
  - The template renders and saves HTML. Preview supports both HTML and Markdown (auto-detected).
  - Image upload button currently inserts an Object URL for instant preview. Replace the `handleImageUpload` adapter in `src/lib/tiptap-utils.ts` to connect a real upload backend or `/public/images/uploads`.
  - If you update Tiptap UI Components from upstream, re-run the CLI in `Portfolio_EditSystem_Proto` and reconcile diffs, or vendor the changed files manually.

  
