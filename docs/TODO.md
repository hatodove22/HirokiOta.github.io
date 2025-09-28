# TODO — 博士課程学生ポートフォリオ V1

短期の実行タスクを集約します。セッションをまたいでもここを見れば続きが分かる状態を維持します。

## Now（着手中）
- [ ] Edit Mode: 多言語プレビューの言語トグルを固定し、URL/状態同期（`/docs/issues/EditMode/issue-15-preview-language-toggle.md`）。
- [ ] Decap CMS: プレビュー用テンプレートの差分吸収（`public/admin/preview.js` と UI コンポーネントの Props 整合）。
  - 2025-09-28 17:00 build OK。`/admin` のGitHubログインボタン→`/edit` へバイパス、`/edit` は Proto UI を iframe 表示。

## Next（次にやる）
- [ ] 認証設計に沿った編集可否の制御（`docs/AuthDesign.md`）を各ページに適用。
- [ ] コンテンツスキーマの最小合意（Projects/Papers/News）を `src/lib/types.ts` と Decap 設定（`public/admin/config.yml`）で揃える。
- [ ] i18n 文言の直書き撲滅（`src/lib/i18n.ts` 経由に統一）。

## Backlog（後でやる）
- [ ] Notion 連携のオン/オフをビルド時フラグ化（`src/lib/notion.ts` のモック/本番切替）。
- [ ] CI: 型チェックとビルド検証を GitHub Actions で自動化。
- [ ] Lighthouse ベースラインの取得と主要回帰の監視。

## Done（完了）
- [ ] （ここに完了したタスクを移動）

## メモ
- タスクを追加/完了したら、本ファイルを更新し、必要に応じて `docs/PLAN.md` のマイルストーンも更新してください。

- [x] 2025-09-28 chrome-devtools代替(Puppeteer) smoke: /admin→/edit バイパスOK、Proto iframe描画OK、console fatalなし(※favicon 404除外)
- [x] 2025-09-28 sdd-steering 実施: /admin ログインUIの暫定仕様確定、次アクション(M4/M3/M5/CI)整理
