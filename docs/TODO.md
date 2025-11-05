# TODO - 博士課程学生ポートフォリオ V1

短期の実行タスクを集約します。セッションをまたいでもここを見れば続きが分かる状態を維持します。

## Now（現在）
- [x] MCP: GitHub サーバー導入（@missionsquad/mcp-github + .codex 設定）
  - 2025-10-10 PAT: env GITHUB_PAT 設定済み（codex MCP 経由）
- [ ] Refactor audit: risk/impact matrix (2025-10-10 Codex調査開始)
- [ ] Repo cleanup: cleanup-procedure.md を 2025-11-05 版に更新し、バックアップ→AS IS→TO BE→棚卸し→テスト→ドキュメント整備の流れを確定（docs/refactoring/cleanup-procedure.md）
- [ ] リポジトリ大掃除: 不要ファイル・フォルダの削除
  - 作業手順書: `docs/refactoring/cleanup-procedure.md`
  - 削除対象: `tmp/`, `build/`, `api/`, ルートの一時ファイル、誤作成フォルダ
  - 注意: 破壊的操作のため、バックアップ必須
- [ ] Edit Mode: プレビュー言語トグルの表示確認（docs/issues/EditMode/issue-15-preview-language-toggle.md）
- [ ] Edit Mode: Markdown プレビュー整備（markdown-it -> generateJSON -> generateHTML -> DOMPurify Plan B）
  - 2025-10-10: Tailwind Typography / .prose の導入検討（tiptap-markdown + markdown-it）
- [ ] Decap CMS: プレビュー用テンプレート props 整理（public/admin/preview.js）
  - 2025-09-28 17:00 build OK。/admin で iframe 表示を確認済み。
- [x] Edit Mode: 公開ボタン→GitHub PR フロー（既存トークン再利用）
  - 2025-10-10 chrome-devtools: 未実行（dev server 未起動のため要フォローアップ）
 - [x] Papers: 国内/国際の既存業績を10件追加（metadata.json）
   - 2025-10-30 追加完了（VR/VRW/CHI EA/AHs/IEICE/VR学会）。
 - [x] UI: プロジェクト詳細の戻るボタン文言を「戻る」に統一（2025-10-30）
 - [x] Contact: 住所とテスト用メールを更新（2025-10-30）
 - [x] Contact: フォーム削除＆メールコピーアイコン追加、本番メール適用（2025-10-30）
 - [x] Fix: ホーム画面の注目プロジェクトが英語表示で消える不具合を修正（2025-10-30）
   - getPinnedProjects から getProjects に変更し、日付順で最新4つを表示するように修正
   - プロジェクト一覧ページと同様に言語での除外は行わない
 - [x] i18n: 論文のカテゴリタグ（国際、会議、査読付きなど）を英語モードで翻訳（2025-10-30）
   - i18n.ts に論文カテゴリの翻訳を追加（scope/type/peerReview）
   - paper-list-item.tsx で翻訳済みの値を表示するように修正
 - [x] About: 英語表記の所属を正式名称に更新（2025-10-30）
   - 「Graduate School of Engineering, XX University」→「Nara Institute of Science and Technology, Cybernetics Reality Engineering Laboratory」に変更
 - [x] Projects: プロジェクト一覧ページの説明文を更新（2025-10-30）
   - 「機械学習、深層学習、コンピュータビジョンの研究プロジェクトをご紹介します。」→「主にハプティクス（触覚）、バーチャルリアリティなどに関するプロジェクトなどに取り組んでいます」に変更
 - [x] UI: ホーム画面の「私について」ボタンのスタイル修正（2025-10-30）
   - 背景透過、枠線・テキストをハイライトカラー（primary色）に変更
 - [x] UI: ホーム画面のSNSリンクアイコンにツールチップ追加（2025-10-30）
   - shadcnのTooltipコンポーネントを使用してホバー時にプラットフォーム名を表示
 - [x] UI: ツールチップのスタイル修正（2025-10-30）
   - shadcnのデフォルト構造に戻し、Tailwindクラスでスタイリング
   - ライト/ダークモード共に白背景・黒文字で表示
   - Arrow（三角形）が四角く表示される問題を修正（デフォルト形状を使用）
   - 背景透過の問題を修正（インラインスタイルと!importantクラスの両方を使用、opacity: 1を明示的に設定）
 - [x] Content: FrenelDeformableプロジェクトにGIF画像を追加（2025-10-30）
   - 「どんなアプローチか」セクションにDeviceImage.gifを追加（日本語・英語両方）
 - [x] Content: HapnrollプロジェクトにGIF画像を追加（2025-10-30）
   - 「アプローチ」セクションにconcept.gifを追加（日本語・英語両方）
 - [x] Content: FresnelShapeプロジェクトにGIF画像を追加（2025-10-30）
   - 「背景」セクションにbackground.gifを追加（日本語・英語両方）
   - 「アプローチ」セクションにaproach.gifを追加（日本語・英語両方）
 - [x] UI: プロジェクト詳細ページの関連論文カードを論文一覧と同じスタイルに統一（2025-10-30）
   - PaperListItemコンポーネントを使用するように変更
   - タグはクリック不可（onCategoryClickを渡さない）
## Next（次にやる）
- [ ] 認証設計に沿った編集可否の制御（docs/AuthDesign.md）を各ページに適用。
- [ ] コンテンツスキーマの最小合意（Projects/Papers/News）を src/lib/types.ts と Decap 設定（public/admin/config.yml）で揃える。
- [ ] i18n 文言の直書き撲滅（src/lib/i18n.ts 経由に統一）。

## Backlog（後でやる）
- [ ] Notion 連携のオン/オフをビルド時フラグ化（src/lib/notion.ts のモック/本番切替）。
- [ ] CI: 型チェックとビルド検証を GitHub Actions で自動化。
- [ ] Lighthouse ベースラインの取得と主要回帰の監視。

## Done（完了）
- [ ] （ここに完了したタスクを移動）

## メモ
- [x] 2025-09-28 MCP smoke: chrome-devtools-mcp 起動・接続ログ確認（headless/isolated）。GitHub MCP エンドポイント疎通OK（401＝トークン未付与を確認）。
- [ ] 2025-09-28 MCP 認証トークンの外部化: .codex/config.toml の GitHub トークンを環境変数へ移行（セキュリティ）。
- タスクを追加/完了したら、本ファイルを更新し、必要に応じて docs/PLAN.md のマイルストーンも更新してください。

- [x] 2025-09-28 chrome-devtools代替(Puppeteer) smoke: /admin→/edit バイパスOK、Proto iframe描画OK、console fatalなし(※favicon 404除外)
- [x] 2025-09-28 sdd-steering 実施: /admin ログインUIの暫定仕様確定、次アクション(M4/M3/M5/CI)整理
## 方針メモ（2025-09-29 / Proto移行）
- 編集UIを Portfolio_EditSystem_Proto に統一。Decapプレビュー連携は廃止（/admin は任意運用）。
- 型の一次情報を src/lib/types.ts に統一し、Protoのフォーム/プレビューと同期。
- JSON生成（Issue 11）とビルド統合（Issue 12）を Proto 由来に差し替え。
## 進捗（2025-09-29）
- [x] Issue05: NewsDraft 型・共通スキーマを src/lib/types.ts に追加。
- [x] Issue06: 編集画面に共通バリデーションを適用し、ライブプレビュー連携を確認。

- [x] Edit Mode: 公開ボタン→GitHub PR フロー（既存トークン再利用）
  - 2025-10-10 chrome-devtools: 未実行（dev server 未起動のため要フォローアップ）


