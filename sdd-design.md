# SDD Design — 2025-09-30 (UI JA pass)

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
