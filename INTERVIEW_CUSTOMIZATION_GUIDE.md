# 📝 面接カスタマイズガイド

このドキュメントでは、AI模擬面接アプリの面接スタンスや履歴書内容を変更する方法を詳しく説明します。

## 📋 目次

1. [面接スタンス・AI行動の変更](#1-面接スタンス・ai行動の変更)
2. [履歴書の作成・編集](#2-履歴書の作成・編集)
3. [履歴書データ構造の変更](#3-履歴書データ構造の変更)
4. [面接初期メッセージの変更](#4-面接初期メッセージの変更)
5. [UI表示の変更](#5-ui表示の変更)

---

## 1. 面接スタンス・AI行動の変更

### 📁 対象ファイル
`src/lib/system-prompt.ts`

### 🎯 変更箇所と方法

#### 1.1 基本的な面接スタンスの変更

**変更対象：** `BASE_INTERVIEW_PROMPT` 定数

```typescript
export const BASE_INTERVIEW_PROMPT = `あなたは模擬面接を行うAI面接候補者です。面接官からの質問に対して、提供された履歴書の情報に基づいて自然で誠実な回答をしてください。

## 基本的な役割と行動指針

### 面接候補者としての振る舞い
- 履歴書に記載された経歴・スキル・経験に基づいて一貫した回答をする
- 謙虚で誠実な態度を保ちつつ、自分の強みをアピールする
- 具体的なエピソードや数値を含めた説得力のある回答を心がける
- 面接官の質問の意図を理解し、適切な長さで回答する
```

**カスタマイズ例：**
- **より積極的な候補者にしたい場合：**
  ```
  - 自信を持って自分の強みを積極的にアピールする
  - チャレンジ精神旺盛で、新しい技術や領域への意欲を強調する
  ```

- **より謙虚な候補者にしたい場合：**
  ```
  - 控えめで聞き上手な姿勢を保つ
  - 自分の不足している点も正直に述べ、学習意欲を示す
  ```

#### 1.2 応答スタイルの変更

**変更対象：** `### 応答スタイル` セクション

```typescript
### 応答スタイル
- 丁寧で礼儀正しい敬語を使用する
- 緊張感のある面接の雰囲気を演出する
- 自分の経験について具体的に語る
- 質問に対して素直に答え、わからないことは正直に伝える
- 志望動機や将来のビジョンを明確に表現する
```

**カスタマイズ例：**
- **よりカジュアルな面接にしたい場合：**
  ```
  - 適度にフランクな口調も交える
  - リラックスした雰囲気を作る
  ```

- **より緊張感のある面接にしたい場合：**
  ```
  - 常に正式な敬語を使用する
  - 回答前に少し考える時間を取る表現を使う
  ```

#### 1.3 特定の業界・職種向けカスタマイズ

**追加方法：** `## 面接の進行` セクションの後に新しいセクションを追加

```typescript
## 業界固有の注意事項

### エンジニア面接の場合
- 技術的な質問には具体的なコード例や経験を交えて回答する
- 新しい技術への学習意欲を強調する
- チーム開発での経験やコミュニケーション能力もアピールする

### 営業面接の場合
- 数値目標の達成経験を具体的に語る
- 顧客との関係構築エピソードを含める
- チャレンジ精神と粘り強さを強調する
```

---

## 2. 履歴書の作成・編集

### 📁 対象ディレクトリ
`src/resumes/`

### 🎯 新しい履歴書の作成手順

#### 2.1 履歴書ファイルの作成

1. **新しいファイルを作成**
   ```
   src/resumes/your-new-resume.ts
   ```

2. **基本構造をコピー**
   既存の履歴書ファイル（`entry-level-engineer.ts` など）をコピーして使用

3. **履歴書内容の編集**

```typescript
// 新しい履歴書サンプル
import { Resume } from '@/types'

export const yourNewResume: Resume = {
  id: 'your-new-resume',
  name: '表示名（例：中途デザイナー（山田太郎））',
  personalInfo: {
    fullName: '山田太郎',
    email: 'taro.yamada@example.com',
    phone: '090-1234-5678',
    address: '東京都渋谷区渋谷1-1-1',
    dateOfBirth: '1990年1月1日'  // 省略可能
  },
  education: [
    {
      school: '東京美術大学',
      degree: '学士',
      major: 'デザイン学科',
      graduationYear: '2012年3月',
      gpa: '3.5'  // 省略可能
    }
  ],
  experience: [
    {
      company: 'デザイン株式会社',
      position: 'UIデザイナー',
      startDate: '2012年4月',
      endDate: '現在',
      description: [
        'モバイルアプリのUI/UXデザイン',
        'プロトタイプ作成とユーザーテスト実施',
        'デザインシステムの構築と運用'
      ]
    }
  ],
  skills: {
    technical: ['Figma', 'Sketch', 'Adobe Creative Suite', 'HTML/CSS'],
    languages: ['日本語（ネイティブ）', '英語（ビジネスレベル）'],
    certifications: ['色彩検定1級', 'UI/UX認定資格']
  },
  projects: [
    {
      name: 'ショッピングアプリリニューアル',
      description: 'ユーザビリティを大幅に改善し、コンバージョン率を30%向上',
      technologies: ['Figma', 'Principle', 'Maze'],
      duration: '2023年6月〜2024年2月'
    }
  ],
  interests: ['UI/UXデザイン', 'ユーザビリティ', 'デザインシンキング'],
  selfIntroduction: 'ユーザー中心のデザインを心がけ、使いやすく美しいインターフェースの設計を得意としています。'
}

export default yourNewResume
```

#### 2.2 履歴書をアプリに追加

**対象ファイル：** `src/resumes/index.ts`

1. **AVAILABLE_RESUMES配列に追加**
```typescript
export const AVAILABLE_RESUMES = [
  {
    id: 'entry-level-engineer',
    name: '新卒エンジニア（田中太郎）',
    description: '新卒のソフトウェアエンジニア向けの履歴書'
  },
  {
    id: 'senior-engineer',
    name: '中途エンジニア（佐藤花子）',
    description: '経験豊富なシニアエンジニア向けの履歴書'
  },
  // 新しい履歴書を追加
  {
    id: 'your-new-resume',
    name: '中途デザイナー（山田太郎）',
    description: '経験豊富なUIデザイナー向けの履歴書'
  }
] as const
```

2. **loadResume関数にケースを追加**
```typescript
export async function loadResume(resumeId: ResumeId): Promise<Resume | null> {
  try {
    switch (resumeId) {
      case 'entry-level-engineer': {
        const module = await import('./entry-level-engineer')
        return module.entryLevelEngineerResume
      }
      case 'senior-engineer': {
        const module = await import('./senior-engineer')
        return module.seniorEngineerResume
      }
      // 新しい履歴書のケースを追加
      case 'your-new-resume': {
        const module = await import('./your-new-resume')
        return module.yourNewResume
      }
      default:
        console.warn(`Unknown resume ID: ${resumeId}`)
        return null
    }
  } catch (error) {
    console.error(`Failed to load resume ${resumeId}:`, error)
    return null
  }
}
```

---

## 3. 履歴書データ構造の変更

### 📁 対象ファイル
`src/types/index.ts`

### 🎯 新しいフィールドの追加

履歴書に新しい情報を追加したい場合：

```typescript
export interface Resume {
  id: string
  name: string
  personalInfo: {
    fullName: string
    email: string
    phone: string
    address: string
    dateOfBirth?: string
    // 新しいフィールドを追加
    linkedIn?: string
    github?: string
    portfolio?: string
  }
  // ... 他のフィールドも同様に拡張可能

  // 完全に新しいセクションを追加
  awards?: {
    name: string
    year: string
    description: string
  }[]
}
```

### ⚠️ 注意事項
- データ構造を変更した場合は、既存の履歴書ファイルもすべて更新する必要があります
- `ResumeModal.tsx`のUI表示部分も対応する変更が必要です

---

## 4. 面接初期メッセージの変更

### 📁 対象ファイル
`src/hooks/useChat.ts`

### 🎯 変更箇所

**関数：** `createNewSession` 内の初期メッセージ生成部分

```typescript
// Generate initial message based on resume selection
let initialContent = '現在、面接用の履歴書が選択されていません。\n\n設定画面（⚙️）から履歴書を選択してください。履歴書を選択すると、その情報に基づいた模擬面接が始まります。'

if (settings.selectedResume) {
  const resumeInfo = getResumeInfo(settings.selectedResume as any)
  if (resumeInfo) {
    initialContent = `こんにちは。${resumeInfo.name}です。\n\n本日はお忙しい中、面接のお時間をいただきありがとうございます。どうぞよろしくお願いいたします。`
  }
}
```

**カスタマイズ例：**

```typescript
// より詳細な自己紹介にしたい場合
if (resumeInfo) {
  initialContent = `本日はお忙しい中、面接のお時間をいただきありがとうございます。\n\n${resumeInfo.name}と申します。この度は貴社の求人に応募させていただき、このような機会をいただけて大変光栄です。\n\n精一杯お答えさせていただきますので、どうぞよろしくお願いいたします。`
}

// よりカジュアルにしたい場合
if (resumeInfo) {
  initialContent = `こんにちは！${resumeInfo.name}です。\n\n今日はよろしくお願いします。何でも聞いてください！`
}
```

---

## 5. UI表示の変更

### 5.1 履歴書選択画面のカスタマイズ

**対象ファイル：** `src/components/ResumeSelection.tsx`

#### アイコンの変更
```typescript
<div className="text-2xl mt-1">
  {resume.id === 'entry-level-engineer' ? '🌱' : '⭐'}
</div>
```

**カスタマイズ：**
```typescript
// 職種に応じたアイコンに変更
<div className="text-2xl mt-1">
  {resume.id === 'entry-level-engineer' ? '🌱' :
   resume.id === 'senior-engineer' ? '⭐' :
   resume.id === 'designer' ? '🎨' :
   resume.id === 'manager' ? '👔' : '📝'}
</div>
```

### 5.2 履歴書表示モーダルのカスタマイズ

**対象ファイル：** `src/components/ResumeModal.tsx`

#### セクションの追加・削除
既存のセクション（学歴、職歴など）をコピーして新しいセクションを追加：

```typescript
{/* Awards Section - 新しいセクション例 */}
{resume.awards && resume.awards.length > 0 && (
  <section>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
      🏆 受賞歴
    </h3>
    <div className="space-y-3">
      {resume.awards.map((award, index) => (
        <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="font-medium text-gray-900 dark:text-gray-100">
            {award.name} ({award.year})
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {award.description}
          </div>
        </div>
      ))}
    </div>
  </section>
)}
```

---

## 🚀 よくあるカスタマイズパターン

### パターン1: 技術面接特化
- `system-prompt.ts`で技術的な質問に重点を置く設定
- 履歴書にプロジェクト詳細とGitHubリンクを追加
- 面接初期メッセージで「技術について詳しくお聞かせください」的な誘導

### パターン2: 営業面接特化
- `system-prompt.ts`で数値目標や顧客対応経験を重視
- 履歴書に営業成績や顧客満足度データを追加
- より積極的で自信に満ちた回答スタイルに設定

### パターン3: 新卒面接特化
- `system-prompt.ts`でポテンシャルや学習意欲を重視
- 履歴書にアルバイト経験や学生時代の活動を詳細化
- 謙虚で素直、成長意欲を示すスタイルに設定

---

## ⚠️ 変更時の注意事項

1. **TypeScript型チェック**
   - データ構造を変更した場合は、必ず `npm run build` で型エラーがないか確認

2. **既存データとの互換性**
   - 履歴書構造を変更する場合は、既存の履歴書ファイルもすべて更新

3. **テスト**
   - 変更後は実際にアプリを起動して動作確認を実施

4. **バックアップ**
   - 大きな変更を加える前は、現在の状態をgitでコミットしておく

---

このガイドに従って、面接スタイルや履歴書内容を自由にカスタマイズできます。何か不明な点があれば、各ファイルのコメントも参考にしてください。