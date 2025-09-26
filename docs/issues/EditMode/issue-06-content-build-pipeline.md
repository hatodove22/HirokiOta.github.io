# Issue: MarkdownコンテンツのJSON生成パイプライン実装

## 背景
サイト本体はVite + Reactで構築されており、`content/**.md`からJSONを生成するスクリプトが必要。EditMode仕様では`gray-matter`と`zod`でfrontmatterを検証し、`public/api/*.json`に書き出すことが求められている。

## スコープ
- `scripts/build-content.mjs` の新規作成：`fast-glob`でファイル列挙、`gray-matter`で解析、`zod`で検証、整形してJSON出力
- スキーマ定義（ニュース/プロジェクト/論文）と多言語フィールドの正規化実装
- ローカル開発用に `npm run build:content` スクリプトを追加し、Viteビルド前に実行
- エラー時の挙動（バリデーション失敗でプロセス終了、警告ログなど）を整備

## 完了条件
- ローカルで `npm run build:content` を実行すると `public/api/news.json` 等が生成される
- スキーマに違反したfrontmatterが存在すると処理が失敗し、エラー内容が確認できる
- Viteビルドフローにコンテンツ生成が組み込まれている

## 依存/備考
- Issue #03〜#05で定義されたfrontmatter構造に準拠する
- CI統合はIssue #07で扱う
