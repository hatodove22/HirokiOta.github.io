# EditMode: Proto への移行ノート（2025-09-29）

本リポジトリの編集UIを `Portfolio_EditSystem_Proto`（/edit）へ統一します。Decap CMS のプレビュー連携は廃止し、必要に応じて /admin を認証・メディア運用の補助に限定します。

主な変更点
- 一次情報の統一: スキーマは `src/lib/types.ts` に集約（News/Project/Paper）。
- プレビュー: Proto 内でライブ反映（JA/EN切替・警告表示は共通UI）。
- 保存/出力: JSON 生成は Proto 由来を一次ソースとし、Vite ビルド（Issue 12）で配信物に同梱。
- CI: JSON生成→ビルド→型/Lint→Lighthouse の直列に更新（Decap前提のE2Eは任意）。

Issue 影響一覧
- 01–04: 履歴として完了扱い。運用は Proto 前提に読み替え。
- 05–09: 型定義/フォーム仕様/JSON整合を Proto 前提で再定義（Decapのwidget要件は参考）。
- 10: BibTeXは Proto の保存形式に合わせて入出力。
- 11–12: JSON生成とビルド統合は Proto 由来に変更。
- 13: CIは Proto 由来の生成物を基準に更新。
- 14–15: バリデーション/言語切替は Proto UI の共通実装として提供。

