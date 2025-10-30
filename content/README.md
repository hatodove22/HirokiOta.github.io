# コンテンツ管理システム

このディレクトリは、ポートフォリオサイトのコンテンツを管理するための構造化されたフォルダシステムです。

## フォルダ構造

```
content/
├── projects/                    # プロジェクト
│   ├── project-1-*/            # 個別プロジェクト
│   │   ├── info/               # メタデータ
│   │   │   └── metadata.json   # プロジェクト情報
│   │   ├── images/             # 画像ファイル
│   │   ├── content/            # コンテンツ（Markdown）
│   │   └── assets/             # その他のアセット
│   └── ...
├── papers/                     # 論文
│   ├── paper-1-*/              # 個別論文
│   │   ├── info/               # メタデータ
│   │   │   └── metadata.json   # 論文情報
│   │   ├── pdfs/               # PDFファイル
│   │   ├── slides/             # プレゼンテーション
│   │   └── assets/             # その他のアセット
│   └── ...
├── news/                       # ニュース・ブログ
│   ├── news-1-*/               # 個別記事
│   │   ├── info/               # メタデータ
│   │   │   └── metadata.json   # 記事情報
│   │   ├── images/             # 画像ファイル
│   │   ├── content/            # コンテンツ（Markdown）
│   │   └── assets/             # その他のアセット
│   └── ...
└── about/                      # 私について
    ├── profile/                # プロフィール
    ├── education/              # 学歴
    ├── experience/             # 経験
    ├── skills/                 # スキル
    ├── achievements/           # 実績
    ├── images/                 # 画像ファイル
    └── documents/              # 文書
```

## 命名規則

### プロジェクト
- フォルダ名: `project-{ID}-{slug}`
- 例: `project-1-deep-learning-medical-image`

### 論文
- フォルダ名: `paper-{ID}-{slug}`
- 例: `paper-1-umotion`

### ニュース
- フォルダ名: `news-{ID}-{slug}`
- 例: `news-1-medical-ai-lab-notes`

## メタデータ形式

各コンテンツには `info/metadata.json` ファイルがあり、以下の情報を含みます：

- 基本情報（ID、タイトル、日付など）
- 多言語対応（日本語・英語）
- 関連情報（タグ、リンクなど）
- 公開設定

## 使用方法

1. 新しいコンテンツを追加する際は、適切なフォルダを作成
2. `info/metadata.json` にメタデータを記述
3. `content/` フォルダにMarkdownファイルでコンテンツを作成
4. 必要に応じて画像やアセットを追加

## 保守性の向上

- 各コンテンツが独立したフォルダに分離
- メタデータとコンテンツの分離
- 一貫した命名規則
- 明確なフォルダ構造

