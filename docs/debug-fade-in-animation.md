# フェードインアニメーション デバッグ調査ドキュメント

## 問題の概要
- リロード時にはフェードインアニメーションが動作する
- ページ遷移時にはフェードインアニメーションが動作しない

## 原因の切り分けチェックリスト

### 1. React Stateの変更確認
- [ ] `pageFadeIn`が`false`→`true`に正しく変更されているか
- [ ] `currentPage`や`currentSlug`の変更が正しく検知されているか
- [ ] `useEffect`が正しく実行されているか

### 2. DOM更新のタイミング確認
- [ ] `opacity: 0`の状態で新しいページがレンダリングされているか
- [ ] `opacity: 1`に変更されるタイミングが適切か
- [ ] Reactの再レンダリングが完了しているか

### 3. CSS Transitionの適用確認
- [ ] `main`要素に`transition: 'opacity 3000ms ease-in-out'`が適用されているか
- [ ] インラインスタイルが正しく適用されているか
- [ ] 他のCSSが上書きしていないか
- [ ] `transition`プロパティが有効になっているか

### 4. タイミングの問題
- [ ] `setPageFadeIn(false)`が実行された後、DOMが更新されるまで待っているか
- [ ] `setPageFadeIn(true)`が実行される前に、`opacity: 0`の状態が確実に適用されているか
- [ ] `requestAnimationFrame`のタイミングが適切か

## デバッグログの確認ポイント

### コンソールログで確認すべき項目

1. **`=== NAVIGATE CALLED ===`**
   - `navigate`関数が呼ばれているか
   - `pageFadeIn`の現在の値

2. **`=== PAGE CHANGE DETECTED ===`**
   - `useEffect`が実行されているか
   - `currentPage`や`currentSlug`が正しく変更されているか
   - `pageFadeIn`の現在の値

3. **`=== STATE CHANGE ===`**
   - `pageFadeIn`の値が変化しているか
   - DOM要素の`opacity`が実際に変化しているか

4. **`=== MAIN ELEMENT RENDERED ===`**
   - `main`要素が再レンダリングされているか
   - インラインスタイルの`opacity`が正しく設定されているか
   - 計算された`opacity`が正しいか
   - `transition`プロパティが適用されているか

5. **`First RAF` / `Second RAF`**
   - DOM更新のタイミングが適切か
   - `opacity: 0`が適用されているか

6. **`DOM opacity before fade in` / `DOM opacity after fade in`**
   - フェードイン前後の`opacity`値
   - `transition`が適用されているか

## 確認手順

1. ブラウザの開発者ツールを開く
2. コンソールタブを開く
3. ページ遷移を実行
4. コンソールログを確認し、上記のチェックポイントを確認
5. DOM要素を検査し、`main`要素のスタイルを確認

## 想定される原因

### 原因1: React Stateの更新タイミング
- `setPageFadeIn(false)`と`setPageFadeIn(true)`が同じレンダリングサイクルで実行されている
- Reactのバッチ更新により、`opacity: 0`が適用される前に`opacity: 1`に変更されている

### 原因2: CSS Transitionが適用されていない
- インラインスタイルの`transition`が正しく適用されていない
- 他のCSSが`transition`を上書きしている

### 原因3: DOM更新のタイミング
- `requestAnimationFrame`のタイミングが不適切
- Reactの再レンダリングが完了する前に`opacity: 1`に変更されている

### 原因4: useEffectの依存配列
- `useEffect`が正しく実行されていない
- クリーンアップ関数がタイマーをキャンセルしている

## 次のステップ

デバッグログを確認し、どの段階で問題が発生しているかを特定する。

