# Edit Mode 実装タスク一覧

EditMode.md で定義された CMS 機能を小さなイテレーションで進めるための Issue 一覧です。薄い単位で価値を確認しながら積み上げていく順番を整理しています。

1. [完了] [Decap CMS 管理画面の最小セットアップ](issue-01-decap-admin-shell.md)
2. [完了] [GitHub backend 認証と手順ドキュメント整備](issue-02-decap-github-auth.md)
3. [完了] [メディアライブラリ用ディレクトリの初期化](issue-03-media-library-structure.md)
4. [完了] [共通編集レイアウトとプレビュー連携の土台](issue-04-shared-layout-preview-skeleton.md)
5. [完了] [ニュースコレクションのフィールド定義と最小バリデーション](issue-05-news-schema-baseline.md)
6. [ニュース記事プレビューの Live 更新](issue-06-news-preview-live.md)
7. [プロジェクトコレクションのフィールドスキーマ](issue-07-projects-schema-baseline.md)
8. [プロジェクトと論文の関連参照モック連携](issue-08-projects-related-papers.md)
9. [論文コレクションのフィールドスキーマ](issue-09-papers-schema-baseline.md)
10. [BibTeX 入出力フローの雛形](issue-10-bibtex-sync-shell.md)
11. [Markdown→JSON 変換スクリプトのローカル実行](issue-11-content-json-export.md)
12. [JSON 生成を Vite ビルドに統合](issue-12-build-integration.md)
13. [GitHub Actions でのビルドとチェックの自動化](issue-13-ci-automation.md)
14. [多言語入力バリデーションの共通化](issue-14-multilingual-validation-core.md)
15. [プレビューの言語切替 UI と警告表示](issue-15-preview-language-toggle.md)

これらを順に進めることで、まずニュースのエンドツーエンドを成立させ、その後にプロジェクト・論文・ビルド/CI・多言語対応へと段階的に拡張する計画です。

## デザイン参考

編集画面開発時は `docs/images/edit-mode/` に保存した以下のモック画面を常に参照してください。

- `edit-mode-dashboard.png` …… 編集ダッシュボード全体のレイアウト
- `edit-mode-news-list.png` …… ニュース管理一覧のテーブル構成
- `edit-mode-editor.png` …… 記事編集フォーム（サムネイル、言語切替、本文入力など）

新しい画面を実装・レビューするときは、上記モックとの整合性を意識し、差異が必要な場合はここに追記してチームに共有してください。
\n### 参考ドキュメント\n- [GitHub backend セットアップ](../../admin/github-backend-setup.md)\n- [メディアライブラリ運用ガイド](../../admin/media-library.md)\n
