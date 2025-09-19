// 中途エンジニア用履歴書サンプル
import { Resume } from '@/types'

export const seniorEngineerResume: Resume = {
  id: 'senior-engineer',
  name: '中途エンジニア（佐藤花子）',
  personalInfo: {
    fullName: '佐藤花子',
    email: 'hanako.sato@example.com',
    phone: '090-9876-5432',
    address: '神奈川県横浜市中区本町1-1-1',
    dateOfBirth: '1990年8月20日'
  },
  education: [
    {
      school: '慶應義塾大学',
      degree: '学士',
      major: '理工学部情報工学科',
      graduationYear: '2013年3月',
      gpa: '3.6'
    }
  ],
  experience: [
    {
      company: '株式会社メガテック',
      position: 'シニアソフトウェアエンジニア',
      startDate: '2020年4月',
      endDate: '2024年3月',
      description: [
        'マイクロサービスアーキテクチャを採用したECプラットフォームの設計・開発',
        'Kubernetes環境でのコンテナオーケストレーション',
        'チームリーダーとして5名のエンジニアをマネジメント',
        'GraphQL APIの設計と実装',
        'パフォーマンス改善により応答時間を30%向上'
      ]
    },
    {
      company: '株式会社イノベート',
      position: 'フルスタックエンジニア',
      startDate: '2016年4月',
      endDate: '2020年3月',
      description: [
        'React/Redux + Spring Bootを使用したWebアプリケーション開発',
        'AWS環境でのインフラ構築とCI/CD導入',
        'レガシーシステムのモダン化プロジェクトをリード',
        '新人エンジニアのメンタリング'
      ]
    },
    {
      company: '株式会社スタートアップ',
      position: 'ソフトウェアエンジニア',
      startDate: '2013年4月',
      endDate: '2016年3月',
      description: [
        'Ruby on Railsを使用したWebサービスの新機能開発',
        'フロントエンドをjQueryからReactに移行',
        'テスト駆動開発の導入とコードカバレッジ90%達成'
      ]
    }
  ],
  skills: {
    technical: [
      'JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue.js',
      'Node.js', 'Express', 'NestJS', 'Python', 'FastAPI',
      'Java', 'Spring Boot', 'Ruby', 'Ruby on Rails',
      'PostgreSQL', 'MySQL', 'MongoDB', 'Redis',
      'Docker', 'Kubernetes', 'AWS', 'GCP',
      'Terraform', 'Jenkins', 'GitHub Actions'
    ],
    languages: [
      '日本語（ネイティブ）',
      '英語（TOEIC 920点、業務レベル）'
    ],
    certifications: [
      'AWS Solutions Architect Professional',
      'Kubernetes Certified Application Developer',
      'Oracle Java Programmer Gold'
    ]
  },
  projects: [
    {
      name: 'ECプラットフォームリニューアル',
      description: 'レガシーシステムをマイクロサービス化し、スケーラビリティを大幅に改善',
      technologies: ['Next.js', 'NestJS', 'PostgreSQL', 'Kubernetes', 'AWS'],
      duration: '2022年1月〜2023年12月'
    },
    {
      name: 'リアルタイム分析システム',
      description: 'Kafka + Elasticsearchによるリアルタイムデータ分析基盤の構築',
      technologies: ['Python', 'Kafka', 'Elasticsearch', 'Docker', 'GCP'],
      duration: '2021年6月〜2022年3月'
    },
    {
      name: 'モバイルファーストWebアプリ',
      description: 'PWAを活用したモバイル最適化Webアプリケーションの開発',
      technologies: ['React', 'TypeScript', 'PWA', 'Firebase'],
      duration: '2019年4月〜2020年2月'
    }
  ],
  interests: [
    'アーキテクチャ設計', 'パフォーマンス最適化', 'DevOps',
    'エンジニアリングマネジメント', 'テックリード',
    'オープンソース開発', '技術ブログ執筆'
  ],
  selfIntroduction: '11年間のソフトウェア開発経験を持ち、フルスタックエンジニアとして様々な技術スタックでの開発に携わってきました。特にWebアプリケーションの設計・開発とクラウドインフラの構築を得意としています。近年はテックリードとしてチームをまとめ、技術的な意思決定とメンバーの成長支援に注力しています。新しい技術への適応力と、ビジネス価値の創出を意識した開発を心がけています。'
}

export default seniorEngineerResume