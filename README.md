# 📱 AI保健指導シミュレーター

iPhone最適化のGemini AI搭載保健指導練習アプリ

## 🚀 特徴

- 🎯 **AI保健指導練習**: リアルなシナリオベースの模擬面談
- 🔮 **Gemini AI統合**: 3つのGeminiモデル対応（Pro/Flash/Flash-Lite）
- 👥 **多様な対象者**: 13種類の患者シナリオ（協力的・防衛的・無関心など）
- 📊 **詳細な設定**: 健康診断結果、生活習慣、心理プロフィール
- 💡 **AIフィードバック**: 面談後に指導技術の評価とアドバイス
- 💾 **エクスポート・インポート**: 履歴のバックアップと復元が可能
- 📱 **iPhone最適化**: PWA対応、縦画面特化UI
- ⚡ **高速起動**: Next.js 14 + TypeScript
- 💾 **履歴保存**: 面談セッションの永続化
- 🔒 **セキュア**: APIキーの安全な管理
- 💬 **LINE風UI**: なじみやすいチャット形式

# 🛠️ 技術スタック

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **AI**: Google Gemini API (2.5-pro, 2.5-flash, 2.5-flash-lite)
- **PWA**: Service Worker、オフライン対応
- **UI**: モバイルファースト、タッチ最適化
- **シナリオ管理**: TypeScript型定義による患者プロフィール
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
cd ai-interview_HealthGuidance

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
5. 患者シナリオを選択して面談を開始

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
│   └── api/
│       ├── chat/route.ts   # Gemini APIプロキシ（チャット）
│       └── feedback/route.ts # AIフィードバック生成
├── components/
│   ├── ChatInterface.tsx   # メイン保健指導UI
│   ├── MessageBubble.tsx   # メッセージ表示
│   ├── InputArea.tsx       # 入力エリア
│   ├── SettingsModal.tsx   # 設定・シナリオ選択モーダル
│   ├── ResumeModal.tsx     # シナリオ詳細表示
│   ├── ResumeSelection.tsx # シナリオ選択コンポーネント
│   └── ChatHistoryModal.tsx # セッション履歴管理
├── hooks/
│   ├── useChat.ts          # 面談状態管理
│   └── useSettings.ts      # 設定・シナリオ管理
├── lib/
│   ├── gemini-client.ts    # Gemini APIクライアント
│   ├── storage.ts          # LocalStorage管理
│   ├── system-prompt.ts    # 保健指導プロンプト生成
│   └── utils.ts            # ユーティリティ関数
├── scenarios/              # 患者シナリオ定義（13種類）
│   ├── index.ts            # シナリオ管理
│   ├── cooperative-motivated.ts
│   ├── defensive-denial.ts
│   ├── indifferent-busy.ts
│   ├── knowledge-no-action.ts
│   ├── complex-background.ts
│   ├── young-prediabetes.ts
│   ├── elderly-multiple-conditions.ts
│   ├── mental-health-stress.ts
│   ├── family-unsupported.ts
│   ├── medical-distrust.ts
│   ├── economic-difficulty.ts
│   ├── shift-work-irregular.ts
│   └── living-alone-transfer.ts
└── types/index.ts          # TypeScript型定義
```

### 主要機能
- **シナリオ管理**: 13種類の多様な患者プロフィール
- **AI対象者ロールプレイ**: 各シナリオに基づいた一貫した応答
- **AIフィードバック**: 面談後の指導技術評価
- **セッション管理**: 面談履歴の保存と再開
- **エクスポート・インポート**: JSON形式でのデータバックアップ・復元
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

### 患者シナリオの追加・変更
1. `src/scenarios/` に新しいTypeScriptファイルを作成
2. `HealthGuidanceScenario` 型に従ってプロフィールを定義
3. `src/scenarios/index.ts` の `AVAILABLE_SCENARIOS` に追加
4. `loadScenario()` 関数にケースを追加

詳細は [CLAUDE.md](CLAUDE.md) の「Common Tasks」セクションを参照してください。

### フィードバック評価基準のカスタマイズ
`src/app/api/feedback/route.ts` の `FEEDBACK_PROMPT` を編集することで、評価観点や形式を変更できます。

### UIテーマの調整
Tailwind CSSクラスでカラーパレットやレイアウトを変更可能です。

### 新しいGeminiモデルの追加
`src/lib/gemini-client.ts` の `GEMINI_MODELS` オブジェクトに追加します。

## 💾 履歴のエクスポート・インポート

### エクスポート（バックアップ）
1. 履歴画面を開く
2. 「エクスポート」ボタンをタップ → 全履歴をダウンロード
3. または各セッションの「保存」ボタン → 個別にダウンロード

### インポート（復元）
1. 履歴画面を開く
2. 「インポート」ボタンをタップ
3. エクスポートしたJSONファイルを選択
4. 重複しないセッションのみが追加されます

**注意**: APIキーはセキュリティのため自動的に除外されます

## 📚 開発リソース

- [Claude Code設定](CLAUDE.md): AI開発アシスタント用の設定情報、アーキテクチャ詳細
- [デプロイ手順](DEPLOYMENT.md): Synology NAS等への配置方法（該当する場合）

### 利用可能な患者シナリオ
1. **佐藤健一（協力的・意欲的）** - メタボ改善に前向きな対象者
2. **山田太郎（防衛的・否認傾向）** - 健康問題を認めたくない防衛的な対象者
3. **鈴木美咲（無関心・多忙）** - 健康への関心が低く忙しさを理由にする対象者
4. **田中裕子（知識あり実行なし）** - 健康知識は豊富だが行動に移せない対象者
5. **伊藤誠（複雑な背景）** - 仕事・家庭のストレスなど複雑な背景を持つ対象者
6. **中村翔太（若年層・予備軍）** - 28歳IT勤務、若年層の生活習慣病予備軍
7. **高橋良子（高齢者・複数疾患）** - 68歳専業主婦、高血圧・骨粗鬆症などの既往症
8. **小林美咲（メンタル・ストレス）** - 35歳営業職、仕事と育児の両立でストレス過多
9. **佐々木恵子（家族非協力）** - 52歳パート、介護・家事・仕事の三重負担
10. **木村健（医療不信）** - 58歳自営業、医療や保健指導に懐疑的
11. **松本由美（経済的困難）** - 45歳シングルマザー、経済的理由で生活改善が難しい
12. **鈴木大輔（夜勤・交代勤務）** - 42歳工場勤務、夜勤で生活リズム不規則
13. **渡辺浩一（単身赴任）** - 48歳会社員、単身赴任中で健康管理が困難

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

**シナリオが選択できない**
- 設定画面でシナリオが正しく読み込まれているか確認
- ブラウザコンソールでエラーを確認

## 📄 ライセンス

MIT License

## 🤝 コントリビューション

プルリクエストやイシューの投稿を歓迎します。開発前に [CLAUDE.md](CLAUDE.md) をご確認ください。

### 貢献のアイデア
- 新しい患者シナリオの追加
- フィードバック評価基準の改善
- UI/UXの向上
- 多言語対応（現在は日本語のみ）
