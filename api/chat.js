const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const systemPrompt = `あなたはSQL学習をサポートするAIアシスタントです。以下の役割を果たしてください：

1. SQL初心者に分かりやすく説明する
2. 具体的なコード例を示す
3. 実践的なアドバイスを提供する
4. 学習者のレベルに合わせた回答をする
5. 日本語で丁寧に応答する

現在の学習コンテンツ：
- SELECT文の基本
- WHERE句でのフィルタリング
- ORDER BYでの並び替え
- 演算子の使い方
- COUNT・GROUP BYでの集計
- JOIN文（内部結合・外部結合）

回答は簡潔で実用的にし、必要に応じてSQLのサンプルコードを含めてください。`;

export default async function handler(req, res) {
  // CORS設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // プリフライトリクエストの処理
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // POSTメソッドのみ許可
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, currentPage } = req.body;
    
    // 入力検証
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: '有効なメッセージを入力してください。' });
    }

    if (message.length > 1000) {
      return res.status(400).json({ error: 'メッセージが長すぎます。1000文字以内で入力してください。' });
    }

    // OpenAI APIキーの確認
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI APIキーが設定されていません。' });
    }

    const contextMessage = currentPage ? 
      `現在学習中のページ: ${currentPage}ページ目\n\nユーザーの質問: ${message}` : 
      message;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: contextMessage }
      ],
      max_tokens: 500,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    });

    const reply = completion.choices[0]?.message?.content;
    
    if (!reply) {
      throw new Error('OpenAI APIからの応答が取得できませんでした。');
    }

    res.json({ 
      reply: reply.trim(),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('チャットAPI エラー:', error);
    
    if (error.code === 'insufficient_quota') {
      return res.status(429).json({ 
        error: 'OpenAI APIの利用制限に達しました。しばらく時間をおいて再試行してください。' 
      });
    }
    
    if (error.code === 'invalid_api_key') {
      return res.status(401).json({ 
        error: 'APIキーが無効です。管理者にお問い合わせください。' 
      });
    }

    res.status(500).json({ 
      error: 'チャット機能で問題が発生しました。しばらく時間をおいて再試行してください。' 
    });
  }
}