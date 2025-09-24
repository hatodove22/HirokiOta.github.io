# 博士課程学生ポートフォリオ V1

React + Vite で構築した博士課程学生向けのポートフォリオサイトです。デザインは以下の Figma から確認できます。

- [Figma デザイン](https://www.figma.com/design/q96wxyH2JhBsvZj0gPyVxD/%E5%8D%9A%E5%A3%AB%E8%AA%B2%E7%A8%8B%E5%AD%A6%E7%94%9F%E3%83%9D%E3%83%BC%E3%83%88%E3%83%95%E3%82%A9%E3%83%AA%E3%82%AA-V1)

## 必要環境

- Node.js 18 以上
- npm 10 以上

## セットアップと開発サーバーの起動

```bash
npm install
npm run dev
```

Vite の開発サーバーは `http://localhost:3000/` で自動的にブラウザーが起動します。

## ビルド

```bash
npm run build
```

ビルド成果物は `build/` ディレクトリに出力されます（Git には含めません）。

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
