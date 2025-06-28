# SQL学習サイト with OpenAI API

## 概要
PDFベースのSQL学習教材と、OpenAI APIを使ったAIチャット機能を組み合わせた学習サイトです。
Vercelサーバーレス関数で動作します。

## 機能
- 📚 PDF教材のビューアー（PDF.js使用）
- 🤖 OpenAI APIを使ったAI学習アシスタント
- 📱 レスポンシブデザイン
- 🎯 学習進捗管理
- 🔍 ページナビゲーション機能
- ☁️ Vercelサーバーレス関数

## 🚀 Vercelでのデプロイ

### 1. GitHubリポジトリの作成
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo-name.git
git push -u origin main
```

### 2. Vercelでのデプロイ
1. [Vercel](https://vercel.com)にログイン
2. 「New Project」をクリック
3. GitHubリポジトリを選択
4. 環境変数を設定：
   - `OPENAI_API_KEY`: あなたのOpenAI APIキー
5. 「Deploy」をクリック

### 3. ローカル開発
```bash
# 依存関係のインストール
npm install

# Vercel CLIのインストール（未インストールの場合）
npm install -g vercel

# 環境変数の設定
cp .env.example .env.local
# .env.localにOpenAI APIキーを設定

# ローカル開発サーバー起動
vercel dev
```

## ファイル構成
```
auto_SQL_teacher/
├── api/                # Vercelサーバーレス関数
│   ├── chat.js         # チャットAPI
│   └── health.js       # ヘルスチェックAPI
├── index.html          # メインページ
├── sql-course.pdf      # 学習教材（PDFファイル）
├── vercel.json         # Vercel設定
├── package.json        # npm設定
├── .env.example        # 環境変数のサンプル
├── .env.local          # ローカル環境変数（要作成）
├── .gitignore          # Git除外設定
└── README.md           # このファイル
```

## API仕様

### チャットAPI
- **エンドポイント**: `POST /api/chat`
- **リクエスト**:
  ```json
  {
    "message": "ユーザーのメッセージ",
    "currentPage": 1
  }
  ```
- **レスポンス**:
  ```json
  {
    "reply": "AIの応答",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
  ```

### ヘルスチェック
- **エンドポイント**: `GET /api/health`
- **レスポンス**:
  ```json
  {
    "status": "OK",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "openaiConfigured": true,
    "platform": "Vercel"
  }
  ```

## 環境変数

### Vercelダッシュボードで設定
- `OPENAI_API_KEY`: OpenAI APIキー

### ローカル開発用（.env.local）
```
OPENAI_API_KEY=your_openai_api_key_here
```

## セキュリティ機能
- CORS設定
- 入力検証とサニタイゼーション
- サーバーレス関数によるAPIキー保護
- リクエスト制限

## 注意事項
- OpenAI APIキーは環境変数で管理
- `.env.local` ファイルはGitにコミットしない
- VercelダッシュボードでAPIキーを設定する

## トラブルシューティング

### よくある問題
1. **APIが動かない**: 環境変数`OPENAI_API_KEY`が設定されているか確認
2. **CORS エラー**: `vercel.json`の設定を確認
3. **デプロイ失敗**: Node.jsバージョンが18以上であることを確認