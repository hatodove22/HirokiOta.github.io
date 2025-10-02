# GitHub MCP セットアップガイド

## 問題の概要

GitHub MCPが利用できない問題を解決するためのセットアップガイドです。

## 解決手順

### 1. MCP設定ファイルの作成

`.cursor/mcp.json`ファイルを作成し、以下の設定を追加しました：

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": ""
      }
    },
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-chrome-devtools"
      ]
    }
  }
}
```

### 2. GitHub Personal Access Tokenの生成

1. GitHubにログイン
2. 右上のプロフィール画像をクリック → Settings
3. 左サイドバーの「Developer settings」をクリック
4. 「Personal access tokens」→「Tokens (classic)」をクリック
5. 「Generate new token」→「Generate new token (classic)」をクリック
6. 以下の設定でトークンを生成：
   - **Note**: `Cursor MCP GitHub Integration`
   - **Expiration**: 適切な期間を選択（推奨：90 days）
   - **Scopes**: 以下の権限を選択：
     - `repo` (Full control of private repositories)
     - `read:org` (Read org and team membership)
     - `read:user` (Read user profile data)
     - `user:email` (Access user email addresses)

### 3. トークンの設定

生成されたトークンを`.cursor/mcp.json`の`GITHUB_PERSONAL_ACCESS_TOKEN`に設定：

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_token_here"
      }
    }
  }
}
```

### 4. Cursorの再起動

MCP設定を有効にするために、Cursorを完全に再起動してください。

### 5. 動作確認

Cursor再起動後、以下のコマンドでGitHub MCPが利用可能か確認：

- `mcp_github_create_issue` - issue作成
- `mcp_github_list_issues` - issue一覧取得
- `mcp_github_get_issue` - issue詳細取得

## トラブルシューティング

### 認証エラーが発生する場合

1. トークンの権限を確認
2. トークンの有効期限を確認
3. `.cursor/mcp.json`の設定を再確認

### MCPサーバーが起動しない場合

1. Node.jsがインストールされているか確認
2. `npx`コマンドが利用可能か確認
3. ネットワーク接続を確認

### ログの確認

MCPログは以下の場所に保存されます：
- Windows: `%APPDATA%\Cursor\logs\[timestamp]\window[number]\exthost\anysphere.cursor-mcp\`

## セキュリティ注意事項

- GitHub Personal Access Tokenは機密情報です
- `.cursor/mcp.json`をGitにコミットしないでください
- トークンは定期的に更新してください
- 不要になったトークンは削除してください

## 参考リンク

- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [GitHub Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [Cursor MCP Documentation](https://docs.cursor.com/integrations/mcp)

