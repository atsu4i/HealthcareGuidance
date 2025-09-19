// 新卒エンジニア用履歴書サンプル
import { Resume } from '@/types'

export const entryLevelEngineerResume: Resume = {
  id: 'entry-level-engineer',
  name: '新卒エンジニア（田中太郎）',
  personalInfo: {
    fullName: '田中太郎',
    email: 'taro.tanaka@example.com',
    phone: '090-1234-5678',
    address: '東京都新宿区西新宿1-1-1',
    dateOfBirth: '2001年4月15日'
  },
  education: [
    {
      school: '東京工業大学',
      degree: '学士',
      major: '情報理工学院',
      graduationYear: '2024年3月',
      gpa: '3.8'
    }
  ],
  experience: [
    {
      company: '株式会社テックスタート',
      position: 'ソフトウェアエンジニア（インターン）',
      startDate: '2023年8月',
      endDate: '2024年2月',
      description: [
        'Reactを使用したWebアプリケーションの開発',
        'Node.js/Expressでのバックエンド開発',
        'GitHubを使ったチーム開発とコードレビュー',
        'ユニットテストの作成とCI/CDパイプラインの構築'
      ]
    }
  ],
  skills: {
    technical: [
      'JavaScript', 'TypeScript', 'React', 'Node.js',
      'Python', 'Git', 'Docker', 'AWS基礎',
      'HTML/CSS', 'SQL'
    ],
    languages: [
      '日本語（ネイティブ）',
      '英語（TOEIC 780点）'
    ],
    certifications: [
      'AWS Cloud Practitioner',
      '基本情報技術者試験'
    ]
  },
  projects: [
    {
      name: 'タスク管理アプリケーション',
      description: 'React + Node.jsで構築したチーム向けタスク管理システム',
      technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Docker'],
      duration: '2023年10月〜2024年1月'
    },
    {
      name: '大学祭Webサイト',
      description: '大学祭実行委員会のWebサイトを制作・運営',
      technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Vercel'],
      duration: '2023年6月〜2023年11月'
    }
  ],
  interests: [
    'プログラミング', 'Web開発', '新技術の学習',
    'オープンソース貢献', 'アルゴリズム問題解決'
  ],
  selfIntroduction: '大学でコンピュータサイエンスを学び、特にWeb開発に興味を持って学習を続けてきました。インターンシップでは実際の開発現場でチーム開発の経験を積み、技術力だけでなくコミュニケーション能力も向上させることができました。新しい技術への好奇心が強く、常に学習を続けて成長していきたいと考えています。'
}

export default entryLevelEngineerResume