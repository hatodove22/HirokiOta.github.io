# Edit Mode 実装タスク分割

EditMode.mdで定義されたCMS機能を段階的に開発するためのIssue一覧です。各IssueはGitHub上で個別に起票することを想定しており、依存関係を考慮した順序で並べています。

1. [Decap CMS基盤とGitHub連携の初期実装](issue-01-decap-cms-foundation.md)
2. [共通編集UIコンポーネントとライブプレビュー土台の構築](issue-02-shared-editing-ui.md)
3. [ニュース編集フォームとプレビュー実装](issue-03-news-collection.md)
4. [プロジェクト編集フォームと関連論文リレーション](issue-04-projects-collection.md)
5. [論文編集フォームとBibTeX同期フローの実装](issue-05-papers-bibtex.md)
6. [MarkdownコンテンツのJSON生成パイプライン実装](issue-06-content-build-pipeline.md)
7. [GitHub Actionsによるビルド・品質チェック・Bib同期の統合](issue-07-ci-automation.md)
8. [多言語入力バリデーションとプレビュー切替の強化](issue-08-multilingual-validation.md)

上記を順次進めることで、編集UI・ビルドパイプライン・CIまでを段階的に完成させる計画です。
