# 理想フォルダ構成提案（更新者目線／2025-11-05案）

## 基本方針
- クライアント（非開発者）が扱う領域と、開発者専用領域を明確に区分する。
- 既存の `content/` 構成は変更せず、周辺ドキュメントと補助ファイルを整える。
- README やマニュアルに更新手順・命名規則・検証フローを埋め込み、「どこを編集すれば良いか」を 3 ステップ以内で把握できるようにする。

## ルート直下の構成（理想）
| パス | 役割 | 更新者が触る頻度 | メモ |
| --- | --- | --- | --- |
| `content/` | 公開コンテンツ（JSON／Markdown／画像など） | ★★★ | 現状の構成を維持。各カテゴリに README を置き、更新手順・テンプレート・命名規則・AI 利用時の注意を記載する。 |
| `docs/` | ドキュメントの集約場所 | ★★☆ | `docs/manuals/` を新設して更新者向け HowTo を集約。`docs/refactoring/` にはメンテナンス記録を格納し、冒頭に「更新者は編集不要」と注意書きを入れる。 |
| `src/` | フロントエンドソースコード | ★☆☆ | 更新者は通常編集不要。`src/README.md` を追加し、ページや主要コンポーネントの役割・読み込む `content/` パス・i18n の挙動を簡潔に説明する。 |
| `public/` | そのまま配信される静的ファイル | ★☆☆ | `public/README.md` を追加し、変更が想定されるファイル（例: `robots.txt`, `manifest.json`）と注意事項を一覧化。フォーム設定や OGP 画像などの差し替え手順も併記する。 |
| ~~`private_docs/`~~ | （削除予定） | 0 | バックアップ・調査用資料は別リポジトリまたはクラウドストレージへ移管予定。削除前に必要ファイルを整理し、移行先を `cleanup-log.md` に記録する。 |
| ~~`Portfolio_EditSystem_Proto/`~~ | （削除予定） | 0 | 編集モード試作コードは役割を棚卸しし、必要であれば独立したリポジトリへ移行。現行サイトと重複している部分は統合し、本リポジトリからは削除する。 |

> ※ `private_docs/` と `Portfolio_EditSystem_Proto/` はルート直下から削除する方針。移行手順・削除判断は `docs/refactoring/cleanup-log.md` に追記して管理する。

## `docs/` 配下の整理案
- `docs/manuals/` … 更新者向け手順書（例: `news-update.md`, `project-update.md`）。コンテンツ更新のチェックリスト、プレビュー確認方法、AI ツールとの連携手順を集約。
- `docs/refactoring/` … メンテナンス記録（`cleanup-procedure.md`, `cleanup-log.md`, `as-is-structure.md` など）。更新者が誤って編集しないよう、冒頭に注意書きを追記する。
- `docs/PLAN.md` / `docs/TODO.md` … 現行運用を維持しつつ、該当タスクから `docs/manuals/` や `content/` の README へリンクして迷いを防ぐ。

## `src/` 配下のガイドライン
- `src/pages/` … 各ページファイルにコメント、または `src/README.md` からリンクする形で「参照する `content/` パス」「i18n 対応状況」「プレビュー時の注意点」を提示。
- `src/components/` … UI コンポーネント群。README で「通常は編集不要」であることを明示し、更新者が触る必要がないことを伝える。
- `src/lib/` … 型定義・データ取得・i18n 定義など。`src/lib/README.md` を追加し、データ定義の参照先や更新時の影響範囲をまとめる。

## `public/` 配下
- 直接配信される静的ファイル（フォーム設定、OGP 画像など）。`public/README.md` に差し替え手順・注意事項・検証方法を記載。
- `public/admin/` など CMS 関連ファイルには、運用方針（例: 「Decap CMS は認証・メディアライブラリ用途のみ」）を README で説明しておく。

## 発生する主な移行タスク
1. `docs/manuals/` の新設と既存マニュアルの移動（例: 現在 `マニュアル/` にあるファイルを移行し、リンクを更新）。
2. `private_docs/` と `Portfolio_EditSystem_Proto/` の棚卸し・移行計画の立案（不要ファイル削除、必要データは移行先へコピー）。`cleanup-log.md` にログを残しながら安全に削除する。
3. `public/README.md`, `src/README.md`, 各 `content/.../README.md` の整備による運用ガイダンスの明文化。

## 運用メモ
- 各 README／マニュアルには、更新時に実施すべき動作確認（`npm run build`, chrome-devtools MCP での確認など）とログの残し方をセットで記載する。
- 追加で `docs/manuals/update-checklist.md` のような横断チェックリストを用意し、タスク完了時に `docs/TODO.md` へリンクする運用を想定。
- 大規模整理の進行中は `cleanup-log.md` に日付・対象・判断理由・復旧手段を追記し、更新者も参照できる透明性を担保する。
