# 🔧 デバッグ引き継ぎ文書: マークダウン処理の総合テスト

## 📋 プロジェクト概要

**プロジェクト名**: 博士課程学生ポートフォリオ V1  
**リポジトリ**: `https://github.com/yamaokayuki20/ota_portfolio`  
**現在のブランチ**: `feat/header-sticky-improvements`  
**開発サーバー**: `http://localhost:3011/` (Vite)  
**編集システム**: `http://localhost:5174/` (Portfolio_EditSystem_Proto)

## 🎯 現在の課題

### **メイン課題**
**エディタ → プレビューのマークダウン処理の総合テストが不完全**

- ✅ 単体テスト（テスト①〜④）は全て成功
- ❌ 統合テスト（実際のエディタ操作）が未完了
- ⚠️ エディタ画面へのアクセスに問題あり

### **具体的な問題**
1. **ナビゲーション問題**: サイドバーボタンのルーティング機能が動作しない
2. **エディタアクセス問題**: ホーム画面からエディタ画面への遷移ができない
3. **プレビュー確認問題**: エディタ入力からプレビュー表示までの完全なフローが確認できない

## 🏗️ システム構成

### **ディレクトリ構造**
```
Portfolio_EditSystem_Proto/
├── src/
│   ├── components/
│   │   ├── editors/
│   │   │   └── NewsEditor.tsx          # ニュース編集コンポーネント
│   │   ├── previews/
│   │   │   └── NewsPreview.tsx         # プレビューコンポーネント
│   │   ├── tiptap-templates/simple/
│   │   │   └── simple-editor.tsx       # メインエディタ（Tiptap）
│   │   └── sections/
│   │       └── NewsSection.tsx         # ニュースセクション（ルーティング制御）
│   ├── App.tsx                         # メインアプリケーション
│   └── main.tsx                        # エントリーポイント
├── package.json
├── vite.config.ts
└── tsconfig.json
```

### **主要コンポーネントの役割**

#### **1. App.tsx**
```typescript
// React Router設定
<Router>
  <Routes>
    <Route path="/" element={<Navigate to="/home" replace />} />
    <Route path="/home" element={<MainContent activeSection="home" />} />
    <Route path="/news" element={<MainContent activeSection="news" />} />
    <Route path="/news/new" element={<MainContent activeSection="news" />} />
    <Route path="/news/edit/:id" element={<MainContent activeSection="news" />} />
    // ... 他のルート
  </Routes>
</Router>
```

#### **2. NewsSection.tsx**
```typescript
// URLパスに基づく表示制御
const isEditing = location.pathname.includes('/edit/') || location.pathname === '/news/new';
const isList = location.pathname === '/news';

// 条件分岐レンダリング
if (isEditing && selectedItem) {
  return <NewsEditor item={selectedItem} onSave={handleSave} onCancel={handleCancel} />;
}
if (isList) {
  return <ContentList items={mockNewsData} type="news" onEdit={handleEdit} onNew={handleNew} />;
}
```

#### **3. SimpleEditor.tsx**
```typescript
// Tiptapエディタ + マークダウン出力
const editor = useEditor({
  extensions: [
    StarterKit,
    Markdown.configure({
      html: false,
      transformPastedText: true,
      transformCopiedText: true,
      linkify: true,
      breaks: true,
    }),
    // ... 他のエクステンション
  ],
  onUpdate: ({ editor }) => {
    // マークダウン出力ロジック
    const markdown = editor.storage.markdown.getMarkdown();
    onContentChange?.(markdown);
  },
});
```

#### **4. NewsEditor.tsx**
```typescript
// エディタとプレビューの連携
<SimpleEditor
  initialContent={item.body[language]}
  onContentChange={(markdown) => {
    updateLocalizedField('body', language, markdown);
  }}
/>
<NewsPreview item={updatedItem} language={language} theme={theme} />
```

#### **5. NewsPreview.tsx**
```typescript
// ハイブリッドレンダリング（JSON + マークダウン）
const renderContent = (content: string) => {
  try {
    // JSON形式（Static Renderer）を試行
    const jsonContent = JSON.parse(content);
    return renderToHTMLString(jsonContent, extensions);
  } catch {
    // マークダウン形式（markdown-it）にフォールバック
    return md.render(content);
  }
};
```

## 🧪 テスト状況

### **完了済みテスト**
- ✅ **テスト①**: エディタ入力 → マークダウン出力の検証 (17テストケース)
- ✅ **テスト②**: マークダウン → NewsEditor受け渡しの検証 (16テストケース)
- ✅ **テスト③**: マークダウン → HTML変換の検証 (24テストケース)
- ✅ **テスト④**: HTML → プレビュー表示の検証 (21テストケース)

### **未完了テスト**
- ❌ **総合テスト**: エディタ → プレビューの実機確認

### **テスト結果**
```
単体テスト: 78テストケース 全て成功 ✅
統合テスト: 60%成功 (3/5項目) ⚠️
```

## 🔍 現在の問題詳細

### **1. ナビゲーション問題**
**現象**: サイドバーのボタンをクリックしても画面が遷移しない

**調査結果**:
```json
{
  "sidebarInfo": {
    "found": true,
    "linkCount": 9,
    "links": [
      {"text": "ニュース", "href": null, "tagName": "BUTTON"},
      {"text": "新規作成", "href": null, "tagName": "BUTTON"}
    ]
  }
}
```

**問題点**:
- すべてのボタンが`BUTTON`要素として実装されている
- `href`属性が設定されていない
- クリックイベントハンドラーが正しく動作していない可能性

**推測される原因**:
1. `useNavigate`フックの設定問題
2. イベントハンドラーの実装不備
3. React Routerの設定問題

### **2. エディタアクセス問題**
**現象**: エディタ画面にアクセスできない

**調査結果**:
```json
{
  "editorInfo": [],  // エディタ要素が見つからない
  "previewInfo": [], // プレビュー要素が見つからない
  "url": "http://localhost:5174/home"  // ホーム画面に留まっている
}
```

**問題点**:
- ホーム画面からエディタ画面への遷移ができない
- エディタ関連の要素が存在しない状態

### **3. 開発サーバーの競合**
**現象**: 複数の開発サーバーが起動している

**現在の状況**:
- ポートフォリオ本体: `http://localhost:3011/` (Vite)
- 編集システム: `http://localhost:5174/` (Vite)
- 両方が同時に動作している状態

## 🛠️ デバッグ手順

### **ステップ1: 開発サーバーの確認**
```bash
# 編集システムのディレクトリに移動
cd Portfolio_EditSystem_Proto

# 開発サーバーの起動確認
npm run dev

# ポート確認
netstat -an | findstr :5174
```

### **ステップ2: ナビゲーション機能の調査**
```typescript
// AppSidebar.tsx の確認
const navigate = useNavigate();
const handleClick = () => navigate('/news'); // この部分が動作しているか確認

// ブラウザの開発者ツールでコンソールエラーを確認
// ネットワークタブでリクエストが送信されているか確認
```

### **ステップ3: エディタ画面への直接アクセス**
```bash
# 直接URLでエディタ画面にアクセス
http://localhost:5174/news/new
http://localhost:5174/news/edit/test-id
```

### **ステップ4: 手動テストの実行**
```bash
# 手動テストガイドを参照
cat manual-test-guide.md

# 簡略化された自動テストを実行
node simple-integration-test.js
```

## 📁 関連ファイル

### **主要ファイル**
- `src/App.tsx` - メインアプリケーション（React Router設定）
- `src/components/AppSidebar.tsx` - サイドバーナビゲーション
- `src/components/sections/NewsSection.tsx` - ニュースセクション制御
- `src/components/editors/NewsEditor.tsx` - ニュース編集画面
- `src/components/tiptap-templates/simple/simple-editor.tsx` - メインエディタ
- `src/components/previews/NewsPreview.tsx` - プレビュー表示

### **テストファイル**
- `src/components/tiptap-templates/simple/__tests__/simple-editor-markdown.test.tsx`
- `src/components/editors/__tests__/news-editor-markdown.test.tsx`
- `src/components/previews/__tests__/news-preview-markdown.test.tsx`
- `src/components/previews/__tests__/news-preview-rendering.test.tsx`

### **設定ファイル**
- `package.json` - 依存関係とスクリプト
- `vite.config.ts` - Vite設定
- `tsconfig.json` - TypeScript設定
- `jest.config.js` - Jest設定

### **デバッグ用ファイル**
- `integration-test.js` - 完全な統合テスト（未完成）
- `simple-integration-test.js` - 簡略化されたテスト（動作中）
- `manual-test-guide.md` - 手動テストガイド
- `simple-integration-test-report.json` - テスト結果レポート

## 🎯 デバッグの優先順位

### **高優先度**
1. **ナビゲーション機能の修正**
   - サイドバーボタンのクリックイベントの動作確認
   - React Routerの設定確認
   - コンソールエラーの調査

2. **エディタ画面へのアクセス確認**
   - 直接URLでのアクセステスト
   - エディタ要素の存在確認
   - ルーティングロジックの検証

### **中優先度**
3. **プレビュー機能の確認**
   - エディタ入力からプレビュー表示までのフロー
   - マークダウン → HTML変換の動作確認
   - リアルタイム更新の動作確認

### **低優先度**
4. **パフォーマンスの最適化**
   - 大量データでの動作確認
   - メモリ使用量の監視
   - レンダリング性能の測定

## 🔧 推奨デバッグツール

### **ブラウザ開発者ツール**
- **Console**: JavaScriptエラーの確認
- **Network**: リクエスト/レスポンスの確認
- **Elements**: DOM構造の確認
- **Sources**: ブレークポイントでのデバッグ

### **React開発者ツール**
- **Components**: コンポーネントの状態確認
- **Profiler**: レンダリング性能の測定

### **自動テストツール**
```bash
# 単体テストの実行
npm test

# 特定のテストファイルの実行
npm test -- --testPathPatterns=simple-editor-markdown.test.tsx

# カバレッジレポートの生成
npm run test:coverage
```

## 📊 現在の技術スタック

### **フロントエンド**
- **React**: 18.x
- **TypeScript**: 5.x
- **Vite**: 6.x
- **React Router**: 6.x

### **エディタ**
- **Tiptap**: 2.x
- **@tiptap/extension-markdown**: マークダウン処理
- **markdown-it**: HTML変換

### **テスト**
- **Jest**: 29.x
- **React Testing Library**: 14.x
- **Puppeteer**: 21.x（統合テスト用）

### **UI**
- **Tailwind CSS**: スタイリング
- **Radix UI**: コンポーネント
- **Lucide React**: アイコン

## 🚨 注意事項

### **既知の制限**
1. **SimpleEditor.tsx**: 複雑なマークダウン変換処理があるため、慎重に扱う
2. **開発サーバー**: 複数のサーバーが同時起動している状態
3. **モックデータ**: テスト用のモックデータを使用している

### **重要な警告**
- `SimpleEditor.tsx`の変更は慎重に行う（過去にレンダリングが壊れた経験あり）
- エディタの内部レンダリング機能を変更する場合は、必ずバックアップを取る
- マークダウン処理の変更は、単体テストで事前に検証する

## 📝 次のアクション

### **即座に実行すべきこと**
1. **ブラウザで手動テストを実行**
   ```
   http://localhost:5174 にアクセス
   → サイドバーの「ニュース」をクリック
   → 「新規作成」をクリック
   → エディタ画面が表示されるか確認
   ```

2. **コンソールエラーの確認**
   ```
   F12 → Console タブ
   → エラーメッセージを記録
   → Network タブでリクエスト状況を確認
   ```

3. **直接URLでのアクセステスト**
   ```
   http://localhost:5174/news/new
   http://localhost:5174/news/edit/test-id
   ```

### **問題解決後の確認事項**
1. **エディタ入力テスト**
   - マークダウン文章の入力
   - プレビューへの反映確認
   - リアルタイム更新の動作確認

2. **総合テストの完了**
   - 手動テストガイドに従った詳細確認
   - 自動テストスクリプトの実行
   - テスト結果の記録

## 📞 サポート情報

### **参考資料**
- **GitHub Issues**: #19, #29, #30, #31, #32, #33
- **README**: 起動方法の詳細説明
- **AGENTS.md**: 開発ルールとガイドライン

### **関連コミット**
- 最新のコミット: `feat/header-sticky-improvements`
- マークダウン処理の実装: Option 6 (`@tiptap/extension-markdown`)

### **環境情報**
- **OS**: Windows 10
- **Node.js**: 18.x
- **npm**: 9.x
- **開発サーバー**: Vite 6.x

---

**引き継ぎ完了日**: 2025年10月3日  
**引き継ぎ者**: Claude (AI Assistant)  
**受け取り者**: 次のデバッガー  

**重要**: この文書は現在の状況を正確に反映しています。問題解決の過程で新しい発見があった場合は、この文書を更新してください。
