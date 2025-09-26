# Issue: Decap CMS基盤とGitHub連携の初期実装

## 背景
EditMode.mdで定義された管理画面はDecap CMS v3を前提としている。まずは既存ポートフォリオリポジトリにDecap CMSの土台とGitHub backend認証の仕組みを組み込み、編集UIを開発できる環境を整備する必要がある。

## スコープ
- `/admin/index.html` と `config.yml` を新規作成し、ニュース/プロジェクト/論文のコレクションを仮配置
- `publish_mode: editorial_workflow`、GitHub backend設定、ドラフト→公開の一連のフローを有効化
- GitHub AppまたはFunctionsによるOAuthエンドポイントの素案とREADMEのセットアップ手順を整備
- 画像アップロードディレクトリ(`public/images/uploads/`)の初期構成と `.gitkeep` 配置

## 完了条件
- ローカル開発環境でDecap CMSが起動し、各コレクションの新規作成/編集/ドラフト保存が行える
- 認証フロー・必要な環境変数・GitHub App構築手順がREADMEまたは専用ドキュメントで確認できる
- 画像アップロード先のパスがDecap設定とプロジェクト構成で一致している

## 依存/備考
- 以降のIssueで詳細フォームやプレビューを実装する前提となるため、最優先で着手する
- 本Issueでは詳細なプレビューコンポーネントやバリデーションは対象外
