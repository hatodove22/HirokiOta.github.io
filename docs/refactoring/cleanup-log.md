# Cleanup Log

## 2025-11-05 フェーズ0準備
- 対象: バックアップ体制整備
- 判定: 着手 -> TODO/PLAN 更新とバックアップ計画の整備
- 検証: 事前フェーズのためテスト未実施（フェーズ1で build/test/lint を実施予定）
- 備考: backup-before-cleanup-20251105-1604 ブランチを作成し、ForHandsOff リモートへ push 済み（復旧ポイント）

## 2025-11-05 フェーズ0追加バックアップ
- 対象: バックアップ体制整備
- 判定: 追加バックアップ取得
- 検証: 変更内容は未テスト（フェーズ1でまとめて検証予定）
- 備考: backup-before-cleanup-20251105-1642 ブランチを作成し、ForHandsOff リモートへ push 済み（最新スナップショット）

## 2025-11-05 低影響ファイル削除
- 対象: tmp/, build/, dist/, api/, .sdd/ 以下、Lighthouse ログなど
- 判定: 不要な生成物・テンポラリの削除
- 検証: `npm run build` / `npm run test` 未実行（フェーズ1で実施予定）
- 備考: ForHandsOff リモートに `cleanup-low-impact-20251105` ブランチを push 済み（低影響削除のみを含む）

## 2025-11-05 中影響ファイル削除
- 対象: `.venv/`, `test-content-loader.js`, デバッグスクリプト類
- 判定: テスト・デバッグ用途のみの資産を削除
- 検証: `npm run build` / `npm run test` 未実行（次フェーズで実施）
- 備考: ForHandsOff リモートに `cleanup-medium-impact-20251105` ブランチを push 済み（中影響まで削除した状態）

## 2025-11-05 高影響ファイル削除
- 対象: `Portfolio_EditSystem_Proto/` 一式（編集モード試作コード）
- 判定: 本番リポジトリから切り離し -> 別リポジトリまたは履歴で保全
- 検証: 未（本番ビルド／テストは後続フェーズで実施予定）
- 備考: 高影響削除込みの検証ブランチ `cleanup/delete-validation` を運用中。必要に応じて ForHandsOff リモートへプッシュ予定。
## 2025-11-05 content-loader auto-scan
- Target: src/lib/content-loader.ts (papers & news loaders)
- Decision: switched to /__content/list/* responses and removed hard-coded folder arrays.
- Verification: npm run build OK / npm run test missing script -> not executed.
- Note: manuals/papers-update.md & manuals/news-update.md updated for auto discovery workflow.
- Action: Added test folder `content/news/news-99-autoscan-test` and verified build output.
- Fix: Updated loadNews slug/link generation so auto-scanned folders appear in listings.
