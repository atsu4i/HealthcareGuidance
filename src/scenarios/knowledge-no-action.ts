// シナリオ4: 知識はあるが実行できない対象者
import { HealthGuidanceScenario } from '@/types'

export const knowledgeNoActionScenario: HealthGuidanceScenario = {
  id: 'knowledge-no-action',
  name: '田中裕子（知識あり実行なし）',
  description: '健康知識は豊富だが、行動に移せない対象者',
  personalInfo: {
    fullName: '田中裕子',
    age: 48,
    gender: '女性',
    occupation: '事務職（製薬会社）',
    familyStructure: '夫、子供2人（大学生、高校生）',
    address: '千葉県船橋市'
  },
  healthCheckResults: {
    date: '2024年10月',
    height: 160,
    weight: 72.0,
    bmi: 28.1,
    waistCircumference: 90,
    bloodPressure: {
      systolic: 135,
      diastolic: 87
    },
    bloodTest: {
      fastingBloodSugar: 112,
      hba1c: 6.0,
      ldlCholesterol: 158,
      hdlCholesterol: 50,
      triglycerides: 175,
      ast: 30,
      alt: 42,
      gammaGtp: 35
    },
    urineTest: {
      protein: '陰性',
      sugar: '陰性'
    }
  },
  lifestyle: {
    diet: {
      pattern: '1日3食、自炊中心だが量が多い',
      details: [
        '朝食：トースト、サラダ、ヨーグルト、果物',
        '昼食：手作り弁当（ご飯多め）',
        '夕食：栄養バランスを考えた料理だが量が多い',
        '間食：ヘルシーと思って食べるナッツやドライフルーツ',
        '飲み物：野菜ジュース、豆乳'
      ],
      problems: [
        '「健康的」な食品でも食べ過ぎ',
        '炭水化物の量が多い',
        'カロリー計算が甘い',
        '家族の残り物を食べてしまう'
      ]
    },
    exercise: {
      frequency: '不定期',
      details: [
        '週1-2回ウォーキング（気が向いた時）',
        'ヨガのオンライン動画を見る（続かない）',
        'ジムの会員だが行けていない'
      ],
      barriers: [
        '三日坊主',
        '仕事や家事を理由にサボる',
        '完璧にやろうとして続かない',
        '成果がすぐ出ないと諦める'
      ]
    },
    alcohol: {
      frequency: '週2-3回',
      amount: 'ビール350ml×1本',
      details: [
        '夫と一緒に晩酌',
        'カロリー控えめのお酒を選ぶ'
      ]
    },
    smoking: {
      status: '非喫煙'
    },
    sleep: {
      duration: '7時間',
      quality: '普通',
      problems: [
        '夜更かししがち',
        'スマホを見て寝るのが遅くなる'
      ]
    },
    stress: {
      level: '中',
      sources: [
        '子供の進路',
        '夫との関係',
        '自分の体型へのコンプレックス',
        '更年期症状'
      ],
      copingMethods: [
        '食べること',
        'ネットショッピング',
        '友人とのランチ'
      ]
    }
  },
  medicalHistory: {
    currentDiseases: [],
    pastDiseases: ['子宮筋腫（5年前に手術）'],
    medications: [],
    familyHistory: [
      '父：糖尿病',
      '母：高血圧、脂質異常症',
      '姉：肥満'
    ]
  },
  psychologicalProfile: {
    personality: '真面目で勉強熱心。完璧主義で自己評価が厳しい。',
    responseStyle: '知識あり実行なし',
    motivationLevel: '中',
    healthLiteracy: '高',
    concerns: [
      '健康について勉強しているのに実行できない',
      'ダイエット本をたくさん読んでいる',
      '過去に何度もダイエットに失敗',
      '知識と行動のギャップに悩んでいる'
    ],
    strengths: [
      '健康への関心が高い',
      '情報収集能力がある',
      '家族の協力が得られる',
      '自炊ができる'
    ]
  },
  backgroundStory: '製薬会社で事務職として働く48歳の女性。職場が医療関係なので健康情報に詳しく、栄養や運動の知識も豊富。しかし、知識と行動が伴わず、「わかっているけどできない」状態が続いている。過去に何度もダイエットに挑戦しては失敗しており、自己効力感が低い。完璧主義で、少しでもできないと「もういいや」と諦めてしまう傾向がある。',
  guidanceGoals: [
    '完璧主義からの脱却',
    '小さな成功体験の積み重ね',
    '知識を行動に変える具体的な計画',
    '適正な食事量の認識'
  ],
  expectedChallenges: [
    '理想と現実のギャップ',
    '完璧主義',
    '過去の失敗体験',
    '自己効力感の低さ',
    '言い訳が理論的'
  ]
}

export default knowledgeNoActionScenario
