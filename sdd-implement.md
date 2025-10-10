# SDD Implement - 2025-10-10 (Preview markdown pipeline)

## Task List
[x] Harden convert.ts MarkdownIt setup so generateJSON/generateHTML share one extension list.
[x] Update SimpleEditor to emit stringified Tiptap JSON and accept legacy markdown/JSON initial content.
[x] Render NewsPreview via Tiptap JSON -> generateHTML -> DOMPurify and drop legacy console logging.
[x] Refresh tests: converted simple-editor tests skipped pending jsdom pointer support; ran `npm test -- simple-editor`.

## Notes
- Existing convert utility tests cover round-trip behaviour; jsdom lacks pointer APIs so editor interaction tests remain skipped.
# SDD Implement  E2025-09-30 (UI JA pass)

## Task List
[x] Provide editor copy fallback via shared helper (i18n update pending upstream).
[x] Refactor `NewsEditor` to consume i18n copy and update JA placeholders.
[x] Adjust preview panel overflow/sticky handling.
[x] Verify translation usage and preview anchoring; log unresolved build issue if persists.

## Notes
- Keep Language toggle copy aligned with new translations.
- Preview panel overlay button already localized via `preview` copy.


