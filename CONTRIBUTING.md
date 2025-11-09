# コントリビューションガイド

AI保健指導シミュレーターへのコントリビューションをご検討いただき、ありがとうございます！

## 🤝 貢献方法

### Issue の作成

バグ報告や機能リクエストは [GitHub Issues](https://github.com/atsu4i/HealthcareGuidance/issues) にてお願いします。

**バグ報告の場合:**
- 再現手順を詳しく記載してください
- 期待される動作と実際の動作を明記してください
- 環境情報（OS、ブラウザ、Node.jsバージョン等）を含めてください
- 可能であればスクリーンショットやエラーメッセージを添付してください

**機能リクエストの場合:**
- どのような機能が必要か具体的に説明してください
- その機能がどのように役立つかを記載してください
- 可能であれば実装イメージや例を提示してください

### プルリクエスト

1. **リポジトリをフォーク**
   ```bash
   git clone https://github.com/YOUR_USERNAME/HealthcareGuidance.git
   cd HealthcareGuidance
   ```

2. **ブランチを作成**
   ```bash
   git checkout -b feature/your-feature-name
   # または
   git checkout -b fix/your-bug-fix
   ```

3. **依存関係をインストール**
   ```bash
   npm install
   ```

4. **開発サーバーで動作確認**
   ```bash
   npm run dev
   ```

5. **変更をコミット**
   ```bash
   git add .
   git commit -m "feat: 機能の説明" # または "fix: バグ修正の説明"
   ```

6. **プッシュしてPRを作成**
   ```bash
   git push origin feature/your-feature-name
   ```

## 📝 コミットメッセージ規約

わかりやすいコミットメッセージを心がけてください：

- `feat:` - 新機能の追加
- `fix:` - バグ修正
- `docs:` - ドキュメントのみの変更
- `style:` - コードの動作に影響しない変更（空白、フォーマット等）
- `refactor:` - バグ修正や機能追加ではないコードの変更
- `test:` - テストの追加や修正
- `chore:` - ビルドプロセスやツールの変更

例：
```
feat: 新しい患者シナリオ「糖尿病管理困難」を追加
fix: AIフィードバック生成時のエラーを修正
docs: README.mdにDocker導入手順を追加
```

## 🎯 貢献のアイデア

以下のような貢献を特に歓迎します：

### 新しい患者シナリオの追加
- 多様な患者タイプの追加（年齢層、疾患、心理プロフィール等）
- 実際の保健指導現場で遭遇するケースの再現
- 詳細は [CLAUDE.md](CLAUDE.md) の「Adding New Scenarios」を参照

### フィードバック評価基準の改善
- より実践的な評価観点の追加
- 保健師の指導スキル向上に役立つフィードバック内容
- `src/app/api/feedback/route.ts` の `FEEDBACK_PROMPT` をカスタマイズ

### UI/UXの向上
- モバイル体験の改善
- アクセシビリティの向上
- レスポンシブデザインの最適化

### 多言語対応
- 現在は日本語のみですが、他言語対応のPRも歓迎します
- まずはIssueで議論してから実装を進めてください

### ドキュメントの改善
- わかりやすい説明の追加
- 図やスクリーンショットの追加
- 誤字脱字の修正

## 🛠️ 開発ガイドライン

### コードスタイル

- **TypeScript**: 型安全性を重視し、`any`の使用は避けてください
- **フォーマット**: ESLintに従ってコードをフォーマットしてください
  ```bash
  npm run lint
  ```
- **コンポーネント**: 機能ごとに適切に分割してください
- **命名規則**:
  - コンポーネント: PascalCase（例: `ChatInterface.tsx`）
  - 関数/変数: camelCase（例: `loadScenario`）
  - 定数: UPPER_SNAKE_CASE（例: `GEMINI_MODELS`）

### 開発前の確認事項

1. **[CLAUDE.md](CLAUDE.md) を確認**
   プロジェクトのアーキテクチャ、設計パターン、実装の詳細を理解してください

2. **既存のIssueを確認**
   同じ内容の報告や提案がないかチェックしてください

3. **動作確認**
   変更後は実際のiPhone（または Safari のレスポンシブモード）で動作を確認してください

4. **ビルドテスト**
   ```bash
   npm run build
   ```
   ビルドエラーがないことを確認してください

### テストについて

現時点ではテストフレームワークは導入されていません。テスト導入のPRも歓迎します。

## 🔒 セキュリティ

セキュリティに関する問題を発見した場合は、公開のIssueではなく、リポジトリのメンテナーに直接連絡してください。

**重要事項:**
- APIキーやトークンなどの秘密情報を絶対にコミットしないでください
- `.gitignore`に`.env*`が含まれていることを確認してください
- 個人情報や機密情報を含むサンプルデータは使用しないでください

## 📄 ライセンス

このプロジェクトに貢献することで、あなたのコントリビューションが [MIT License](LICENSE) の下でライセンスされることに同意したものとみなされます。

## 💬 質問やサポート

- 技術的な質問: [GitHub Discussions](https://github.com/atsu4i/HealthcareGuidance/discussions)（設定されている場合）
- バグ報告: [GitHub Issues](https://github.com/atsu4i/HealthcareGuidance/issues)
- 機能リクエスト: [GitHub Issues](https://github.com/atsu4i/HealthcareGuidance/issues)

---

あなたのコントリビューションを心よりお待ちしています！🎉
