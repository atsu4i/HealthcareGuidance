# 📱 Personal AI Assistant

iPhone最適化のシンプルなGemini APIパーソナルアシスタント

## 🚀 特徴

- 🔮 **Gemini AI統合**: 3つのGeminiモデル対応（Pro/Flash/Flash-Lite）
- 📱 **iPhone最適化**: PWA対応、縦画面特化UI
- ⚡ **高速起動**: Next.js 14 + TypeScript
- 🌙 **ダークモード**: 自動切り替え対応
- 💾 **履歴保存**: LocalStorage による永続化
- 🔒 **セキュア**: APIキーの安全な管理

## 🛠️ 技術スタック

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **AI**: Google Gemini API
- **PWA**: next-pwa
- **Deploy**: Vercel

## 📦 インストール

```bash
npm install
npm run dev
```

## 🔧 設定

1. [Google AI Studio](https://aistudio.google.com/app/apikey)でAPIキーを取得
2. アプリ内の設定画面でAPIキーを入力
3. お好みのGeminiモデルを選択

## 📱 PWAインストール

1. iPhoneのSafariでアクセス
2. 共有ボタン → ホーム画面に追加
3. ネイティブアプリのように使用可能

## 🚀 デプロイ

```bash
vercel --prod
```

## 📄 ライセンス

MIT License
