# 認証機構 詳細設計書（Decap CMS × GitHub App × Vercel Functions）

本書は、GitHub Pages でホスティングするフロント（サイト本体 + Decap CMS `/admin`）に対し、別ホスト（Vercel Functions）で GitHub App 認証を提供するための詳細設計を定義する。

---

## 1. 目的
- Decap CMS の GitHub backend で必要となる OAuth トークン交換を安全に行う。
- 当該リポジトリの「共同編集者（`push` 以上）」のみを編集可能に制限する。
- PR プレビュー → 自己マージの公開フローに自然に統合する。
- 常時稼働サーバを持たず、サーバレス（Vercel Functions）で最小運用とする。

---

## 2. 要件・制約
- フロントは GitHub Pages 配信（静的）。
- 認証は別リポ（例: `decap-auth`）として Vercel にデプロイ。
- 認可判定は GitHub API で対象リポのコラボレータ権限（`push` 以上）を確認。
- 返却するトークンは Decap CMS が GitHub API 操作に使用可能なトークンであること。
- CORS/オリジン制限・CSRF 対策（`state` 検証）・秘密情報の保護（環境変数管理）。

---

## 3. 全体構成（概要）
```
GitHub Pages（本リポ）
  └ /admin (Decap CMS) ──→  認証開始: GET https://<vercel-app>/api/auth?origin=<pages-origin>
                                   │
                                   ▼
                           GitHub App OAuth 認可画面
                                   │ code
                                   ▼
                           GET https://<vercel-app>/api/callback?code=...&state=...
                                   │  1) code→ユーザアクセストークンに交換（GitHub App OAuth）
                                   │  2) /user でログイン名取得
                                   │  3) /repos/{owner}/{repo}/collaborators/{login}/permission で権限確認
                                   │  4) App の installation を取得→installation access token 発行
                                   ▼
                        HTML(ポップアップ) が window.opener.postMessage({token, provider:'github'})
                                   │
                                   ▼
                              Decap CMS がトークン受領→以後 GitHub API で CRUD
```

---

## 4. GitHub App 設定
- App 種別: GitHub App（OAuth App ではない）
- Callback URL: `https://<vercel-app>/api/callback`
- 必要な権限（Repository Permissions）
  - Contents: Read & write（必須｜コミット/ファイル作成/編集）
  - Pull requests: Read & write（必須｜editorial workflow の PR 作成/更新）
  - Metadata: Read（既定）
  - Issues: 任意（必要なら）
- Webhook: 任意（今回は不要）
- インストール: 対象リポ（本番用）にインストールしておく

---

## 5. Vercel Functions（API 仕様）

### 5.1 エンドポイント一覧
- `GET /api/auth` 認証開始（GitHub へリダイレクト）
- `GET /api/callback` 認証コールバック（トークン発行・ポップアップで親に返却）
- `GET /api/health` ヘルスチェック（200 OK）

### 5.2 クエリ/パラメータ
- `/api/auth`
  - `origin`: 必須。Decap を開いているサイトのオリジン（例: `https://<user>.github.io/<repo>`）。戻り先検証に使用。
- `/api/callback`
  - `code`: 必須。GitHub からの認可コード
  - `state`: 必須。CSRF 対策用の一致検証

### 5.3 レスポンス
- `/api/auth`: 302 リダイレクト（GitHub 認可 URL）
- `/api/callback`: text/html（最小 HTML）。ポップアップで `window.opener.postMessage({ token, provider: 'github' }, origin)` を実行し、自動で `window.close()`。

---

## 6. 環境変数（Vercel）
- `GITHUB_APP_ID`（数値）
- `GITHUB_APP_CLIENT_ID`
- `GITHUB_APP_CLIENT_SECRET`
- `GITHUB_APP_PRIVATE_KEY`（PEM 文字列。\n を含む）
- `GITHUB_OWNER`（対象リポのオーナー）
- `GITHUB_REPO`（対象リポ名）
- `ALLOWED_ORIGINS`（カンマ区切り。`https://<pages-origin>` 等）
- `SESSION_SECRET`（state 用ハッシュ/署名鍵）
- （任意）`LOG_LEVEL`、`SENTRY_DSN`

注記（Quickstartとの差分）
- Quickstart の `.env` 例にある `WEBHOOK_SECRET` や `PRIVATE_KEY_PATH` は、今回の用途（Decap の認証）では不要／非推奨。
  - Webhook は扱わないため `WEBHOOK_SECRET` は不要。
  - サーバレスでは秘密鍵はファイルではなく `GITHUB_APP_PRIVATE_KEY` 環境変数で持つのが安全。

---

## 7. 詳細フロー

1) `/api/auth`
- `origin` を検証（`ALLOWED_ORIGINS` に含まれるか）
- `state` を生成（`SESSION_SECRET` で署名）→ Cookie or Encrypted State として保持
- GitHub App OAuth URL を組み立てて 302 リダイレクト

2) `/api/callback`
- `code`/`state` の整合を検証（改ざん/期限切れ検知）
- 認可コードをユーザアクセストークンに交換（GitHub App OAuth flow）
- `GET /user` で `login` を取得
- `GET /repos/{owner}/{repo}/collaborators/{login}/permission` で `push` 以上を確認（非該当なら 403）
- App の installation を取得（例: `GET /repos/{owner}/{repo}/installation`）
- App JWT（private key から生成）で installation access token を作成（短期トークン）
- Decap 向けに `{ token, provider: 'github' }` を postMessage して終了
  - 備考：Decap v3 の GitHub App 対応状況により、インストールトークンで動作しない場合は、フォールバックとして OAuth App（ユーザトークン・`repo` スコープ）方式を選択できるよう抽象化しておく（後述「互換性」）。

---

## 8. 関数設計（擬似コード/役割）

```ts
// auth/start.ts
export async function startAuth(req, res) {
  const origin = getRequiredQuery(req, 'origin');
  assertAllowedOrigin(origin);
  const state = buildStateCookie(res, { origin });
  const authUrl = buildGitHubOAuthUrl({ clientId: env.CLIENT_ID, state });
  return redirect(res, authUrl);
}

// auth/callback.ts
export async function handleCallback(req, res) {
  const { code, state } = getRequiredQueryPair(req, ['code','state']);
  const { origin } = verifyStateCookie(req, state);

  const userToken = await exchangeCodeForUserToken(code); // GitHub App OAuth
  const login = await fetchGitHubUserLogin(userToken);

  const allowed = await assertCollaboratorPermission({ owner, repo, login, min: 'push' });
  if (!allowed) return forbidden(res, 'Not a collaborator');

  const installationId = await getInstallationIdForRepo({ owner, repo });
  const installationToken = await createInstallationAccessToken(installationId);

  return respondWithPopupHtml(res, {
    token: installationToken,
    provider: 'github',
    origin,
  });
}

// permissions.ts
export async function assertCollaboratorPermission({ owner, repo, login, min }) {
  const p = await ghGET(`/repos/${owner}/${repo}/collaborators/${login}/permission`);
  return ['admin','maintain','write','push'].includes(p.permission);
}

// app-token.ts
export function createAppJwt() { /* private key → JWT */ }
export async function createInstallationAccessToken(installationId) { /* Octokit apps.createInstallationAccessToken */ }

// crypto/state.ts
export function buildStateCookie(res, payload) { /* signed cookie (HttpOnly, SameSite=Lax) */ }
export function verifyStateCookie(req, state) { /* verify & parse */ }

// html/response.ts
export function respondWithPopupHtml(res, { token, provider, origin }) {
  // CSP付きの最小HTML。window.opener.postMessage({ token, provider }, origin); window.close();
}
```

---

## 9. セキュリティ設計
- CSRF: `state`（署名付き）で検証。`SameSite=Lax`/`HttpOnly` Cookie を使用。
- CORS/オリジン: `ALLOWED_ORIGINS` で厳密に制限。`postMessage` も `origin` を指定。
- 権限: コラボレータ（`push` 以上）のみ許可。必要に応じて `team` / `org` での追加制御も可能。
- トークン: Installation Access Token は短命（約 1 時間）。ログに出力しない。Vercel 環境変数の権限/監査。
- レート制限: 認証エンドポイントへ簡易レート制限（IP/時間帯）を推奨。
- 監査/可観測性: 失敗理由を分類ログ。個人情報は含めない。

---

## 9.1 GitHub App Quickstart との違いと適用方針
- Quickstart は「Webhook イベントに反応して処理（例: PR にコメント）」する App の作成手順。今回の用途は「Decap の認証と権限制御」のみであり、Webhook は不要。
- Smee.io（Webhook プロキシ）も不要。ローカル検証は Vercel CLI（`vercel dev`）で関数を起動し、ブラウザで `/api/auth`→`/api/callback` を確認する。
- 必要権限は最小限（Contents/PR）。Quickstart の PR 権限に加え、コンテンツ操作のため Contents:RW を必須とする。
- 秘密鍵はファイルパスではなく、環境変数に PEM を直接設定する（サーバレス適合）。

---

## 10. Decap CMS 設定例（admin/config.yml）
```yaml
backend:
  name: github
  repo: <OWNER>/<REPO>
  branch: main
  base_url: https://<vercel-app-domain>
  auth_endpoint: /api/auth
  # （必要に応じて）squash_merges: true
  # （v3でのGitHub App対応はリリースノートを要確認）
media_folder: public/images/uploads
public_folder: /images/uploads
publish_mode: editorial_workflow

---

## 10.1 互換性（GitHub App Token / OAuth App Token）
- 推奨: GitHub App の Installation Access Token を Decap へ返す。
- 互換: 万一 Decap の実装/バージョン差で App トークンが使えない場合、OAuth App によるユーザトークン（`repo` スコープ）を返す実装に切替え可能にする。
  - 切替方法: 環境変数 `AUTH_MODE=github_app|oauth_app` で選択し、Functions 内で分岐実装。
  - どちらの方式でも「コラボレータ権限チェック」を必須とする。
```

---

## 11. エラー設計（例）
- 400: origin 不正 / パラメータ欠落
- 401: code 交換失敗 / ユーザトークン無効
- 403: コラボレータ権限なし
- 500: GitHub API 障害 / 予期せぬ例外
- HTML レスポンスでも失敗は `postMessage({ error })` を返し、UIで可視化

---

## 12. テスト観点
- 正常系: コラボレータが認証→Decap がトークン受領→PR 作成まで通る
- 異常系: state 不一致 / origin 不正 / 非コラボレータ / installation 未設定 / 期限切れトークン
- 負荷: 認証連続試行（レート制限で制御）
- セキュリティ: XSS（返却 HTML の CSP）・トークン漏えい対策の確認

---

## 13. 運用
- 監視: `/api/health` を Uptime で監視。
- ローテーション: `GITHUB_APP_PRIVATE_KEY`/クライアントシークレットの定期更新。
- 変更手順: App 権限追加時は Vercel 環境変数とデプロイを同期。
- 障害対応: 一時的に編集を停止（/admin にメッセージ）。

---

## 14. 将来拡張
- Device Flow 検討（現状 Decap 側の対応が必要）
- 多リポ対応（オーナー/リポの可変化 + 許可リスト）
- 監査ログの外部出力（OpenTelemetry/Sentry）

---

## 付記：スマホの GitHub アプリを認証に使えるか
- モバイルアプリ自体は通知/2FA の補助であり、Decap が必要とする OAuth の「コード交換（クライアントシークレット/鍵扱い）」を代替しない。
- 現実解は本設計のとおり、Vercel Functions 等で最小の OAuth エンドポイントを用意すること。
