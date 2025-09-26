# Edit Mode 実装タスク分割

EditMode.mdで定義されたCMS機能を、より小さなイテレーションで進めるためのIssue一覧です。薄い縦切りで価値を確認しやすい順に並べています。

1. [Decap CMS管理画面の最小セットアップ](issue-01-decap-admin-shell.md)
2. [GitHub backend認証と手順ドキュメント整備](issue-02-decap-github-auth.md)
3. [メディアライブラリ用ディレクトリの初期化](issue-03-media-library-structure.md)
4. [共通編集レイアウトとプレビュー連携の土台](issue-04-shared-layout-preview-skeleton.md)
5. [ニュースコレクションのフィールド定義と最小バリデーション](issue-05-news-schema-baseline.md)
6. [ニュース記事プレビューのLive更新](issue-06-news-preview-live.md)
7. [プロジェクトコレクションのフィールドスキーマ](issue-07-projects-schema-baseline.md)
8. [プロジェクトと論文の関連参照モック連携](issue-08-projects-related-papers.md)
9. [論文コレクションのフィールドスキーマ](issue-09-papers-schema-baseline.md)
10. [BibTeX入出力フローの雛形](issue-10-bibtex-sync-shell.md)
11. [Markdown→JSON変換スクリプトのローカル実行](issue-11-content-json-export.md)
12. [JSON生成をViteビルドに統合](issue-12-build-integration.md)
13. [GitHub Actionsでのビルドとチェックの自動化](issue-13-ci-automation.md)
14. [多言語入力バリデーションの共通化](issue-14-multilingual-validation-core.md)
15. [プレビューの言語切替UIと警告表示](issue-15-preview-language-toggle.md)

これらを順次進めることで、ニュースのエンドツーエンドを早期に成立させ、その後プロジェクト・論文・ビルド/CI・多言語対応へと段階的に拡張する計画です。
