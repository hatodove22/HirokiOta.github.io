# リポジトリ整理・クリーンアップ手順 v2025-11-05

## 目的
- クライアント引き渡し後も保守しやすいリポジトリ構成を維持する。
- 非開発者（AI アシスト前提）でも安全にコンテンツを更新できるよう、フォルダ構成とドキュメントを最適化する。
- 破壊的な操作を伴うため、必ずバックアップと検証を行い、判断は docs/ 配下にログとして残す。

## 全体フロー
1. タスク登録とバックアップ（docs/TODO.md と docs/PLAN.md を同期）
2. AS IS 把握（現状のファイル構成と利用状況を棚卸し）
3. TO BE 設計（理想のディレクトリ構成と更新導線を定義）
4. 未使用資産の棚卸し（削除候補の一次リスト化）
5. 段階的な削除とテストループ（削除 → テスト → レビュー → 記録）
6. TO BE に沿ったディレクトリ整理
7. ドキュメント整備と引き継ぎ

---

## フェーズ詳細

### フェーズ1: 事前準備（Day 0）
- docs/TODO.md に「Repo cleanup」タスクを追加し、完了条件・検証内容・chrome-devtools 確認の要否を明記する。
- docs/PLAN.md に同タスクの位置付け（マイルストーン・目標日）を追記する。
- `git status` で作業前の状態を確認し、未コミットの変更はコミットまたは `git stash` で退避する。
- `git branch backup-before-cleanup-YYYYMMDD-HHMM` で安全用ブランチを作成し、必要に応じてリモートへ push する。
- `npm run build`、`npm run test`、`npm run lint` を実行し、成功ログを docs/refactoring/cleanup-log.md に保存する。

### フェーズ2: AS IS 棚卸し
- `Get-ChildItem -Recurse` や `tree` でディレクトリ構成を出力し、docs/refactoring/as-is-structure.md に貼り付ける。
- 主要ディレクトリごとに「用途」「最終更新日」「責任者（不明なら空欄）」を表形式で整理する。
- `rg --files-without-match` などで未参照ファイルを洗い出し、`unused?`、`legacy`、`needs-review` などのラベルを付与して記録する。

### フェーズ3: TO BE 設計
- 想定されるクライアント作業（例: News の追加、Project 画像差し替え）を列挙し、各作業が 3 ステップ以内で完結する構成を提案する。
- content/ 配下の命名規則、メタデータ配置、アセット置き場、AI との連携ポイントを定義する。
- 設計内容を docs/refactoring/structure-proposal.md（1〜3 ページ）にまとめ、受け入れ条件（例: i18n 対応、差分テスト手順）を明文化する。

### フェーズ4: 未使用資産の棚卸し
- `rg`、TypeScript のインポートグラフ、Vite のビルドログを組み合わせ、未使用のコード・スタイル・アセットを抽出する。
- 候補を「即削除」「要確認」「保持」に分類し、発見経路・影響範囲・復旧方法を docs/refactoring/cleanup-log.md に追記する。

### フェーズ5: 段階的削除とテストループ
- 「即削除」カテゴリから着手し、削除 → `npm run test` → `npm run build` → `npm run lint` を 1 セットで実施する。
- UI/スタイルへ影響が出そうな場合は `npm run dev` を起動し、chrome-devtools MCP で以下を確認する:
  - 初期ロードが成功し、コンソールエラーがない。
  - 変更が視認でき、主要フロー（フィルタ、言語トグル等）が成立する。
  - docs/TODO.md の該当タスクに「YYYY-MM-DD dev OK/console clean」と記録する。
- ライブラリは「ライブラリ全体が完全に未使用」の場合のみ削除する。1 つでもコンポーネントが利用されていれば、ライブラリ一式は保持する（例: shadcn の未使用コンポーネントは削除対象にしない）。
- テストが失敗した場合は直ちにバックアップブランチから復旧し、原因と対応策を cleanup-log に残して次の候補に進む。

### フェーズ6: ディレクトリ整理
- TO BE で決定した構成に合わせてフォルダを移動・新設し、関連する import パス、ビルドスクリプト、`src/lib/i18n.ts` などを更新する。
- content 配下には簡潔な README を配置し、「どのファイルをどう編集すればよいか」を 3 ステップ以内で説明する。
- 影響範囲が広い場合は PR を分割し、`git mv` を使って履歴を保持する。

### フェーズ7: ドキュメント整備と引き継ぎ
- docs/TODO.md のタスクを完了させ、実施日・検証結果・chrome-devtools の所見を追記する。
- docs/PLAN.md に成果（例: M0 cleanup 完了）とフォローアップ事項を記録する。
- 本ドキュメント（cleanup-procedure.md）に実行日、削除したファイル一覧、テストで判明した注意点を追記する。
- クライアント向け運用ガイド（例: docs/content-updates/news.md）を整備し、更新手順・AI ワークフロー・既知の注意点を共有する。

---

## 成果物・必須ログ
- docs/refactoring/as-is-structure.md（AS IS スナップショット）
- docs/refactoring/structure-proposal.md（TO BE 設計）
- docs/refactoring/cleanup-log.md（削除と検証の記録）
- chrome-devtools MCP の確認ログ（docs/TODO.md から参照できる形で）
- 各コンテンツカテゴリ用の README / HOWTO（クライアント向け手順）

---

## 最終チェックリスト
- [ ] バックアップブランチを作成し、必要なら push 済み。
- [ ] `npm run test` / `npm run build` / `npm run lint` が成功。
- [ ] chrome-devtools MCP での検証結果を記録済み。
- [ ] cleanup-log.md に削除ファイル一覧と復旧方法を記載済み。
- [ ] クライアント向けドキュメントを最新化済み。

---

## cleanup-log.md 記入テンプレート
```
## YYYY-MM-DD 作業メモ
- 対象: content/news/old-draft/*
- 判定: unused -> 削除
- 検証: npm run test / build / lint OK、chrome-devtools OK（News 一覧 / 詳細）
- 備考: backup-before-cleanup-YYYY... から復旧可
```

---

## 参考コマンド集
```bash
# AS IS 構造の出力（PowerShell）
Get-ChildItem -Recurse | Select-Object FullName, LastWriteTime | Export-Csv docs/refactoring/as-is.csv -NoTypeInformation

# 未参照 TS/TSX/SCSS ファイルの特定
rg --files -g'*.tsx' -g'*.ts' -g'*.scss' | xargs -I{} powershell -Command "if((rg (Split-Path -Leaf {}) src -l).Length -eq 0){Write-Output {}}"

# 画像の利用状況チェック
rg -g'*.png' -g'*.jpg' -l '37d3f31165fb6b41b77513c4d8e0d1b581053602.png'

# 削除ファイルのステージングと検証
git rm path/to/file
npm run test && npm run build && npm run lint
```