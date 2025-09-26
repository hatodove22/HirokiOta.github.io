# Issue: GitHub Actionsでのビルドとチェックの自動化

## 背景
ローカルビルドが整ったら、Pull Requestで自動的にJSON生成とビルド、Lint等のチェックを実行し、編集体験を継続的に担保する。

## スコープ
- GitHub Actionsワークフローを作成し、`npm ci`→JSON生成→`npm run build` の一連を実行
- BibTeX同期スクリプト（Issue 10）のチェックを組み込み、差分があればPRコメントやアーティファクトで通知
- mainブランチマージ時にPages等へのデプロイを行う場合は、そのトリガーを追加

## 完了条件
- PR作成時にActionsが走り、ビルド成功/失敗が確認できる
- BibTeXやJSON生成で問題があればPRで気づける

## 依存/備考
- Issue 10〜12で必要なスクリプトが整っていることが前提
- Secretsの設定手順はDocsに追記する
