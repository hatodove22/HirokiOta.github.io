# 論文管理システム

このディレクトリは、研究論文の情報を管理するためのシンプルな構造です。

## フォルダ構造

```
papers/
├── paper-1-umotion/
│   └── metadata.json              # 論文の完全なメタデータ
├── paper-2-vibrotactile-feedback/
│   └── metadata.json
├── paper-3-medical-image-segmentation/
│   └── metadata.json
└── paper-4-transformer-document-classification/
    └── metadata.json
```

## メタデータ形式

各論文フォルダには `metadata.json` ファイルがあり、以下の情報を含みます：

### 基本情報
- `id`: 論文の一意識別子
- `title`: 論文タイトル
- `venue`: 発表会場・学会名
- `year`: 発表年
- `authors`: 著者リスト

### 分類情報
- `language`: 言語（ja/en/both）
- `categories`: 分類情報
  - `scope`: 国際/国内
  - `type`: 会議/ワークショップ/ジャーナル
  - `peerReview`: 査読付き/査読なし

### 関連情報
- `relatedProjects`: 関連プロジェクトのIDリスト
- `doi`: DOI
- `arxiv`: arXiv URL
- `slidesUrl`: スライドURL
- `award`: 受賞情報

### 学術情報
- `abstract`: 要約（日本語・英語）
- `keywords`: キーワード
- `status`: 公開状況
- `pageCount`: ページ数
- `citationCount`: 被引用数
- `impactFactor`: インパクトファクター

### 追加情報
- `pdfUrl`: PDF URL
- `posterUrl`: ポスターURL
- `codeUrl`: コードURL
- `videoUrl`: 動画URL
- `presentationDate`: 発表日
- `acceptanceDate`: 採択日
- `submissionDate`: 投稿日
- `notes`: 備考

## 使用方法

1. 新しい論文を追加する際は、`paper-{ID}-{slug}/` フォルダを作成
2. `metadata.json` に論文情報を記述
3. 必要に応じて関連ファイル（PDF、スライドなど）を同じフォルダに配置

## 利点

- **シンプル**: メタデータのみで管理が簡単
- **完全性**: 必要な情報をすべて含む
- **拡張性**: 新しいフィールドの追加が容易
- **検索性**: 構造化されたデータで検索・フィルタリングが可能

