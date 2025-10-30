# 博士課程学生ポートフォリオ V1

React + Vite で構築した博士課程学生向けのポートフォリオサイトです。デザインは以下の Figma から確認できます。

- [Figma デザイン](https://www.figma.com/design/q96wxyH2JhBsvZj0gPyVxD/%E5%8D%9A%E5%A3%AB%E8%AA%B2%E7%A8%8B%E5%AD%A6%E7%94%9F%E3%83%9D%E3%83%BC%E3%83%88%E3%83%95%E3%82%A9%E3%83%AA%E3%82%AA-V1)

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

## 必要環境

- Node.js 18 以上
- npm 10 以上

## プロジェクト構造

```
ota_portfolio_v1/
├── src/                          # ポートフォリオ本体のソースコード
├── Portfolio_EditSystem_Proto/   # 編集システム（独立したプロジェクト）
│   ├── src/                      # 編集システムのソースコード
│   ├── package.json              # 編集システムの依存関係
│   └── vite.config.ts            # 編集システムのVite設定
├── public/                       # 静的ファイル
├── docs/                         # ドキュメント
└── README.md                     # このファイル
```

- **ポートフォリオ本体**: メインのポートフォリオサイト（ポート3000）
- **編集システム**: コンテンツ編集用の独立したアプリケーション（ポート5174）

## セットアップと開発サーバーの起動

### ポートフォリオ本体の起動

```bash
npm install
npm run dev
```

Vite の開発サーバーは `http://localhost:3000/` で自動的にブラウザーが起動します。

### 編集システムの起動

編集システムは別のディレクトリに配置されており、独立して起動できます。

```bash
# 編集システムディレクトリに移動
cd Portfolio_EditSystem_Proto

# 依存関係のインストール（初回のみ）
npm install

# 開発サーバーの起動
npm run dev
```

編集システムの開発サーバーは `http://localhost:5174/` で起動します。

#### 編集システムの特徴

- **Tiptap Editor**: リッチテキストエディタを使用したコンテンツ編集
- **リアルタイムプレビュー**: 編集内容が即座にプレビューに反映
- **マークダウン対応**: 見出し、リスト、太字、斜体、コードブロックなどのマークダウン要素をサポート
- **HTMLレンダリング**: エディタの内容をHTMLとして表示

## ビルド

### ポートフォリオ本体のビルド

```bash
npm run build
```

ビルド成果物は `build/` ディレクトリに出力されます（Git には含めません）。

### 編集システムのビルド

```bash
# 編集システムディレクトリに移動
cd Portfolio_EditSystem_Proto

# ビルド実行
npm run build
```

編集システムのビルド成果物は `Portfolio_EditSystem_Proto/build/` ディレクトリに出力されます。

## 開発時の注意事項

### 同時起動について

ポートフォリオ本体と編集システムは独立したプロジェクトのため、同時に起動できます：

1. **ターミナル1**: ポートフォリオ本体の起動
   ```bash
   npm run dev
   # http://localhost:3000/ でアクセス
   ```

2. **ターミナル2**: 編集システムの起動
   ```bash
   cd Portfolio_EditSystem_Proto
   npm run dev
   # http://localhost:5174/ でアクセス
   ```

### 編集システムの利用方法

1. 編集システムにアクセス: `http://localhost:5174/`
2. ニュース編集画面でコンテンツを作成・編集
3. エディタで入力した内容がリアルタイムでプレビューに反映
4. 編集完了後、コンテンツをポートフォリオ本体に反映

## プロジェクトを新規追加する手順

Notion 連携が未設定の場合はローカルのモックデータを編集することで新規プロジェクトを追加できます。Notion を利用する場合も、以下の手順で必要な情報を整理してください。

### 1. 事前に情報を整理する

1. 以下の項目を日英それぞれで準備します。
   - プロジェクト名（`title`）と短い概要（`summary`）
   - 公開日（`date`、`YYYY-MM-DD` 形式）とタグ（`tags` 配列）
   - リポジトリ・デモ・スライドなどの URL（`repoUrl`、`demoUrl`、`slidesUrl`。不要な項目は省略可）
   - メインビジュアルの画像 URL（`heroImage`）
   - 関連する論文 ID（`relatedPapers`。該当が無い場合は空配列）
2. URL に利用する英数字のスラッグ（`slug`）を決め、既存プロジェクトと重複しないことを確認します。
3. トップページに固定表示したい場合は `isPinned` を `true` にします。

### 2. Notion を使わない場合（モックデータの更新）

1. `src/lib/notion.ts` を開き、`mockProjects` 配列に既存のオブジェクトを参考に新しい要素を追加します。
2. `language` プロパティは `'ja'` または `'en'` を設定します。日英両方で表示したい場合は、それぞれの言語でエントリーを追加してください。
3. `relatedPapers` で指定した ID が `mockPapers` に存在するかを確認し、必要に応じて論文データも更新します。
4. 変更後は `npm run dev` を実行し、ホーム画面・プロジェクト一覧・詳細ページで表示を確認します。

### 3. Notion を使う場合（データベースの準備）

1. `.env` などの環境変数に以下を設定し、Vite を再起動します。
   - `NOTION_TOKEN`
   - `NOTION_DB_PROJECTS`
   - `NOTION_DB_PAPERS`
   - `NOTION_DB_NEWS`
2. Notion 側の Projects データベースには、`Title`、`Status`、`Language`、`Date`、`Tags`、`Summary`、`Slug`、`Repo URL`、`Demo URL`、`Slides URL`、`Hero Image`、`Related Papers` などのプロパティを用意し、上記で整理した内容を登録します。
3. Notion を利用していても、ローカルでの開発中にデータが必要な場合は `mockProjects` に同じ内容を追加しておくと表示確認が容易です。

### 4. 動作確認のポイント

1. 開発サーバー上で新規カードが一覧と詳細に表示されるか確認します。
2. フィルター（タグ・年）で正しく絞り込めるか、関連リンクが開くかを確認します。
3. 問題が無ければ `npm run build` を実行し、ビルドが通ることを確かめてからリリースまたはコミットします。

これで新しいプロジェクトを安全に追加できます。

## 論文を新規追加する手順

論文データは `src/lib/notion.ts` 内の `mockPapers` 配列をソースとして画面に描画されます。Notion 連携を有効化している場合も、
同じ項目を用意しておくことで移行がスムーズです。

### 1. データ構造を把握する

- `Paper` 型は `src/lib/types.ts` に定義されています。`id` や `title` などの基本情報に加えて、`relatedProjects`（紐づくプロジェクト ID 配列）や `categories`（発表形態など）の必須プロパティがあります。
- `language` は `'ja' | 'en' | 'both'` のいずれかを設定します。`both` にすると日英どちらの言語モードでも一覧に表示されます。
- `categories` の各プロパティは次の候補から選びます：`scope` は `'国際' | '国内' | '学位論文'`、`type` は `'ジャーナル' | '会議' | 'ワークショップ'`、`peerReview` は `'査読付き' | '査読なし'`。論文ページのフィルタはこれらの文字列をそのまま表示します。

### 2. 追加内容を整理する

以下の情報を事前に整理しておくと入力がスムーズです。

1. 固有の `id`（プロジェクト側の `relatedPapers` から参照されるため重複不可）
2. 論文タイトル・著者・掲載先・発表年
3. DOI / arXiv / スライド / ポスターなどの関連リンク（存在するもののみ）
4. 受賞歴があれば `award` に文言を記載
5. 紐づくプロジェクト ID（`mockProjects` や Notion の Project データベースで利用している `id` と揃える）
6. 表示対象の言語とカテゴリ属性

著者名は自分の名前を `**太田裕紀**` のように `**` で囲むと、一覧表示で太字になります（`PaperListItem` コンポーネントが `**` を太字として解釈）。

### 3. Notion を使わない場合（モックデータの更新）

1. `src/lib/notion.ts` の `mockPapers` 配列に新しいオブジェクトを追加します。既存エントリ（`paper1` など）をコピーして、上記で整理した値に書き換えると安全です。
2. `relatedProjects` に設定した ID が `mockProjects` に存在するかを確認してください。プロジェクト詳細ページでは `relatedPapers` と突合して表示します。
3. 必要に応じて `mockProjects` 側の `relatedPapers` 配列に新しい論文 ID を追記し、相互リンクを構成します。これによりプロジェクト詳細ページの「関連論文」カードが表示されます。

### 4. Notion を使う場合（データベースの準備）

1. `.env` などに `NOTION_TOKEN` と `NOTION_DB_PAPERS` を設定し、Vite を再起動します。`notion.ts` の `isConfigured` が true になると Notion 連携が有効になります。
2. Notion 側の Papers データベースにも `Paper` 型の項目と同等のプロパティを作成し、値を登録します。ローカル開発で Notion が利用できない場合は `mockPapers` に同じデータを複製しておくと表示確認が容易です。

### 5. 表示確認

1. `npm run dev` を実行し、論文ページで新しい論文が一覧に載っているか、フィルタ（年／会議・ジャーナル／カテゴリ）で絞り込みができるかを確認します。
2. 紐づけたプロジェクト詳細ページに移動し、「関連論文」セクションにカードが表示されるかをチェックします。
3. 問題が無ければ `npm run build` を実行してビルドが成功することを確認してからコミットします。
