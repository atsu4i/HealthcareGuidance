# 📋 開発指示書: Gemini API パーソナルアシスタント

## 🎯 **プロジェクト概要**
- **名称**: Personal AI Assistant (Gemini-powered)
- **目的**: iPhone最適化のシンプルな対話型AIアシスタント
- **技術スタック**: Next.js 14 + TypeScript + Tailwind CSS + PWA
- **開発開始日**: 2025年7月25日

## 📂 **既存プロジェクトから活用する参考資料**

### 🔮 **Gemini API関連 (最重要)**
```bash
reference/original-project/api-client.js  # Gemini API統合ロジックの参考
# - Gemini認証・リクエスト処理
# - メッセージフォーマット変換  
# - ストリーミング対応
# - エラーハンドリング
```

### 🎨 **UI/UX参考資料**
```bash
reference/original-project/css/styles.css        # モバイル対応のベースCSS
reference/original-project/css/responsive.css    # レスポンシブデザインパターン
reference/original-project/css/animations.css    # チャット向けアニメーション
```

### 🛠️ **ユーティリティ・共通機能**
```bash
reference/original-project/utils.js          # 基本ユーティリティ関数
# - showNotification()
# - LocalStorage管理
# - 日付フォーマット等

reference/original-project/chat-manager.js   # チャット機能の核心ロジック
# - メッセージ管理
# - ストリーミング表示
# - 状態管理パターン
```

## 🚀 **Phase 1: プロジェクト初期化**

### 1.1 Next.js プロジェクト初期化 ✅ (完了)
```bash
# Next.js プロジェクト初期化
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

### 1.2 PWA設定追加 ✅ (完了)
```bash
npm install next-pwa
npm install @types/node # TypeScript型定義
```

### 1.3 参考資料コピー ✅ (完了)
```bash
# 既存プロジェクトから参考資料をコピー済み
reference/original-project/ 配下に配置完了
``` 

## 🏗️ **Phase 2: 基本アーキテクチャ構築**

### 2.1 ディレクトリ構造 ✅ (完了)
```
src/
├── app/
│   ├── layout.tsx          # ルートレイアウト
│   ├── page.tsx            # メインチャット画面
│   ├── api/
│   │   └── chat/
│   │       └── route.ts    # Gemini API エンドポイント
│   └── globals.css         # グローバルスタイル
├── components/
│   ├── ChatInterface.tsx   # メインチャット UI
│   ├── MessageBubble.tsx   # メッセージ表示
│   ├── InputArea.tsx       # 入力エリア
│   └── SettingsModal.tsx   # API設定モーダル
├── lib/
│   ├── gemini-client.ts    # Gemini API クライアント
│   ├── storage.ts          # LocalStorage管理
│   └── utils.ts            # ユーティリティ関数
├── types/
│   └── index.ts            # TypeScript型定義
└── hooks/
    ├── useChat.ts          # チャット状態管理
    └── useSettings.ts      # 設定管理
```

### 2.2 PWA設定ファイル ✅ (完了)
- `next.config.js` - PWA設定
- `public/manifest.json` - PWAマニフェスト
- アイコンファイル群

## 🔮 **Phase 3: Gemini API統合**

### 3.1 既存ロジックの移植・最適化
```typescript
// src/lib/gemini-client.ts
// reference/original-project/api-client.js の Gemini部分を
// TypeScriptに移植・簡素化
```

### 3.2 API Route作成
```typescript
// src/app/api/chat/route.ts
// Next.js 14 App Router対応のAPI実装
```

### 3.3 Gemini API設定
- API認証システム
- リクエスト/レスポンス処理
- エラーハンドリング
- ストリーミング対応

## 📱 **Phase 4: モバイル最適化UI**

### 4.1 レスポンシブチャットUI
```tsx
// iPhone最適化のチャットインターフェース
// - 全画面活用
// - タッチ操作最適化
// - 縦画面専用レイアウト
```

### 4.2 Tailwind設定カスタマイズ
```javascript
// tailwind.config.js
// モバイルファーストなブレークポイント設定
```

### 4.3 コンポーネント実装
- ChatInterface: メインチャット画面
- MessageBubble: メッセージ表示コンポーネント
- InputArea: テキスト入力エリア
- SettingsModal: 設定モーダル

## ⚙️ **Phase 5: 機能実装**

### 5.1 必須機能
- [x] Gemini API チャット
- [x] メッセージ履歴保存
- [x] APIキー設定
- [x] ダークモード対応

### 5.2 iPhone特化機能
- [x] PWAホーム画面追加
- [x] オフライン対応
- [ ] 音声入力対応 (Web Speech API) - 今後実装
- [x] 高速起動最適化

## 🚢 **Phase 6: デプロイ・公開**

### 6.1 Vercelデプロイ設定
```bash
# Vercel CLI設定
npm i -g vercel
vercel --prod
```

### 6.2 カスタムドメイン・HTTPS
```
your-assistant.vercel.app
または独自ドメイン設定
```

## 📋 **開発チェックリスト**

### 必須実装項目:
- [x] Next.js 14 + TypeScript セットアップ
- [x] PWA設定 (manifest.json, service worker)
- [x] 基本ディレクトリ構造作成
- [x] TypeScript型定義
- [x] 基本コンポーネント骨組み
- [ ] Gemini API統合 (既存ロジック移植)
- [ ] モバイル最適化UI実装
- [ ] LocalStorage設定管理
- [ ] メッセージ履歴機能
- [ ] ダークモード対応
- [ ] エラーハンドリング
- [ ] Vercelデプロイ
- [ ] iPhone実機テスト

### 推奨実装項目:
- [ ] 音声入力対応
- [ ] プッシュ通知
- [ ] オフライン機能
- [ ] アニメーション最適化
- [ ] SEO対応

## 🎨 **デザイン方針**

### UI/UX原則:
1. **シンプルファースト** - 必要最小限の要素のみ
2. **モバイルファースト** - iPhone縦画面を最優先
3. **高速起動** - 初回表示を3秒以内
4. **直感操作** - 説明不要のインターフェース
5. **アクセシビリティ** - 片手操作可能

### カラーパレット:
- **プライマリ**: 深めのブルー系 (#1f2937)
- **アクセント**: ミントグリーン (#10b981)  
- **背景**: 純白/ダークグレー
- **テキスト**: 高コントラスト

## 🔧 **技術的考慮事項**

### パフォーマンス:
- Next.js SSR/SSGの活用
- 画像最適化 (next/image)
- コード分割とレイジーローディング
- Service Workerによるキャッシュ戦略

### セキュリティ:
- APIキーの安全な管理
- CSP (Content Security Policy) 設定
- HTTPS強制

### 互換性:
- iOS Safari 15+
- PWA対応ブラウザ
- Touch操作対応
- 音声認識API対応

## 📚 **参考資料の活用方法**

### Gemini API関連:
```javascript
// reference/original-project/api-client.js から移植すべき要素:
// 1. Gemini認証ロジック
// 2. リクエスト/レスポンス処理
// 3. ストリーミング実装
// 4. エラーハンドリングパターン
```

### UI/UX関連:
```scss
// reference/original-project/css/ から活用すべき要素:
// 1. レスポンシブブレークポイント
// 2. アニメーション定義
// 3. モバイル最適化CSS
```

## 🚀 **開発スケジュール目安**

### Day 1: 基盤構築
- [x] プロジェクト初期化
- [x] 基本構造作成
- [ ] Gemini API統合

### Day 2: UI実装
- [ ] メインチャット画面
- [ ] レスポンシブ対応
- [ ] ダークモード

### Day 3: 機能完成
- [ ] 設定機能
- [ ] 履歴機能
- [ ] PWA最適化

### Day 4: テスト・デプロイ
- [ ] iPhone実機テスト
- [ ] Vercelデプロイ
- [ ] 最終調整

---

## 📞 **サポート・質問**

開発中に疑問や課題が生じた場合は、既存プロジェクトの実装パターンを参考にしながら、段階的に実装を進めてください。

**重要**: このプロジェクトは既存のロールプレイチャットとは完全に独立した新規プロジェクトです。シンプルさを重視し、必要最小限の機能に絞って開発を進めることが成功の鍵です。