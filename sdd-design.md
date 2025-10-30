# SDD Design - 2025-10-10 (News publish flow)\n\n## Context\n- The News editor publish button previously relied on opening the Vercel Functions popup to obtain an installation token, but authentication is now completed before entering Edit Mode (via ota_portfolio_auth).\n- The editor still needs to produce the same JSON payload (content/news/YYYY-MM-DD-slug.json) and create a PR automatically.\n- Installation tokens can reside in a global object, storage, or an authenticated endpoint; the UI must reuse them without asking the user to log in again.\n\n## Approach\n- Replace the popup/token exchange with a helper that resolves the installation token from the current session (global path, storage key, or optional fetch endpoint).\n- Keep slug generation (YYYY-MM-DD-<slug>) and the JSON payload identical, reusing the existing Tiptap -> Markdown conversion utilities.\n- Surface clear errors when the token is missing or expired so users can re-authenticate, instead of silently failing.\n- Expose configuration via Vite env vars (token global path, storage key, optional endpoint) to adapt to different deployments.\n\n## Acceptance\n- Pressing the publish button reuses the existing installation token, no popup opens, and a PR is created successfully.\n- Missing/expired tokens raise a descriptive error message; the UI remains interactive.\n- The generated file content/news/YYYY-MM-DD-slug.json contains the same schema and the toast still links to the PR.\n- Draft save behaviour remains a TODO while the publish flow works with the reused token.\n\n# SDD Design - 2025-10-10 (Preview markdown pipeline)

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




