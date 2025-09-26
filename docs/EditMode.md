# CMS詳細編集画面仕様（ニュース／プロジェクト／論文・多言語＆Bib対応）

本書は、Decap CMS（editorial workflow 前提）で「ニュース／プロジェクト／論文」をフルCRUD運用するための詳細編集画面仕様です。ホスティングは GitHub Pages、公開前は PR プレビューで確認→マージで公開する想定です。

---

# 全体アーキテクチャ案

```
編集UI（/admin, Decap CMS）
     │  GitHub App 認証（GitHub backend）
     ▼
GitHub リポジトリ（content/** と public/images/**）
     │  on: pull_request / push
     ├─ GitHub Actions A: コンテンツJSON生成 → Viteビルド → Pagesデプロイ
     ├─ GitHub Actions B: コンテンツCI（textlint / リンク / 画像最適化）
     └─ GitHub Actions C: Bibインポート/同期（citation-jsで生成・更新）
            ├ 新規論文 .md 生成（content/papers/）
            └ プロジェクトの related_papers 追記（必要時）
```

---

## 1) 管理UI（/admin）の実装

* Decap CMS v3 をそのまま利用（最小工数）。
  * backend は GitHub。ホスティングは GitHub Pages。
  * `publish_mode: editorial_workflow`（下書き→自分で確認→自己マージ）。
  * コレクション：`news`, `projects`, `papers`（frontmatter はここに記載の仕様）。
  * relation widget で `projects.related_papers` は「複数選択＋並び替え」。実装は `list` の中に `relation` を一段ネスト（D&D順序保持）。
* プレビュー：`CMS.registerPreviewTemplate()` で 3タイプのプレビューを登録（PC/モバイル幅切替）。
* 画像アップロード：Decap 標準 Image widget（保存先 `public/images/uploads/**`）。
  * クロップが不要なら追加ライブラリ無し。必要なら Cloudinary をバックアップ案に。

> 備考：一覧UIの見た目は Decap 既定を採用し、機能要件優先で最短実装。見た目の微修正は CSS 上書き程度に留める。

---

## 2) サイト本体（ビルド＆Pages）

* Jekyll は使わず、Vite + React の SPA を継続。
* `/content/**.md` をビルド時に走査し、frontmatter を検証・正規化して JSON を生成（`public/api/{news,projects,papers}.json`）。
  * 生成スクリプト例：`scripts/build-content.mjs`
  * 推奨ライブラリ：`gray-matter`, `fast-glob`, `zod`（スキーマバリデーション）, 必要に応じて `remark` 系
* クライアントは生成済み JSON を fetch（または静的 import）して描画。
* Pages デプロイは「JSON生成 → `vite build` → deploy」の順で実行。

---

## 3) 多言語（JA/EN/両方）

* 方式：1エントリ中に `publish: { ja, en }` と `title_ja/_en`, `summary_ja/_en`, `body(ja/en)` を保持。
* 一覧/詳細：公開フラグで出し分け。
* 保存時バリデーション：Decap の `pattern` ルール＋軽いカスタムバリデーションで「公開対象言語に必要な項目が未入力なら保存不可」。

---

## 4) 画像最適化・リンクチェック・文章品質（最小工数で）

* 画像最適化：`calibreapp/image-actions`（PRに噛ませるだけで jpg/png 圧縮・webp 生成を自動コミット）
* リンク切れ：`lycheeverse/lychee-action`（当初は warning 運用）
* テキスト：`textlint`（日本語向けプリセット）を CI で警告表示のみ

---

## 5) BibTeX（インポート／再インポート／エクスポート）

ポイント：UI側の作り込みを避け、GitHub Actions 側で自動生成・同期することで工数を最小化。

* 採用ライブラリ：
  * `citation-js`（BibTeX→JSON/JSON→BibTeX）
  * `slugify`（タイトル→slug 生成、衝突時は連番）
* 運用：
  1) 論文の新規作成（UI）
  * 論文画面に「BibTeXファイル（`.bib`/`.bibtex`/`bib.tex`）アップロード」フィールド（Decap の `file` widget）。
  * 保存（PR作成）で Actions C が起動。
  2) Actions C（Node.js）
  * PR 内の `.bib` を収集→`citation-js` で parse。
  * マッピング仕様に従って `content/papers/<slug>.md` を生成（`doi/citationKey` 重複チェック）。
  * 再インポート時は差分のみ上書き（訳題や JA 要約など人手項目は保持）。
  * `bib.tex` の生成は、論文詳細から実行→同ロジックで生成したテキストをダウンロード。
  3) プロジェクトから追加
  * プロジェクト編集画面にも「関連論文のBibアップロード」を配置（`file` widget）。
  * 新規論文を生成後、当該プロジェクトの `related_papers` に slug を自動追記（衝突回避の再試行付き）。

---

## 6) 具体的なWorkflow（Actions）最小セット

1. pages.yml（JSON生成 → Vite ビルド → Pages デプロイ）
   * Node セットアップ→依存インストール→`node scripts/build-content.mjs`→`vite build`→`actions/deploy-pages`。
2. content-ci.yml（品質チェック）
   * steps: `textlint` → `lychee-action`（リンク） → `calibreapp/image-actions`（画像）
   * すべて warning 運用から開始（慣れたら fail に格上げ）
3. bib-import.yml（PR内の `.bib` を検出して生成/更新）
   * Node 18 / `npm i citation-js slugify`
   * スクリプト：`find uploads/**/*.bib*` → parse → 既存 `content/papers/*.md` と付き合わせ（doi/citationKey）→ 新規/差分更新 → `related_papers` 追記 → `git add/commit/push`

---

## 7) 依存ライブラリ・Action（採用リスト）

* CMS/UI：Decap CMS v3（GitHub backend, editorial_workflow, relation/list widget, preview templates）
* ビルド：Vite + React（Jekyllは不使用）
* コンテンツ生成：`gray-matter`, `fast-glob`, `zod`（JSON生成・検証）
* BibTeX：`citation-js`（parse/generate）, `slugify`
* 画像：`calibreapp/image-actions`
* リンク：`lycheeverse/lychee-action`
* 文章：`textlint` + `textlint-rule-preset-ja-technical-writing`

---

## 8) ディレクトリと命名（決め打ち）

```
content/
  news/         # YYYY-MM-DD-<slug>.md
  projects/     # <project-slug>.md
  papers/       # <paper-slug>.md
public/
  images/
    uploads/    # Decap が置く（image widget）
  api/
    news.json
    projects.json
    papers.json
scripts/
  build-content.mjs   # コンテンツJSON生成
  bib-import.mjs      # Actions C で呼ぶ
.github/workflows/
  pages.yml
  content-ci.yml
  bib-import.yml
```

---

## 9) どこまで“次で”やるか（フェーズ分割）

* フェーズ1（最短で要件達成）
  * Decap 導入・コレクション定義・プレビュー
  * JSON 生成スクリプトの導入
  * Pages デプロイ
  * Actions CI（textlint/リンク/画像）
  * Bib インポート Action（新規/再インポート・PJ関連自動追記・`bib.tex` 生成）
* フェーズ2（余力）
  * Decap カスタムウィジェット（Bib貼り付け→即プレビュー、三点メニュー拡張）
  * 画像の自動OG生成・サムネ自動切り出し
  * 高速検索（Fuse.js）・軽量フィルタUI
  * Slack からの雑投下→`repository_dispatch`

---

## 目的（Why）

* 編集コストの最小化：ブラウザだけでニュース・プロジェクト・論文を迷わず作成／更新／削除できる。
* 多言語の確実運用：日本語／英語／日英両方をUIで明示管理し、言語ごとの必須項目とプレビューを担保。
* 安全な公開プロセス：PRプレビューで見た目とリンクを確認してから本番公開。ロールバック容易。
* 学術情報の一貫性：論文は BibTeX 駆動で作成・更新し、`bib.tex` ダウンロードを提供。重複を防ぎ整合性を保つ。
* 拡張しやすい設計：関連論文↔プロジェクトの相互参照、画像最適化、アクセシビリティ（alt）を標準化。
* ホスティングの単純化：GitHub Pages 前提で CI/CD を極力シンプルに。

---

## 主要ユーザーストーリー（Who / What / Why）

### A. 編集者（ニュース）

* US-A1（作成）
  * When: ニュースを新規作成するために編集画面を開く。
  * I want: タイトル・日付・本文・サムネイル・言語を最小入力し、右プレビューで確認して公開したい。
  * So that: トップの「最新ニュース」に即時反映できる。
  * AC: 公開言語必須が満たされないと保存不可／プレビューはPC・モバイル幅切替可。
* US-A2（更新）
  * When: 既存ニュースの誤字や画像を直す。
  * I want: 保存→PRプレビュー→公開まで一連の操作を1画面で完了したい。
  * AC: URL（slug）は既定ロック／必要時のみ変更＋リダイレクト提案。
* US-A3（削除）
  * When: 古いお知らせを非表示にしたい。
  * I want: `published:false` のソフト削除を選んで一覧から隠す。
  * AC: 公開中一覧から即非表示。完全削除は管理者のみ。

### B. 編集者（プロジェクト）

* US-B1（作成）
  * When: 新規プロジェクトを登録する。
  * I want: 概要・サムネイルとともに関連論文を既存検索で紐づけたい。
  * AC: 関連論文は複数選択・ドラッグで順序変更可。
* US-B2（論文の新規登録を同時に）
  * When: 未登録の関連論文がある。
  * I want: `.bib/bib.tex` をD&Dで投入→自動生成→このPJに自動紐づけしたい。
  * AC: `doi`/`citationKey` 重複チェックあり。生成後に論文編集へジャンプ可。
* US-B3（表示制御）
  * When: トップで推したい。
  * I want: featured をONにして「注目プロジェクト」に出したい。
  * AC: 公開後に即反映。

### C. 編集者（論文）

* US-C1（BibTeXで作成）
  * When: 論文を新規に登録する。
  * I want: BibTeX をアップロードしてフィールドを自動充填、必要なら訳題・要約だけ追記したい。
  * AC: authors/venue/doi などを正規化。重複は既存更新に誘導。
* US-C2（再インポートで同期）
  * When: DOI やPDFリンクが更新された。
  * I want: 新しい Bib を再インポートして差分だけ上書きしたい。
  * AC: 上書き対象をチェック式で選択。
* US-C3（配布）
  * When: 外部共有用の引用データが欲しい。
  * I want: いつでも最新の `bib.tex` をダウンロードしたい。
  * AC: 現在のフィールドから即生成。

### E. 管理者

* US-E1（ルール設定）
  * When: 品質と安全性を保ちたい。
  * I want: 画像のしきい値・alt必須・ブランチ保護（任意・自己マージ前提）を設定したい。
  * AC: 保存／PR時にバリデーションが走り、違反は警告 or ブロック。

---

## 0. 前提・共通方針

* レビュー体制：レビュアーは置かず、編集者がPRプレビューを確認して自己マージ（ブランチ保護ルールは任意）。
* 公開言語：日本語／英語／日英両方（内部：`publish: { ja: true|false, en: true|false }`）。
* URL安定：`slug` は原則ロック。変更時は旧→新のリダイレクト案内を出す。
* 削除：既定はソフト削除（`published:false`）。完全削除は管理者のみ。
* 画像：アップロード時に最適化（WebP・リサイズ）。公開言語ごとに `alt_ja / alt_en` を持つ。
* プレビュー：右ペインで JA/EN 切替、PC/モバイル幅切替あり。本番と同一コンポーネントを利用。

---

## 1. 共通 UI／操作（全タイプ共通）

### 1.1 ヘッダー（最小構成）
* 画面上部のヘッダーにはロゴのみ。Edit Mode トグル等は設置しない。

### 1.2 左サイドバー（ナビゲーション）
* セクション切替：ニュース／プロジェクト／論文／設定。
* 現在地は強調表示。サイドバーにフィルタや検索は置かない。

### 1.3 一覧テーブル（中央ペイン）
* フラットな行リスト。チェックボックスや一括操作は無し。
* 列（共通）：Title / Date / Status / Lang / 三点リーダー（Edit / Duplicate / Open preview / Delete）

### 1.4 個別編集（詳細ペイン）
* 2カラム：左＝フォーム、右＝ライブプレビュー（PC/モバイル/ライト・ダーク）。
* 画面最上部に「公開設定ドロワー」。
* 画面最下部左に「下書きを保存／公開／削除」。

### 1.5 公開設定ドロワー（個別編集時のみ）
* 公開状態：`Draft / Reviewing / Published`
* 公開言語：`日本語 / 英語 / 日英両方`（内部：`publish.ja/en`）
* 公開日：`date`（予約公開可）
* SEO（任意）：OG タイトル・OG 説明

### 1.6 本文タブ（言語別）
* JAタブ／ENタブ（公開対象言語のみ必須）。Markdown 入力、リンクチェッカー。

### 1.7 画像タブ（共通仕様）
* サムネイル（アップロード／D&D）。自動最適化（WebP化・複数解像度）、簡易クロップ（16:9 推奨）。
* `alt_ja / alt_en`：公開言語ごとに必須。
* OG 画像：未指定時はサムネイルを流用。

### 1.8 保存時バリデーション
* 公開言語で必須のフィールドが埋まっている。
* 画像サイズ・最小解像度・`alt` 入力チェック。
* `slug` 変更時はリダイレクト案内を表示。

---

## 2. ニュース：詳細編集画面
（省略：フィールド／操作は本文の通り）

## 3. プロジェクト：詳細編集画面
（省略：フィールド／関連論文／操作は本文の通り）

## 4. 論文：詳細編集画面（Bib駆動 + bib.tex 配布）
（省略：インポート／同期／基本情報／アブストラクト／メディア／関連PJ／エクスポート／操作は本文の通り）

---

## 5. 画面内ガード & ユースケース補助
* 言語必須の自動切替、重複防止（`doi` or `citationKey`）、画像品質ガード、非公開運用、プレビュー（JA/EN・PC/モバイル・テーマ切替）

---

## 6. 操作フロー例（ストーリー）
（省略：A/B/Cの各ストーリーは本文の通り）

---

## 7. frontmatter キー最小セット
（ニュース／プロジェクト／論文の YAML 例は本文の通り）

---

## 10) データ供給ワークフロー（詳細）

- 入力
  - `content/news/*.md`, `content/projects/*.md`, `content/papers/*.md`
  - 画像は `public/images/**`（Decap の image widget で配置）
- 生成（ローカル/CI 共通）
  - Node v18+ で `node scripts/build-content.mjs` を実行
  - 処理手順
    - `fast-glob` で `.md` を列挙
    - `gray-matter` で frontmatter/本文抽出
    - `zod` でfrontmatterを検証（必須/型/多言語フラグ）
    - 内部統一スキーマへマッピング（例）
      - News: `{ id, slug, date, pinned, tags, title: {ja,en}, summary:{ja,en}, body:{ja?,en?}, image, alt:{ja,en}, published, publish:{ja,en} }`
      - Project: `{ id, slug, status, featured, date, tags, title:{ja,en}, summary:{ja,en}, body:{ja?,en?}, image, alt:{ja,en}, related_papers:string[], published, publish:{ja,en} }`
      - Paper: `{ id, slug, title:{ja?,en}, authors:string[], venue, date, doi?, url?, arxiv?, pdf?, code?, tags, abstract:{ja?,en?}, image?, alt:{ja?,en?}, related_projects:string[], published, publish:{ja,en} }`
    - 言語フィルタリング（`publish.ja/en`に応じてUI側で出し分け）
    - `public/api/news.json`, `projects.json`, `papers.json` を書き出し
- 利用（フロント）
  - SPA から `fetch('/api/news.json')` 等で取得し描画
  - 将来的に `VITE_CONTENT_SOURCE=markdown` で切替可能な抽象化（任意）
- 失敗時の扱い
  - zod 検証エラーはCIで失敗（PR上で指摘）。ローカルは警告→ビルド中断でも可
  - 画像/リンクは別CI（content-ci.yml）で警告
- キャッシュ/更新
  - JSONはビルド成果物に含める。Pagesは各pushで更新
  - 必要ならJSONに `buildRevision`（コミットSHA）を付与

（備考）Notion 連携は未実装のため、本ワークフローで全量をカバー。

---

## 付記：GitHub App 認証（Decap GitHub backend）
* Decap の GitHub backend は、クライアントシークレットを安全に扱うため「認証エンドポイント」が必要です。完全にサーバレス無し（純静的）での GitHub App 認証はできません。
* 推奨：GitHub App を作成し、Pages とは別に Functions（Cloudflare Pages Functions / Vercel / Render など）で最小の OAuth エンドポイントを運用。
  * 共同編集者のみ許可：OAuth 後に GitHub API でコラボレータ権限（`push`以上）を検査し、許可ユーザにのみトークン発行。
  * ランニングコストは最小（無停止・管理軽微）。従来の常時稼働プロキシサーバは不要。
* 代替：Netlify/Cloudflare の Git Gateway/Identity を使えば独自エンドポイント構築を省略可能（ただし Pages 固定であれば上記 Functions 案が現実的）。
