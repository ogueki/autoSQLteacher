# リポジトリ ガイドライン（AGENTS.md）

## プロジェクト構造とモジュール整理
- `index.html`: PDF.js ビューアとチャットクライアントを備えたシングルページUI。
- `api/`: Vercel のサーバーレス関数。
  - `api/chat.js`: OpenAI を利用するチャット用エンドポイント。
  - `api/health.js`: ヘルスチェック用エンドポイント。
- `sql-course.pdf`: メインの学習用PDF。過去の教材は `old/` に格納。
- `vercel.json`: デプロイ設定、関数リソース制限、CORSヘッダー。
- `.env.example`: 環境変数のテンプレート。本物のシークレットは絶対にコミットしない。

## ビルド・テスト・開発コマンド
- `npm install`: 依存関係をインストール（Node 18以上が必要）。
- `npm run dev` または `vercel dev`: APIルート付きのローカル開発サーバを起動。
- `npm run build`: このUIは静的なので特に処理なし。APIはそのままデプロイされる。
- 簡易動作確認:
  - ヘルスチェック: `curl http://localhost:3000/api/health`
  - チャット確認:  
    ```bash
    curl -X POST http://localhost:3000/api/chat \
    -H "Content-Type: application/json" \
    -d '{"message":"SELECT help"}'
    ```

## コーディングスタイルと命名規則
- JavaScript, インデントはスペース2つ、セミコロン必須、文字列はシングルクォート。
- ファイル名: アセットやページは kebab-case、APIルートは `api/<name>.js`。
- 変数/関数: camelCase、定数: UPPER_SNAKE_CASE。
- サーバーレスハンドラは小さく、純粋に保つ。入力検証とCORS設定を必ず行う。
- `api/` ディレクトリは小さなモジュールを推奨。クライアント側のJSは `index.html` にインラインまたは小規模なヘルパーとして配置。

## テスト指針
- まだ正式なテストスイートはなし。導入する場合は `*.test.js` をソース近くに置く。
- 手動確認:
  - `OPENAI_API_KEY` が設定されていること（開発環境では `.env.local`）。
  - `/api/health` と `/api/chat` を正常系・異常系の両方で確認。
  - UIのオリジンに対してCORSが正しく機能することを確認。

## コミット・PR ガイドライン
- コミットメッセージは簡潔に、命令形で書く。必要ならスコープを付与（例: `api: validate chat payload`）。
- PRは以下を含めること：
  - 明確な説明と変更理由
  - テスト内容の記録
  - 関連Issueへのリンク
  - UI変更はスクリーンショット
  - API変更はサンプルリクエスト/レスポンス
- 変更が動作やコマンドに影響する場合は、`README.md` またはこのファイルを更新すること。

## セキュリティと設定
- シークレットを絶対にコミットしない。開発環境では `.env.local`、本番では Vercel の環境変数を利用。
- 必須の環境変数: `OPENAI_API_KEY`  
  任意: `PORT`, `CORS_ORIGIN`（ローカル環境用）
- CORS を強化する場合は `vercel.json` と各ルートのヘッダーの両方を更新。

## エージェントへの追加指示
- **このプロジェクトに関する応答は原則として日本語で行ってください。**
- 英語の用語（API名やコマンドなど）はそのまま残して構いません。
