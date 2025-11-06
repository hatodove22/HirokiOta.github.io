# About ページ更新方法

1. About ページは src/pages/about-page.tsx の静的配列（	imeline, goals, wards など）を直接編集して更新します。
2. 多言語対応の文言がある場合は getTranslations(locale) の辞書を更新し、locale === 'ja' ? ... : ... の条件分岐を最新化します。
3. 画像の差し替えが必要な場合は src/assets/37d3f...png など参照元のファイルを置き換えます。
4. 更新後は 
pm run build を実行し、chrome-devtools MCP で About ページが期待通り表示されることを確認します。

