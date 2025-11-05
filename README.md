# 博士課程学生ポートフォリオ V1

React + Vite で構築した博士課程学生向けのポートフォリオサイトです。

## 重要: プッシュ先リポジトリ（必ずこちらを使用）

このリポジトリの変更は、常に以下の GitHub リポジトリの `main` ブランチへプッシュしてください。

- リモート名: `ota`
- URL: `https://github.com/yamaokayuki20/ota_portfolio`
- プッシュ方法:
  - 初回設定（済の場合は不要）
    ```bash
    git remote add ota https://github.com/yamaokayuki20/ota_portfolio
    ```
  - 現在の作業ブランチの内容を `main` に反映（チェックアウト不要）
    ```bash
    git push ota HEAD:main
    ```
  - 以降も同様に、必ず `git push ota HEAD:main` を使用してください。

> 注意: `origin`（例: `hatodove22/HirokiOta.github.io`）にはプッシュしないでください。誤ってプッシュした場合は、`ota` の `main` を正とします。

## 技術スタック

- **フレームワーク**: React 18 + TypeScript
- **ビルドツール**: Vite 6
- **スタイリング**: Tailwind CSS
- **UIコンポーネント**: Radix UI + shadcn/ui
- **テーマ管理**: next-themes
- **国際化**: カスタム i18n システム

## 必要環境

- Node.js 18 以上
- npm 10 以上

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 開発サーバーの起動

```bash
npm run dev
```

開発サーバーは `http://localhost:3000/` で起動します。

## プロジェクト構造

```
ota_portfolio_v1/
├── src/                          # ソースコード
│   ├── components/              # React コンポーネント
│   │   ├── ui/                  # shadcn/ui コンポーネント
│   │   └── ...                  # その他のコンポーネント
│   ├── pages/                   # ページコンポーネント
│   ├── lib/                     # ユーティリティ関数
│   │   ├── content-loader.ts    # コンテンツ読み込みロジック
│   │   ├── i18n.ts              # 国際化設定
│   │   ├── types.ts             # TypeScript 型定義
│   │   └── ...                  # その他のユーティリティ
│   └── assets/                  # 静的アセット（画像、アイコンなど）
├── content/                     # コンテンツファイル（プロジェクト、論文、ニュース）
│   ├── projects/                # プロジェクトコンテンツ
│   │   └── project-{id}-{slug}/
│   │       ├── info/
│   │       │   └── metadata.json
│   │       ├── content/
│   │       │   ├── description_ja.md
│   │       │   └── description_en.md
│   │       ├── images/          # プロジェクト画像
│   │       └── assets/           # その他のアセット
│   ├── papers/                  # 論文コンテンツ
│   │   └── paper-{id}-{slug}/
│   │       ├── info/
│   │       │   └── metadata.json
│   │       └── pdfs/             # PDF ファイル（オプション）
│   └── news/                     # ニュースコンテンツ
│       └── news-{id}-{slug}/
│           ├── info/
│           │   └── metadata.json
│           └── content/
│               └── article.md
├── public/                       # 公開静的ファイル
│   └── content/                  # ビルド時にコンテンツをコピー
├── manuals/                      # 更新マニュアル
│   ├── projects-update.md       # プロジェクト更新マニュアル
│   ├── papers-update.md         # 論文更新マニュアル
│   ├── news-update.md           # ニュース更新マニュアル
│   └── about-update.md          # About ページ更新マニュアル
├── docs/                         # ドキュメント
├── scripts/                      # ビルドスクリプト
│   └── export-content.mjs        # コンテンツエクスポートスクリプト
└── AGENTS.md                     # AI向け作業ルール
```

## コンテンツ管理

このポートフォリオは、ファイルシステムベースのコンテンツ管理を採用しています。すべてのコンテンツ（プロジェクト、論文、ニュース）は `content/` ディレクトリ配下のファイルとして管理されます。

### コンテンツの追加・更新方法

各コンテンツタイプの詳細な更新方法は、`manuals/` ディレクトリ内のマニュアルを参照してください：

- [プロジェクト更新マニュアル](manuals/projects-update.md)
- [論文更新マニュアル](manuals/papers-update.md)
- [ニュース更新マニュアル](manuals/news-update.md)
- [About ページ更新マニュアル](manuals/about-update.md)

### コンテンツの読み込み

コンテンツは `src/lib/content-loader.ts` を通じて読み込まれます。ビルド時には `scripts/export-content.mjs` が実行され、`content/` ディレクトリの内容が `public/content/` にコピーされます。

## ビルドとデプロイ

### ビルド

```bash
npm run build
```

ビルド成果物は `dist/` ディレクトリに出力されます。

### ビルド前の自動処理

ビルド前に自動的に `scripts/export-content.mjs` が実行され、コンテンツファイルが `public/content/` にコピーされます。

### プレビュー

```bash
npm run preview
```

ビルド後のサイトをプレビューできます。

## 開発ガイドライン

### AI向けの作業ルール

このプロジェクトは AI が更新作業を行うことを前提としています。詳細な作業ルールは `AGENTS.md` を参照してください。

### コンテンツ更新時の注意事項

- **必須**: コンテンツを更新する前に、必ず `manuals/` ディレクトリ内の該当マニュアルを確認してください
- **AI向け**: ユーザーが用意すべき情報がすべて揃うまで、更新作業を開始しないでください（詳細は各マニュアルの「AI向け重大な注意書き」を参照）

### コードスタイル

- TypeScript の型定義は `src/lib/types.ts` に集約
- 国際化文字列は `src/lib/i18n.ts` で管理
- UI コンポーネントは `src/components/ui/` の shadcn/ui コンポーネントを優先的に使用

## 主要機能

### ページ構成

- **ホーム**: 最新プロジェクト、ニュース、論文の一覧
- **プロジェクト**: プロジェクト一覧と詳細ページ
- **論文**: 論文一覧とフィルタリング機能
- **ニュース**: ニュース一覧と詳細ページ
- **About**: プロフィール情報
- **お問い合わせ**: 連絡先情報

### 国際化（i18n）

- 日本語（`ja`）と英語（`en`）の2言語に対応
- 言語切替はヘッダーの言語スイッチャーから可能
- すべてのコンテンツは日英両方で提供されることを前提としています

### テーマ

- ライトモード / ダークモード / システム設定に応じた自動切替に対応
- テーマ切替はヘッダーのテーマスイッチャーから可能

## トラブルシューティング

### コンテンツが表示されない

1. `content/` ディレクトリにファイルが正しく配置されているか確認
2. `metadata.json` の形式が正しいか確認
3. 開発サーバーを再起動してみる

### ビルドエラー

1. `npm install` を実行して依存関係を再インストール
2. `node_modules` と `dist` を削除してから再ビルド
3. エラーメッセージを確認して、該当するファイルを修正

## ライセンス

このプロジェクトは個人のポートフォリオサイトです。

## 関連リンク

- [GitHub リポジトリ](https://github.com/yamaokayuki20/ota_portfolio)
