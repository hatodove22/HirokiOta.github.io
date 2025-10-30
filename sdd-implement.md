# SDD Implement - 2025-10-10 (News publish flow)\n\n## Task List\n[x] Replace the popup-based authentication flow with a token resolver helper (global path / storage / endpoint) and update github-publish.ts accordingly.\n[x] Update NewsEditor to await the async save result, guard against double submissions, and surface errors when publish fails.\n[x] Update NewsSection to call the new publish helper and keep drafts as a TODO with a temporary toast message.\n[x] Refresh docs/TODO/PLAN/sdd-steering to reflect the new assumption that GitHub authentication completes before entering Edit Mode.\n\n## Notes\n- Tokens are pulled from session/global configuration; if no token is found the user is prompted to re-authenticate instead of opening a popup.\n- JSON payload/PR creation remains unchanged, so downstream consumers of content/news/*.json continue to work.\n- Draft save behaviour remains pending; only published items trigger GitHub operations.\n\n# SDD Implement - 2025-10-10 (Preview markdown pipeline)

## Task List
[x] Harden convert.ts MarkdownIt setup so generateJSON/generateHTML share one extension list.
[x] Update SimpleEditor to emit stringified Tiptap JSON and accept legacy markdown/JSON initial content.
[x] Render NewsPreview via Tiptap JSON -> generateHTML -> DOMPurify and drop legacy console logging.
[x] Refresh tests: converted simple-editor tests skipped pending jsdom pointer support; ran `npm test -- simple-editor`.

## Notes
- Existing convert utility tests cover round-trip behaviour; jsdom lacks pointer APIs so editor interaction tests remain skipped.
# SDD Implement 窶・2025-09-30 (UI JA pass)

## Task List
[x] Provide editor copy fallback via shared helper (i18n update pending upstream).
[x] Refactor `NewsEditor` to consume i18n copy and update JA placeholders.
[x] Adjust preview panel overflow/sticky handling.
[x] Verify translation usage and preview anchoring; log unresolved build issue if persists.

## Notes
- Keep Language toggle copy aligned with new translations.
- Preview panel overlay button already localized via `preview` copy.




