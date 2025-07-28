# 📱 Personal AI Assistant

iPhone最適化のシンプルなGemini APIパーソナルアシスタント

## 🚀 特徴

- 🔮 **Gemini AI統合**: 3つのGeminiモデル対応（Pro/Flash/Flash-Lite）
- 📱 **iPhone最適化**: PWA対応、縦画面特化UI
- ⚡ **高速起動**: Next.js 14 + TypeScript
- 🌙 **ダークモード**: 自動切り替え対応
- 💾 **履歴保存**: LocalStorage による永続化
- 🔒 **セキュア**: APIキーの安全な管理
- 🎭 **キャラクター**: 献身的なメイドAIとの対話
- 💬 **LINE風UI**: なじみやすいチャット形式

## 🛠️ 技術スタック

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **AI**: Google Gemini API (2.5-pro, 2.5-flash, 2.5-flash-lite)
- **PWA**: Service Worker、オフライン対応
- **UI**: モバイルファースト、タッチ最適化
- **Deploy**: Vercel / Docker (Synology NAS対応)

## 📦 開発環境構築

### 必要要件
- Node.js 18+
- npm または yarn
- Gemini API キー

### インストール
```bash
# リポジトリをクローン
git clone <repository-url>
cd gemini-personal-assistant

# 依存関係をインストール
npm install

# 開発サーバー起動
npm run dev
```

開発サーバーは http://localhost:3000 で起動します。

### 利用可能なコマンド
```bash
npm run dev      # 開発サーバー起動
npm run build    # 本番用ビルド
npm run start    # 本番サーバー起動
npm run lint     # ESLint実行
```

## 🔧 設定

### Gemini API キーの取得
1. [Google AI Studio](https://aistudio.google.com/app/apikey)にアクセス
2. 新しいAPIキーを作成
3. APIキーをコピー（`AIza`で始まる文字列）

### アプリケーション設定
1. アプリを起動
2. 設定ボタン（⚙️）をタップ
3. Gemini APIキーを入力
4. お好みのモデルを選択：
   - **🔮 Gemini 2.5 Pro**: 最高品質（遅い）
   - **⚡ Gemini 2.5 Flash**: バランス型（推奨）
   - **💨 Gemini 2.5 Flash Lite**: 高速（軽量）

## 📱 PWAインストール

### iPhone/Safari
1. Safariでアプリにアクセス
2. 画面下部の共有ボタンをタップ
3. 「ホーム画面に追加」を選択
4. アプリ名を確認して「追加」

### Android/Chrome
1. Chromeでアプリにアクセス
2. アドレスバーの「インストール」をタップ
3. 確認ダイアログで「インストール」

## 🏗️ アーキテクチャ

### フォルダ構成
```
src/
├── app/
│   ├── layout.tsx          # PWAメタデータ、ビューポート設定
│   ├── page.tsx            # メインチャットページ
│   └── api/chat/           # Gemini APIプロキシ
├── components/
│   ├── ChatInterface.tsx   # メインチャットUI
│   ├── MessageBubble.tsx   # メッセージ表示
│   ├── InputArea.tsx       # 入力エリア
│   ├── SettingsModal.tsx   # 設定モーダル
│   └── ChatHistoryModal.tsx # 履歴管理
├── hooks/
│   ├── useChat.ts          # チャット状態管理
│   └── useSettings.ts      # 設定管理
├── lib/
│   ├── gemini-client.ts    # Gemini APIクライアント
│   ├── storage.ts          # LocalStorage管理
│   ├── system-prompt.ts    # AIキャラクター設定
│   └── utils.ts            # ユーティリティ関数
└── types/index.ts          # TypeScript型定義
```

### 主要機能
- **チャット管理**: セッション単位での会話履歴保存
- **ストリーミング**: リアルタイムな応答表示
- **オフライン対応**: PWAによるキャッシュ機能
- **レスポンシブUI**: iPhone縦画面最適化

## 🚀 デプロイ

### Vercel（推奨）
```bash
# Vercel CLIインストール
npm i -g vercel

# デプロイ実行
vercel --prod
```

### Docker / Synology NAS
```bash
# Docker Composeでビルド・起動
docker-compose up -d --build

# アクセス: http://[NAS_IP]:3001
```

詳細な手順は `DEPLOYMENT.md` を参照してください。

## 🔧 カスタマイズ

### AIキャラクターの変更
`src/lib/system-prompt.ts` でキャラクター設定を変更できます。

### UIテーマの調整
Tailwind CSSクラスでカラーパレットやレイアウトを変更可能です。

### 新しいGeminiモデルの追加
`src/lib/gemini-client.ts` の `GEMINI_MODELS` オブジェクトに追加します。

## 📚 開発リソース

- [開発指示書](DEVELOPMENT_INSTRUCTIONS.md): 詳細な開発ガイドライン
- [デプロイ手順](DEPLOYMENT.md): Synology NAS等への配置方法
- [Claude Code設定](CLAUDE.md): AI開発アシスタント用の設定情報

## 🐛 トラブルシューティング

### よくある問題

**APIキーエラー**
- APIキーが正しく入力されているか確認
- Google AI Studioでキーが有効か確認

**PWAインストールできない**
- HTTPSでアクセスしているか確認
- Service Workerが正しく動作しているか確認

**チャットが表示されない**
- ブラウザのローカルストレージをクリア
- ページをリロードして再試行

## 📄 ライセンス

MIT License

## 🤝 コントリビューション

プルリクエストやイシューの投稿を歓迎します。開発前に `DEVELOPMENT_INSTRUCTIONS.md` をご確認ください。
