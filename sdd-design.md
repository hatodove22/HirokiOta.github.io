# SDD Design - 2025-10-10 (Preview markdown pipeline)

## Context
- Issue #19: Tiptap headings and lists do not appear in preview because markdown fallback bypasses generateJSON/generateHTML and MarkdownIt instance is unavailable during SSR/tests.
- Editor currently saves markdown strings only; preview relies on markdownToHTML fallback without DOMPurify sanitization parity.

## Approach
- Stabilize convert utilities so MarkdownIt instantiates on demand in any runtime and share the extension list used for generateJSON/generateHTML.
- When preview receives markdown strings, convert them through markdown -> html -> generateJSON, then reuse tiptapJSONToSanitizedHTML for rendering.
- Update SimpleEditor change handler to emit stringified Tiptap JSON while still accepting legacy markdown input.
- Add regression coverage that verifies headings, lists, and mixed content render through the JSON pipeline.

## Acceptance
- Typing a heading or list in the news editor preview shows semantic HTML (h1/h2/li) in both JA and EN tabs without raw markdown.
- Round-trip conversion tests confirm markdown -> JSON -> HTML preserves structure for headings, lists, quotes, and code blocks.
- DOMPurify sanitization remains in effect (dangerous attributes stripped) and legacy markdown data continues to render after automatic conversion.

# SDD Design - 2025-09-30 (UI JA pass)

## Context
- Editor UI reverted to English after prior refactor; need consistent JA labelling per AGENTS i18n rule.
- Preview panel still scrolls despite sticky attempt; likely parent overflow from resizable panel.

## Approach
- Provide editor copy via shared helper with fallbacks (to be upstreamed into `src/lib/i18n.ts`).
- Expose helper in `Portfolio_EditSystem_Proto/src/lib/preview-translations.ts` to provide editor copy.
- Refactor `NewsEditor` to source labels from i18n, update layout strings, and switch placeholders to JA.
- Override resizable panel overflow via `style={{ overflow: 'visible' }}` and wrap sticky block with `max-h` container to keep preview anchored.

## Acceptance
- All visible strings in news editor match Japanese copy (ステータス/タグ/保存など).
- Required badge reads `必須`; image controls and buttons localized.
- Preview column stays pinned while scrolling editor content.

