# Tiptap Simple Editor 導入メモ（2025-09-30）

本プロジェクトの詳細編集画面では、Tiptap UI Components の「Simple Editor」テンプレート（v3 系）をそのまま使用します。

## 構成
- テンプレート本体: `Portfolio_EditSystem_Proto/src/components/tiptap-templates/simple/simple-editor.tsx`
- グローバル SCSS（必須）: `src/styles/_variables.scss`, `src/styles/_keyframe-animations.scss`
  - `src/main.tsx` で import 済み
- 付随コンポーネント群
  - `src/components/tiptap-ui/*`, `tiptap-ui-primitive/*`, `tiptap-node/*`, `tiptap-icons/*`
  - import しやすいよう barrel を追加: `src/components/tiptap-templates/index.ts` ほか

## 依存（抜粋 / v3）
`@tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-{image,link,placeholder,text-align,highlight,color,typography,subscript,superscript}`

## 適用箇所
- `src/components/editors/NewsEditor.tsx` の JA/EN 本文（`<SimpleEditor />` を利用）
- プレビューは HTML/Markdown を自動判定して描画

## 画像アップロード
- ボタン/ドラッグ&ドロップ/貼り付け -> `src/lib/tiptap-utils.ts` の `handleImageUpload` を差し替え
- 暫定: Object URL 挿入（即時プレビュー）。本番: `/public/images/uploads` または API にアップロードし、URL へ差し替え

## アップデート方針
- 公式 CLI でテンプレートを再追加し、差分を確認の上ベンダリング更新
- 破壊的変更があるため、`tiptap` ブロックを feature ブランチで検証 → main へ PR

