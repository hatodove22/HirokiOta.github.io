# Issue: GitHub Actionsによるビルド・品質チェック・Bib同期の統合

## 背景
EditMode仕様では3種類のGitHub Actions（Pagesデプロイ、コンテンツCI、Bibインポート）が必要。ローカルで用意したスクリプトと設定をCIに組み込み、PRベースのワークフローを確立する。

## スコープ
- `pages.yml` を作成し、`npm ci`→`npm run build:content`→`npm run build`→`actions/deploy-pages`の流れを実装
- `content-ci.yml` を作成し、`textlint`・`lycheeverse/lychee-action`・`calibreapp/image-actions` を警告モードで実行
- `bib-import.yml` を作成し、PR内の`.bib`ファイルを検出→Nodeスクリプトで処理→`git commit`まで自動化
- Actions利用方法とSecrets設定手順をドキュメント化

## 完了条件
- GitHub Actionsの定義ファイルが `.github/workflows/` に配置されている
- ローカルで`act`等を用いた試験、または手動テスト手順が用意されている
- READMEまたはdocsにCI構成とトラブルシューティングがまとめられている

## 依存/備考
- Issue #06でコンテンツビルドスクリプトが完成している必要がある
- Secrets設定は本番リポジトリで行うため、ダミー値・説明文で対応
