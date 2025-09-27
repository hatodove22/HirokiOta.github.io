# GitHub backend セットアップ手順

Decap CMS で GitHub backend を利用するための最小構成です。以下の手順で OAuth 認証を有効化し、編集者が GitHub 上のコンテンツを更新できるようにします。

## 1. 前提条件

- 本リポジトリ (`yamaokayuki20/ota_portfolio`) への push 権限。
- Netlify などのサーバーレス環境。ここでは Netlify Functions + Identity を利用する想定です。
- GitHub アカウント（編集者がログインに使用）。

## 2. Netlify サイトの用意

1. Netlify で本リポジトリを import し、デプロイします。
2. Netlify ダッシュボードで **Site settings → Identity** を有効化し、外部ログインに GitHub を許可します。
3. **Identity → Services → Git Gateway** を有効化し、編集者に権限を付与します。

## 3. Decap CMS の `config.yml` 設定

`public/admin/config.yml` のバックエンド設定を次のように更新します。

```yaml
backend:
  name: github
  repo: yamaokayuki20/ota_portfolio
  branch: main
  base_url: https://<your-netlify-site>.netlify.app/.netlify/functions
  auth_endpoint: auth
  preview_context: deploy-preview
```

- `<your-netlify-site>` は Netlify サイト ID に置き換えてください。
- Netlify でデプロイすると CMS は `https://<your-netlify-site>.netlify.app/admin/` からアクセスできます。
- ローカル確認時は `local_backend: true` を有効にしたままで構いません（GitHub 認証なしでドラフト保存が可能です）。

## 4. 環境変数

Netlify 上では次の環境変数を設定しておくと便利です。

| 変数名 | 例 | 用途 |
| --- | --- | --- |
| `VITE_SITE_URL` | `https://<your-netlify-site>.netlify.app` | プレビューリンクの生成などに利用（任意） |

必要に応じてビルドコマンド (`npm run build`) や Node バージョンを Netlify ダッシュボードで設定してください。

## 5. 編集者への共有

- CMS URL（例: `https://<your-netlify-site>.netlify.app/admin/`）と、ログイン方法（GitHub 認証）を案内します。
- 編集者が初回ログインすると、GitHub による OAuth 認証が求められ、Git Gateway 経由でブランチ上に変更が作成されます。
- コンテンツは `content/news/` などリポジトリ上の Markdown ファイルとして管理されます。

## 6. ローカル開発との切り替え

- ローカル確認では `npm run dev` を実行して `http://localhost:3000/admin/` にアクセスします。
- 本番で GitHub backend を使う状態でも `local_backend: true` が有効なため、ブラウザの Dev モードではローカルストレージに保存されます。GitHub 連携を試す場合は Netlify 上で確認してください。

## 7. トラブルシューティング

| 症状 | 対処 |
| --- | --- |
| CMS ログイン画面で 404/500 | Netlify Identity や Functions の有効化を確認。ビルド後に `/.netlify/functions/auth` が存在するかチェック。 |
| ログイン後に `You are not authorized` | Git Gateway の権限付与を確認。編集者を Netlify Identity に招待して承認する。 |
| ローカルで GitHub 認証を試したい | `local_backend: false` に変更し、Netlify と同じ base_url/auth_endpoint を設定して実行する。 |

より詳細なカスタマイズは [Decap CMS の GitHub backend ドキュメント](https://decapcms.org/docs/backends-overview/#github-backend) を参照してください。

## GitHub App 認証（Functions 連携）テンプレート

本番運用時は Decap の backend を GitHub App 経由に切り替えます。最低限の構成は以下です。

1) Functions 側（例: Cloudflare Pages Functions / Vercel / Netlify Functions / Render）
- `POST /auth` を実装（GitHub App OAuth → コラボレータ権限チェック → CMS 用トークン発行）
- CORS 設定で `/admin` からの呼び出しを許可

2) public/admin/config.yml の backend を差し替え
```yml
backend:
  name: github
  repo: yamaokayuki20/ota_portfolio_auth
  branch: main
  base_url: https://<your-functions-host>/api   # ← あなたの Functions ルート
  auth_endpoint: auth                            # ← /api/auth を指す
  preview_context: deploy-preview
```

3) 開発時の切替
- 認証なしで動かすとき: `/admin/?dev=1`（config.yml は読まず、オブジェクト構成のみで初期化）
- 認証ありで確認: `/admin`（config.yml を使用）

4) セキュリティ
- Functions 側は GitHub API で `push` 権限を確認
- 発行トークンは短寿命・スコープ最小
- ログにトークンを残さない
