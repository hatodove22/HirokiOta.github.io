# Spec Driven Development 運用メモ

このプロジェクトは Spec Driven Codex を導入済みです。最小限の運用フローは次の通り。

1) 要件定義: `.sdd/target-spec.txt` を更新し、変更の範囲と受入条件を箇条書きで明示。
2) 設計: `sdd-design.md` を使い、UI/データ/ルーティング/バックエンドの観点を整理。
3) 実装: `sdd-implement.md` を使い、編集対象ファイル・変更点・検証方針を具体化。
4) 検証: UI 影響があれば chrome-devtools MCP（必須）で動作確認。結果を `docs/TODO.md` に1行メモ。
5) ふりかえり: `sdd-steering.md` に学びを追記し、`sdd-archive.md` に成果を記録。

補足: 一枚仕様の全体像は `.sdd/description.md` に置く。Codex からは SDD 各プロンプトを開いて運用する。

