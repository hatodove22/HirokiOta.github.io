# TODO - 博士課程学生ポートフォリオ V1

短期の実行タスクを集約します。セッションをまたいでもここを見れば続きが分かる状態を維持します。

## Now（現在）
- [x] MCP: GitHub サーバー導入（@missionsquad/mcp-github + .codex 設定）
  - 2025-10-10 PAT: env GITHUB_PAT 設定済み（codex MCP 経由）
- [ ] Refactor audit: risk/impact matrix (2025-10-10 Codex調査開始)
- [ ] Edit Mode: プレビュー言語トグルの表示確認（docs/issues/EditMode/issue-15-preview-language-toggle.md）
- [ ] Edit Mode: Markdown プレビュー整備（markdown-it -> generateJSON -> generateHTML -> DOMPurify Plan B）
  - 2025-10-10: Tailwind Typography / .prose の導入検討（tiptap-markdown + markdown-it）
- [ ] Decap CMS: プレビュー用テンプレート props 整理（public/admin/preview.js）
  - 2025-09-28 17:00 build OK。/admin で iframe 表示を確認済み。
- [x] Edit Mode: 公開ボタン→GitHub PR フロー（既存トークン再利用）
  - 2025-10-10 chrome-devtools: 未実行（dev server 未起動のため要フォローアップ）
## Next（次にやる）
- [ ] 認証設計に沿った編集可否の制御（docs/AuthDesign.md）を各ページに適用。
- [ ] コンテンツスキーマの最小合意（Projects/Papers/News）を src/lib/types.ts と Decap 設定（public/admin/config.yml）で揃える。
- [ ] i18n 文言の直書き撲滅（src/lib/i18n.ts 経由に統一）。

## Backlog（後でやる）
- [ ] Notion 連携のオン/オフをビルド時フラグ化（src/lib/notion.ts のモック/本番切替）。
- [ ] CI: 型チェックとビルド検証を GitHub Actions で自動化。
- [ ] Lighthouse ベースラインの取得と主要回帰の監視。

## Done（完了）
- [ ] （ここに完了したタスクを移動）

## メモ
- [x] 2025-09-28 MCP smoke: chrome-devtools-mcp 起動・接続ログ確認（headless/isolated）。GitHub MCP エンドポイント疎通OK（401＝トークン未付与を確認）。
- [ ] 2025-09-28 MCP 認証トークンの外部化: .codex/config.toml の GitHub トークンを環境変数へ移行（セキュリティ）。
- タスクを追加/完了したら、本ファイルを更新し、必要に応じて docs/PLAN.md のマイルストーンも更新してください。

- [x] 2025-09-28 chrome-devtools代替(Puppeteer) smoke: /admin→/edit バイパスOK、Proto iframe描画OK、console fatalなし(※favicon 404除外)
- [x] 2025-09-28 sdd-steering 実施: /admin ログインUIの暫定仕様確定、次アクション(M4/M3/M5/CI)整理
## 方針メモ（2025-09-29 / Proto移行）
- 編集UIを Portfolio_EditSystem_Proto に統一。Decapプレビュー連携は廃止（/admin は任意運用）。
- 型の一次情報を src/lib/types.ts に統一し、Protoのフォーム/プレビューと同期。
- JSON生成（Issue 11）とビルド統合（Issue 12）を Proto 由来に差し替え。
## 進捗（2025-09-29）
- [x] Issue05: NewsDraft 型・共通スキーマを src/lib/types.ts に追加。
- [x] Issue06: 編集画面に共通バリデーションを適用し、ライブプレビュー連携を確認。

- [x] Edit Mode: 公開ボタン→GitHub PR フロー（既存トークン再利用）
  - 2025-10-10 chrome-devtools: 未実行（dev server 未起動のため要フォローアップ）


